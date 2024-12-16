package server

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// JWTCustomClaims sind die custom claims für den JWT Token
type JWTCustomClaims struct {
	UserID int64 `json:"user_id"`
	jwt.RegisteredClaims
}

func (s *Server) authMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization format")
		}

		claims, err := s.validateJWT(tokenParts[1])
		if err != nil {
			fmt.Printf("Token validation error: %v\n", err)
			return echo.NewHTTPError(http.StatusUnauthorized, fmt.Sprintf("invalid token: %v", err))
		}

		user, err := s.db.GetUserByID(claims.UserID)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "user not found")
		}

		c.Set("user", user)
		return next(c)
	}
}
