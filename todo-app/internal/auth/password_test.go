package auth

import "testing"

func TestPasswordService(t *testing.T) {
	ps := NewPasswordService()

	t.Run("Hash and Check Password", func(t *testing.T) {
		password := "test-password"

		// Hash password
		hash, err := ps.HashPassword(password)
		if err != nil {
			t.Fatalf("Failed to hash password: %v", err)
		}

		// Verify correct password
		if !ps.CheckPassword(password, hash) {
			t.Error("Password verification failed for correct password")
		}

		// Verify incorrect password
		if ps.CheckPassword("wrong-password", hash) {
			t.Error("Password verification succeeded for incorrect password")
		}
	})
}
