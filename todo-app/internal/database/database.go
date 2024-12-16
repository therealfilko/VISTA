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
	UpdatePassword(userID int64, hashedPassword string) error // Neue Methode

	// Todo methods
	GetTodosByUserID(userID int64) ([]models.Todo, error)
	CreateTodo(todo *models.Todo) error
	GetTodoByID(id int64) (*models.Todo, error)
	UpdateTodo(todo *models.Todo) error
	DeleteTodo(id int64) error
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

// User Repository Methods
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

// Todo Repository Methods
func (s *service) GetTodosByUserID(userID int64) ([]models.Todo, error) {
	var todos []models.Todo
	query := `SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC`

	err := s.db.Select(&todos, query, userID)
	if err != nil {
		return nil, err
	}

	return todos, nil
}

func (s *service) CreateTodo(todo *models.Todo) error {
	query := `
        INSERT INTO todos (title, description, user_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, created_at`

	return s.db.QueryRow(
		query,
		todo.Title,
		todo.Description,
		todo.UserID,
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
        SET title = $1, description = $2, done = $3
        WHERE id = $4 AND user_id = $5`

	result, err := s.db.Exec(
		query,
		todo.Title,
		todo.Description,
		todo.Done,
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
