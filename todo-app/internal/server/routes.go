package server

import (
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/cors"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Validator = &CustomValidator{validator: validator.New()}

	// CORS Middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",
			"http://localhost:3000",
			"http://taskify.pixelding.de:5173",
			"https://taskify.pixelding.de:5173",
			"http://taskify.pixelding.de",
			"https://taskify.pixelding.de",
			"http://taskify.pixelding.de:9000",
			"https://taskify.pixelding.de:9000",
		},
		AllowedMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials:   true,
		Debug:              true,
		OptionsPassthrough: true,
	})

	// Wrap Echo mit CORS
	handler := corsMiddleware.Handler(e)

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

	return handler
}

func (s *Server) HelloWorldHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello World",
	}
	return c.JSON(http.StatusOK, resp)
}

func (s *Server) setCookie(c echo.Context, tokenString string) {
	domain := c.Request().Host
	if strings.Contains(domain, ":") {
		// Entferne Port-Nummer für lokale Entwicklung
		domain = strings.Split(domain, ":")[0]
	}

	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		Domain:   domain, // Dynamische Domain
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   false, // Temporär false für http
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)
}
