package auth

import (
	"testing"
)

func TestJWTService(t *testing.T) {
    secretKey := "test-secret"
    jwtService := NewJWTService(secretKey)

    t.Run("Generate and Validate Token", func(t *testing.T) {
        // Generate token
        userID := int64(1)
        email := "test@example.com"
        token, err := jwtService.GenerateToken(userID, email)
        if err != nil {
            t.Fatalf("Failed to generate token: %v", err)
        }

        // Validate token
        claims, err := jwtService.ValidateToken(token)
        if err != nil {
            t.Fatalf("Failed to validate token: %v", err)
        }

        if claims.UserID != userID {
            t.Errorf("Expected userID %d, got %d", userID, claims.UserID)
        }
        if claims.Email != email {
            t.Errorf("Expected email %s, got %s", email, claims.Email)
        }
    })

    t.Run("Invalid Token", func(t *testing.T) {
        _, err := jwtService.ValidateToken("invalid-token")
        if err == nil {
            t.Error("Expected error for invalid token, got nil")
        }
    })
}
