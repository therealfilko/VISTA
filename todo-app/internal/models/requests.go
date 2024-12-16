package models

import "time"

type RegisterRequest struct {
    FirstName   string    `json:"first_name" validate:"required"`
    LastName    string    `json:"last_name" validate:"required"`
    Email       string    `json:"email" validate:"required,email"`
    DateOfBirth time.Time `json:"date_of_birth" validate:"required"`
    Password    string    `json:"password" validate:"required,min=8"`
}

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type CreateTodoRequest struct {
    Title       string `json:"title" validate:"required"`
    Description string `json:"description"`
}
