package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"

	"todo-app/internal/auth"
	"todo-app/internal/database"
)

type Server struct {
	port       int
	db         database.Service
	jwtService *auth.JWTService
	tokenStore auth.TokenStore
}

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func NewServer() (*http.Server, error) {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	// Token Store initialisieren
	tokenStore := auth.NewMemoryTokenStore()

	// JWT Service mit beiden Secrets initialisieren
	jwtService := auth.NewJWTService(
		os.Getenv("JWT_ACCESS_SECRET"),
		os.Getenv("JWT_REFRESH_SECRET"),
		tokenStore,
	)

	db, err := database.New()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %v", err)
	}

	NewServer := &Server{
		port:       port,
		db:         db,
		jwtService: jwtService,
		tokenStore: tokenStore,
	}

	// Echo Server mit Validator
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server, nil
}
