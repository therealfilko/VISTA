package auth

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func AuthMiddleware(jwtService *JWTService) echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            authHeader := c.Request().Header.Get("Authorization")
            if authHeader == "" {
                return echo.NewHTTPError(http.StatusUnauthorized, "Missing authorization header")
            }

            tokenParts := strings.Split(authHeader, " ")
            if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
                return echo.NewHTTPError(http.StatusUnauthorized, "Invalid authorization format")
            }

            claims, err := jwtService.ValidateToken(tokenParts[1])
            if err != nil {
                return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
            }

            c.Set("userID", claims.UserID)
            return next(c)
        }
    }
}
