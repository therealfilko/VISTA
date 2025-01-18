package auth

import (
    "net/http"

    "github.com/labstack/echo/v4"
)

func AuthMiddleware(jwtService *JWTService) echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            cookie, err := c.Cookie("access_token")
            if err != nil {
                return echo.NewHTTPError(http.StatusUnauthorized, "Missing authentication")
            }

            claims, err := jwtService.ValidateAccessToken(cookie.Value)
            if err != nil {
                return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
            }

            c.Set("userID", claims.UserID)
            return next(c)
        }
    }
}

func CSRFMiddleware() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            csrfCookie := &http.Cookie{
                Name:     "csrf_token",
                Value:    GenerateCSRFToken(),
                Path:     "/",
                HttpOnly: false,
                Secure:   true,
                SameSite: http.SameSiteStrictMode,
            }
            c.SetCookie(csrfCookie)
            return next(c)
        }
    }
}

func GenerateCSRFToken() string {
    return "csrf-token"
}
