// internal/database/user_repository.go
package database

import (
	"fmt"
)

func (s *service) UpdatePassword(userID int64, hashedPassword string) error {
	query := `UPDATE users SET password_hash = $1 WHERE id = $2`

	result, err := s.db.Exec(query, hashedPassword, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
