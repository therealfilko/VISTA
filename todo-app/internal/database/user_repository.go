// internal/database/user_repository.go
package database

import (
	"fmt"
	"todo-app/internal/models"
)

func (s *service) CreateUser(user *models.User) error {
	query := `
        INSERT INTO users (first_name, last_name, email, date_of_birth, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, created_at`

	return s.db.QueryRow(
		query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.DateOfBirth,
		user.PasswordHash,
	).Scan(&user.ID, &user.CreatedAt)
}

func (s *service) GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT * FROM users WHERE email = $1`

	err := s.db.Get(user, query, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) GetUserByID(id int64) (*models.User, error) {
	user := &models.User{}
	query := `SELECT * FROM users WHERE id = $1`

	err := s.db.Get(user, query, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) UpdateUser(user *models.User) error {
	query := `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3, date_of_birth = $4
        WHERE id = $5`

	result, err := s.db.Exec(
		query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.DateOfBirth,
		user.ID,
	)
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
