package models

import "time"

type Column struct {
    ID        int64     `db:"id" json:"id"`
    Title     string    `db:"title" json:"title"`
    Position  int       `db:"position" json:"position"`
    UserID    int64     `db:"user_id" json:"user_id"`
    CreatedAt time.Time `db:"created_at" json:"created_at"`
}
