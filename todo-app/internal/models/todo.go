package models

import "time"

type Todo struct {
	ID          int64     `db:"id" json:"id"`
	Title       string    `db:"title" json:"title" validate:"required"`
	Description string    `db:"description" json:"description"`
	IsCompleted bool      `db:"is_completed" json:"is_completed"`
	UserID      int64     `db:"user_id" json:"user_id"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}
