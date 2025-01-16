package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (s *Server) authMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie("access_token")
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "Missing authentication")
		}

		claims, err := s.jwtService.ValidateAccessToken(cookie.Value)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
		}

		user, err := s.db.GetUserByID(claims.UserID)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "User not found")
		}

		c.Set("user", user)
		c.Set("tokenID", claims.TokenID)
		return next(c)
	}
}

func (s *Server) CSRFMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			csrfCookie := &http.Cookie{
				Name:     "csrf_token",
				Value:    GenerateCSRFToken(),
				Path:     "/",
				HttpOnly: false, // Client muss Token lesen können
				Secure:   true,
				SameSite: http.SameSiteStrictMode,
			}
			c.SetCookie(csrfCookie)
			return next(c)
		}
	}
}

func GenerateCSRFToken() string {
	// Implementiere sichere Token-Generierung
	// Beispiel: uuid.New().String()
	return "csrf-token"
}
