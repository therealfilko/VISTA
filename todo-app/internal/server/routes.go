package server

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Validator = &CustomValidator{validator: validator.New()}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://localhost:3000",
			"http://taskify.pixelding.de:5173",
			"https://taskify.pixelding.de:5173",
			"http://taskify.pixelding.de",
			"https://taskify.pixelding.de",
			"http://taskify.pixelding.de:9000",
			"https://taskify.pixelding.de:9000",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	// Public endpoints
	e.GET("/", s.HelloWorldHandler)

	// Auth routes
	auth := e.Group("/auth")
	auth.POST("/register", s.handleRegister)
	auth.POST("/login", s.handleLogin)
	auth.POST("/refresh", s.handleRefreshToken)
	auth.POST("/logout", s.handleLogout, s.authMiddleware)
	auth.GET("/me", s.handleGetMe, s.authMiddleware)

	// Protected routes
	api := e.Group("/api", s.authMiddleware)

	// Column routes
	columns := api.Group("/columns")
	columns.GET("", s.handleGetColumns)
	columns.POST("", s.handleCreateColumn)
	columns.PUT("/:id", s.handleUpdateColumn)
	columns.DELETE("/:id", s.handleDeleteColumn)

	// Todo routes
	todos := api.Group("/todos")
	todos.GET("", s.handleGetTodos)
	todos.POST("", s.handleCreateTodo)
	todos.GET("/:id", s.handleGetTodo)
	todos.PUT("/:id", s.handleUpdateTodo)
	todos.DELETE("/:id", s.handleDeleteTodo)
	todos.PATCH("/:id/done", s.handleToggleTodoDone)
	todos.PUT("/:id/position", s.handleUpdateTodoPosition)

	// User routes
	users := api.Group("/users")
	users.GET("/profile", s.handleGetProfile)
	users.PUT("/profile", s.handleUpdateProfile)
	users.PUT("/password", s.handleUpdatePassword)

	// Swagger routes
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	e.File("/swagger/doc.json", "docs/swagger.json")

	return e // Direkt Echo zurückgeben, nicht den CORS-Handler
}

func (s *Server) HelloWorldHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello World",
	}
	return c.JSON(http.StatusOK, resp)
}

