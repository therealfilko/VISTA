package server

import (
	"net/http"
	"strconv"
	"todo-app/internal/models"

	"github.com/labstack/echo/v4"
)

type CreateTodoRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	ColumnID    int64  `json:"column_id" validate:"required"`
	Position    int    `json:"position" validate:"required"`
}

type UpdateTodoRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Done        bool   `json:"done"`
}

// @Summary Get all todos
// @Description Get a list of all todos for the authenticated user.
// @Tags Todos
// @Produce json
// @Success 200 {array} models.Todo
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to fetch todos"
// @Router /api/todos [get]
func (s *Server) handleGetTodos(c echo.Context) error {
	user := c.Get("user").(*models.User)

	todos, err := s.db.GetTodosByUserID(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to fetch todos"})
	}

	if todos == nil {
		todos = []models.Todo{}
	}

	return c.JSON(http.StatusOK, todos)
}

// @Summary Create a new todo
// @Description Create a new todo with title, description, column ID, and position.
// @Tags Todos
// @Accept json
// @Produce json
// @Param createTodoRequest body CreateTodoRequest true "Create Todo Request"
// @Success 201 {object} models.Todo
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to create todo"
// @Router /api/todos [post]
func (s *Server) handleCreateTodo(c echo.Context) error {
	var req CreateTodoRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	user := c.Get("user").(*models.User)

	todo := &models.Todo{
		Title:       req.Title,
		Description: req.Description,
		UserID:      user.ID,
		ColumnID:    req.ColumnID,
		Position:    req.Position,
	}

	if err := s.db.CreateTodo(todo); err != nil {
		c.Logger().Errorf("Error creating todo: %v", err)
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to create todo"})
	}

	return c.JSON(http.StatusCreated, todo)
}

// @Summary Get a specific todo
// @Description Retrieve a specific todo by ID for the authenticated user.
// @Tags Todos
// @Produce json
// @Param id path int true "Todo ID"
// @Success 200 {object} models.Todo
// @Failure 400 {object} models.ErrorResponse "Invalid todo ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Access denied"
// @Failure 404 {object} models.ErrorResponse "Todo not found"
// @Router /api/todos/{id} [get]
func (s *Server) handleGetTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid todo ID"})
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, models.ErrorResponse{Message: "Todo not found"})
	}

	if todo.UserID != user.ID {
		return c.JSON(http.StatusForbidden, models.ErrorResponse{Message: "Access denied"})
	}

	return c.JSON(http.StatusOK, todo)
}

// @Summary Update a todo
// @Description Update a todo's title, description, and completion status.
// @Tags Todos
// @Accept json
// @Produce json
// @Param id path int true "Todo ID"
// @Param updateTodoRequest body UpdateTodoRequest true "Update Todo Request"
// @Success 200 {object} models.Todo
// @Failure 400 {object} models.ErrorResponse "Invalid request payload or todo ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Access denied"
// @Failure 404 {object} models.ErrorResponse "Todo not found"
// @Failure 500 {object} models.ErrorResponse "Failed to update todo"
// @Router /api/todos/{id} [put]
func (s *Server) handleUpdateTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid todo ID"})
	}

	var req UpdateTodoRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, models.ErrorResponse{Message: "Todo not found"})
	}

	if todo.UserID != user.ID {
		return c.JSON(http.StatusForbidden, models.ErrorResponse{Message: "Access denied"})
	}

	todo.Title = req.Title
	todo.Description = req.Description
	todo.Done = req.Done

	if err := s.db.UpdateTodo(todo); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update todo"})
	}

	return c.JSON(http.StatusOK, todo)
}

// @Summary Delete a todo
// @Description Delete a specific todo by ID.
// @Tags Todos
// @Param id path int true "Todo ID"
// @Success 200 {object} models.SuccessResponse "Todo successfully deleted"
// @Failure 400 {object} models.ErrorResponse "Invalid todo ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Access denied"
// @Failure 404 {object} models.ErrorResponse "Todo not found"
// @Failure 500 {object} models.ErrorResponse "Failed to delete todo"
// @Router /api/todos/{id} [delete]
func (s *Server) handleDeleteTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid todo ID"})
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, models.ErrorResponse{Message: "Todo not found"})
	}

	if todo.UserID != user.ID {
		return c.JSON(http.StatusForbidden, models.ErrorResponse{Message: "Access denied"})
	}

	if err := s.db.DeleteTodo(id); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to delete todo"})
	}

	return c.JSON(http.StatusOK, models.SuccessResponse{Message: "Todo successfully deleted"})
}

// @Summary Toggle todo completion status
// @Description Toggle the 'done' status of a todo.
// @Tags Todos
// @Param id path int true "Todo ID"
// @Success 200 {object} models.Todo
// @Failure 400 {object} models.ErrorResponse "Invalid todo ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Access denied"
// @Failure 404 {object} models.ErrorResponse "Todo not found"
// @Failure 500 {object} models.ErrorResponse "Failed to update todo"
// @Router /api/todos/{id}/done [patch]
func (s *Server) handleToggleTodoDone(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid todo ID"})
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, models.ErrorResponse{Message: "Todo not found"})
	}

	if todo.UserID != user.ID {
		return c.JSON(http.StatusForbidden, models.ErrorResponse{Message: "Access denied"})
	}

	todo.Done = !todo.Done

	if err := s.db.UpdateTodo(todo); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update todo"})
	}

	return c.JSON(http.StatusOK, todo)
}
