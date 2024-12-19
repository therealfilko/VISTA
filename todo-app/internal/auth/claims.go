package auth

import "github.com/golang-jwt/jwt/v5"

// JWTCustomClaims definiert benutzerdefinierte Claims für das JWT
type JWTCustomClaims struct {
	UserID int64 `json:"user_id"`
	jwt.RegisteredClaims
}
