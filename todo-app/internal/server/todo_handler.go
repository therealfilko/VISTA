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
}

type UpdateTodoRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Done        bool   `json:"done"`
}

func (s *Server) handleGetTodos(c echo.Context) error {
	user := c.Get("user").(*models.User)

	todos, err := s.db.GetTodosByUserID(user.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch todos")
	}

	// Wenn keine Todos gefunden wurden, leeres Array zurückgeben statt null
	if todos == nil {
		todos = []models.Todo{}
	}

	return c.JSON(http.StatusOK, todos)
}

func (s *Server) handleCreateTodo(c echo.Context) error {
	var req CreateTodoRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user := c.Get("user").(*models.User)

	todo := &models.Todo{
		Title:       req.Title,
		Description: req.Description,
		UserID:      user.ID,
	}

	if err := s.db.CreateTodo(todo); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create todo")
	}

	return c.JSON(http.StatusCreated, todo)
}

func (s *Server) handleGetTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid todo ID")
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	if todo.UserID != user.ID {
		return echo.NewHTTPError(http.StatusForbidden, "Access denied")
	}

	return c.JSON(http.StatusOK, todo)
}

func (s *Server) handleUpdateTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid todo ID")
	}

	var req UpdateTodoRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	if todo.UserID != user.ID {
		return echo.NewHTTPError(http.StatusForbidden, "Access denied")
	}

	todo.Title = req.Title
	todo.Description = req.Description
	todo.Done = req.Done

	if err := s.db.UpdateTodo(todo); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update todo")
	}

	return c.JSON(http.StatusOK, todo)
}

func (s *Server) handleDeleteTodo(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid todo ID")
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	if todo.UserID != user.ID {
		return echo.NewHTTPError(http.StatusForbidden, "Access denied")
	}

	if err := s.db.DeleteTodo(id); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete todo")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Todo successfully deleted",
	})
}

func (s *Server) handleToggleTodoDone(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid todo ID")
	}

	user := c.Get("user").(*models.User)

	todo, err := s.db.GetTodoByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	if todo.UserID != user.ID {
		return echo.NewHTTPError(http.StatusForbidden, "Access denied")
	}

	todo.Done = !todo.Done

	if err := s.db.UpdateTodo(todo); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update todo")
	}

	return c.JSON(http.StatusOK, todo)
}
