package server

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Validator hinzufügen
	e.Validator = &CustomValidator{validator: validator.New()}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"https://*", "http://*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Public endpoints
	e.GET("/", s.HelloWorldHandler)
	//e.GET("/health", s.healthHandler)

	// Auth routes
	auth := e.Group("/auth")
	auth.POST("/register", s.handleRegister)
	auth.POST("/login", s.handleLogin)
	auth.GET("/me", s.handleGetMe, s.authMiddleware)

	// Todo routes (protected)
	todos := e.Group("/todos", s.authMiddleware)
	todos.GET("", s.handleGetTodos)
	todos.POST("", s.handleCreateTodo)
	todos.GET("/:id", s.handleGetTodo)
	todos.PUT("/:id", s.handleUpdateTodo)
	todos.DELETE("/:id", s.handleDeleteTodo)
	todos.PATCH("/:id/done", s.handleToggleTodoDone)

	// User routes (protected)
	users := e.Group("/users", s.authMiddleware)
	users.GET("/profile", s.handleGetProfile)
	users.PUT("/profile", s.handleUpdateProfile)
	users.PUT("/password", s.handleUpdatePassword)

	return e
}

func (s *Server) HelloWorldHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello World",
	}
	return c.JSON(http.StatusOK, resp)
}
