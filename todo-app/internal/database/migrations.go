package database

import (
	"database/sql"
	"fmt"
	"log"
	"path/filepath"
	"runtime"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations(db *sql.DB) error {
    // Get the path to the migrations
    _, b, _, _ := runtime.Caller(0)
    basepath := filepath.Dir(b)
    migrationsPath := filepath.Join(basepath, "../../migrations")

    log.Printf("Migration path: %s", migrationsPath)

    driver, err := postgres.WithInstance(db, &postgres.Config{})
    if err != nil {
        log.Printf("Driver error: %v", err)
        return fmt.Errorf("could not create database driver: %v", err)
    }

    sourceURL := fmt.Sprintf("file://%s", migrationsPath)
    log.Printf("Source URL: %s", sourceURL)

    m, err := migrate.NewWithDatabaseInstance(
        sourceURL,
        "postgres",
        driver,
    )
    if err != nil {
        log.Printf("Migration instance error: %v", err)
        return fmt.Errorf("could not create migrate instance: %v", err)
    }

    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        log.Printf("Migration up error: %v", err)
        return fmt.Errorf("could not run migrations: %v", err)
    }

    log.Printf("Migrations completed successfully")
    return nil
}
