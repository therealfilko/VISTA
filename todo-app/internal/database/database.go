package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
)

type Service interface {
    Health() map[string]string
    Close() error
}

type service struct {
    db *sqlx.DB
}

var (
    database   = os.Getenv("BLUEPRINT_DB_DATABASE")
    password   = os.Getenv("BLUEPRINT_DB_PASSWORD")
    username   = os.Getenv("BLUEPRINT_DB_USERNAME")
    port       = os.Getenv("BLUEPRINT_DB_PORT")
    host       = os.Getenv("BLUEPRINT_DB_HOST")
    schema     = os.Getenv("BLUEPRINT_DB_SCHEMA")
)

func New() (Service, error) {
    connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s",
        username, password, host, port, database, schema)

    db, err := sqlx.Connect("pgx", connStr)
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %v", err)
    }

    // Run migrations
    if err := RunMigrations(db.DB); err != nil {
        return nil, fmt.Errorf("failed to run migrations: %v", err)
    }

    return &service{db: db}, nil
}

func (s *service) Health() map[string]string {
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()

    stats := make(map[string]string)

    err := s.db.PingContext(ctx)
    if err != nil {
        stats["status"] = "down"
        stats["error"] = fmt.Sprintf("db down: %v", err)
        return stats
    }

    stats["status"] = "up"
    stats["message"] = "It's healthy"

    dbStats := s.db.Stats()
    stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
    stats["in_use"] = strconv.Itoa(dbStats.InUse)
    stats["idle"] = strconv.Itoa(dbStats.Idle)

    return stats
}

func (s *service) Close() error {
    log.Printf("Disconnected from database: %s", database)
    return s.db.Close()
}
