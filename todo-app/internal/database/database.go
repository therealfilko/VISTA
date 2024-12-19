package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"todo-app/internal/models"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
)

type Service interface {
	Health() map[string]string
	Close() error

	// User methods
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int64) (*models.User, error)
	UpdateUser(user *models.User) error
	UpdatePassword(userID int64, hashedPassword string) error

	// Todo methods
	GetTodosByUserID(userID int64) ([]models.Todo, error)
	CreateTodo(todo *models.Todo) error
	GetTodoByID(id int64) (*models.Todo, error)
	UpdateTodo(todo *models.Todo) error
	DeleteTodo(id int64) error

	// Column methods
	GetColumnsByUserID(userID int64) ([]models.Column, error)
	CreateColumn(column *models.Column) error
	UpdateColumn(column *models.Column) error
	DeleteColumn(id int64) error

	// Extended Todo methods for Kanban
	UpdateTodoPosition(todoID, columnID int64, position int) error
	GetTodosByColumnID(columnID int64) ([]models.Todo, error)
}

type service struct {
	db *sqlx.DB
}

var (
	database = os.Getenv("BLUEPRINT_DB_DATABASE")
	password = os.Getenv("BLUEPRINT_DB_PASSWORD")
	username = os.Getenv("BLUEPRINT_DB_USERNAME")
	port     = os.Getenv("BLUEPRINT_DB_PORT")
	host     = os.Getenv("BLUEPRINT_DB_HOST")
	schema   = os.Getenv("BLUEPRINT_DB_SCHEMA")
)

func New() (Service, error) {
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s",
		username, password, host, port, database, schema)

	db, err := sqlx.Connect("pgx", connStr)
	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %v", err)
	}

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

// Todo Repository Methods
func (s *service) GetTodosByUserID(userID int64) ([]models.Todo, error) {
	var todos []models.Todo
	query := `SELECT * FROM todos WHERE user_id = $1 ORDER BY position, created_at DESC`

	err := s.db.Select(&todos, query, userID)
	if err != nil {
		return nil, err
	}

	return todos, nil
}

func (s *service) CreateTodo(todo *models.Todo) error {
	query := `
        INSERT INTO todos (title, description, user_id, column_id, position, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, created_at`

	return s.db.QueryRow(
		query,
		todo.Title,
		todo.Description,
		todo.UserID,
		todo.ColumnID,
		todo.Position,
	).Scan(&todo.ID, &todo.CreatedAt)
}

func (s *service) GetTodoByID(id int64) (*models.Todo, error) {
	todo := &models.Todo{}
	query := `SELECT * FROM todos WHERE id = $1`

	err := s.db.Get(todo, query, id)
	if err != nil {
		return nil, err
	}

	return todo, nil
}

func (s *service) UpdateTodo(todo *models.Todo) error {
	query := `
        UPDATE todos
        SET title = $1, description = $2, done = $3, column_id = $4, position = $5
        WHERE id = $6 AND user_id = $7`

	result, err := s.db.Exec(
		query,
		todo.Title,
		todo.Description,
		todo.Done,
		todo.ColumnID,
		todo.Position,
		todo.ID,
		todo.UserID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("todo not found or access denied")
	}

	return nil
}

func (s *service) DeleteTodo(id int64) error {
	query := `DELETE FROM todos WHERE id = $1`

	result, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("todo not found")
	}

	return nil
}

// Column Repository Methods
func (s *service) GetColumnsByUserID(userID int64) ([]models.Column, error) {
	var columns []models.Column
	query := `SELECT * FROM columns WHERE user_id = $1 ORDER BY position`

	err := s.db.Select(&columns, query, userID)
	if err != nil {
		return nil, fmt.Errorf("error fetching columns: %v", err)
	}

	return columns, nil
}

func (s *service) CreateColumn(column *models.Column) error {
	query := `
        INSERT INTO columns (title, position, user_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, created_at`

	return s.db.QueryRow(
		query,
		column.Title,
		column.Position,
		column.UserID,
	).Scan(&column.ID, &column.CreatedAt)
}

func (s *service) UpdateColumn(column *models.Column) error {
	query := `
        UPDATE columns
        SET title = $1, position = $2
        WHERE id = $3 AND user_id = $4`

	result, err := s.db.Exec(
		query,
		column.Title,
		column.Position,
		column.ID,
		column.UserID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("column not found or access denied")
	}

	return nil
}

func (s *service) DeleteColumn(id int64) error {
	query := `DELETE FROM columns WHERE id = $1`

	result, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("column not found")
	}

	return nil
}

func (s *service) UpdateTodoPosition(todoID, columnID int64, position int) error {
	query := `
        UPDATE todos
        SET column_id = $1, position = $2
        WHERE id = $3`

	result, err := s.db.Exec(query, columnID, position, todoID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("todo not found")
	}

	return nil
}

func (s *service) GetTodosByColumnID(columnID int64) ([]models.Todo, error) {
	var todos []models.Todo
	query := `SELECT * FROM todos WHERE column_id = $1 ORDER BY position`

	err := s.db.Select(&todos, query, columnID)
	if err != nil {
		return nil, fmt.Errorf("error fetching todos by column: %v", err)
	}

	return todos, nil
}
