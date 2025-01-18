package server

import (
    "fmt"
    "os"
    "strconv"

    "github.com/go-playground/validator/v10"
    _ "github.com/joho/godotenv/autoload"

    "todo-app/internal/auth"
    "todo-app/internal/database"
)

type Server struct {
    Port       int
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

func NewServer() (*Server, error) {
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

    return &Server{
        Port:       port,
        db:         db,
        jwtService: jwtService,
        tokenStore: tokenStore,
    }, nil
}
