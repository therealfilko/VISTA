package models

import "time"

type Todo struct {
	ID          int64     `db:"id" json:"id"`
	Title       string    `db:"title" json:"title"`
	Description string    `db:"description" json:"description"`
	Done        bool      `db:"done" json:"done"`
	UserID      int64     `db:"user_id" json:"user_id"`
	ColumnID    int64     `db:"column_id" json:"column_id"`
	Position    int       `db:"position" json:"position"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}
