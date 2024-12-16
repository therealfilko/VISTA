package models

import "time"

type Todo struct {
	ID          int64     `db:"id" json:"id"`
	Title       string    `db:"title" json:"title"`
	Description string    `db:"description" json:"description"`
	Done        bool      `db:"done" json:"done"` // Hinzugefügt
	UserID      int64     `db:"user_id" json:"user_id"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}
