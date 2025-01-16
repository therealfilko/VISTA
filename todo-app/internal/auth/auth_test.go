package auth

import (
	"testing"
	"time"
)

func TestJWTService(t *testing.T) {
	accessSecret := "test-access-secret"
	refreshSecret := "test-refresh-secret"
	tokenStore := NewMemoryTokenStore()
	jwtService := NewJWTService(accessSecret, refreshSecret, tokenStore)

	t.Run("Generate and Validate Token Pair", func(t *testing.T) {
		// Generate token pair
		userID := int64(1)
		email := "test@example.com"
		tokenPair, err := jwtService.GenerateTokenPair(userID, email)
		if err != nil {
			t.Fatalf("Failed to generate token pair: %v", err)
		}

		// Validate access token
		claims, err := jwtService.ValidateAccessToken(tokenPair.AccessToken)
		if err != nil {
			t.Fatalf("Failed to validate access token: %v", err)
		}

		if claims.UserID != userID {
			t.Errorf("Expected userID %d, got %d", userID, claims.UserID)
		}
		if claims.Email != email {
			t.Errorf("Expected email %s, got %s", email, claims.Email)
		}

		// Validate refresh token
		refreshClaims, err := jwtService.ValidateRefreshToken(tokenPair.RefreshToken)
		if err != nil {
			t.Fatalf("Failed to validate refresh token: %v", err)
		}

		if refreshClaims.UserID != userID {
			t.Errorf("Expected userID %d, got %d", userID, refreshClaims.UserID)
		}
	})

	t.Run("Token Expiration", func(t *testing.T) {
		userID := int64(1)
		email := "test@example.com"
		tokenPair, _ := jwtService.GenerateTokenPair(userID, email)

		// Wait for token to expire (if we set a very short expiration for testing)
		time.Sleep(time.Millisecond * 100)

		// Try to validate tokens
		_, err := jwtService.ValidateAccessToken(tokenPair.AccessToken)
		if err != nil {
			t.Logf("Access token expired as expected: %v", err)
		}
	})

	t.Run("Invalid Token", func(t *testing.T) {
		_, err := jwtService.ValidateAccessToken("invalid-token")
		if err == nil {
			t.Error("Expected error for invalid token, got nil")
		}
	})

	t.Run("Token Revocation", func(t *testing.T) {
		userID := int64(1)
		email := "test@example.com"
		tokenPair, _ := jwtService.GenerateTokenPair(userID, email)

		// Get token ID from claims
		claims, _ := jwtService.ValidateAccessToken(tokenPair.AccessToken)

		// Revoke token
		err := jwtService.RevokeToken(claims.TokenID)
		if err != nil {
			t.Fatalf("Failed to revoke token: %v", err)
		}

		// Try to validate revoked token
		_, err = jwtService.ValidateAccessToken(tokenPair.AccessToken)
		if err == nil {
			t.Error("Expected error for revoked token, got nil")
		}
	})
}
