package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
    ID           int64     `db:"id" json:"id"`
    FirstName    string    `db:"first_name" json:"first_name" validate:"required"`
    LastName     string    `db:"last_name" json:"last_name" validate:"required"`
    Email        string    `db:"email" json:"email" validate:"required,email"`
    DateOfBirth  time.Time `db:"date_of_birth" json:"date_of_birth" validate:"required"`
    PasswordHash string    `db:"password_hash" json:"-"`
    CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

func (u *User) SetPassword(password string) error {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.PasswordHash = string(hash)
    return nil
}

func (u *User) CheckPassword(password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
    return err == nil
}
