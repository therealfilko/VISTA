// internal/server/column_handler.go
package server

import (
	"net/http"
	"strconv"
	"todo-app/internal/models"

	"github.com/labstack/echo/v4"
)

type CreateColumnRequest struct {
	Title    string `json:"title" validate:"required"`
	Position int    `json:"position" validate:"required"`
}

type UpdateColumnRequest struct {
	Title    string `json:"title" validate:"required"`
	Position int    `json:"position" validate:"required"`
}

type UpdateTodoPositionRequest struct {
	TodoID   int64 `json:"todo_id" validate:"required"`
	ColumnID int64 `json:"column_id" validate:"required"`
	Position int   `json:"position" validate:"required"`
}

type ColumnType int

const (
	TodoColumn       ColumnType = 1
	InProgressColumn ColumnType = 2
	DoneColumn       ColumnType = 3
)

type Column struct {
	ID       int64      `json:"id"`
	Type     ColumnType `json:"type"`
	Title    string     `json:"title"`
	Position int        `json:"position"`
}

// @Summary Get all columns with todos
// @Description Retrieve all columns along with their associated todos for the authenticated user.
// @Tags Columns
// @Produce json
// @Success 200 {array} map[string]interface{}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to fetch columns"
// @Router /api/columns [get]
func (s *Server) handleGetColumns(c echo.Context) error {
	user := c.Get("user").(*models.User)

	columns, err := s.db.GetColumnsByUserID(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to fetch columns"})
	}

	var response []map[string]interface{}
	for _, column := range columns {
		todos, err := s.db.GetTodosByColumnID(column.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to fetch todos"})
		}

		response = append(response, map[string]interface{}{
			"id":       column.ID,
			"title":    column.Title,
			"position": column.Position,
			"todos":    todos,
		})
	}

	return c.JSON(http.StatusOK, response)
}

// @Summary Create a new column
// @Description Create a new column with a title and position.
// @Tags Columns
// @Accept json
// @Produce json
// @Param createColumnRequest body CreateColumnRequest true "Create Column Request"
// @Success 201 {object} models.Column
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to create column"
// @Router /api/columns [post]
func (s *Server) handleCreateColumn(c echo.Context) error {
	var req CreateColumnRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	user := c.Get("user").(*models.User)

	column := &models.Column{
		Title:    req.Title,
		Position: req.Position,
		UserID:   user.ID,
	}

	if err := s.db.CreateColumn(column); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to create column"})
	}

	return c.JSON(http.StatusCreated, column)
}

// @Summary Update a column
// @Description Update the title and position of an existing column.
// @Tags Columns
// @Accept json
// @Produce json
// @Param id path int true "Column ID"
// @Param updateColumnRequest body UpdateColumnRequest true "Update Column Request"
// @Success 200 {object} models.Column
// @Failure 400 {object} models.ErrorResponse "Invalid request payload or column ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to update column"
// @Router /api/columns/{id} [put]
func (s *Server) handleUpdateColumn(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid column ID"})
	}

	var req UpdateColumnRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	user := c.Get("user").(*models.User)

	column := &models.Column{
		ID:       id,
		Title:    req.Title,
		Position: req.Position,
		UserID:   user.ID,
	}

	if err := s.db.UpdateColumn(column); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update column"})
	}

	return c.JSON(http.StatusOK, column)
}

// @Summary Delete a column
// @Description Delete a column by its ID.
// @Tags Columns
// @Param id path int true "Column ID"
// @Success 200 "Column deleted successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid column ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to delete column"
// @Router /api/columns/{id} [delete]
func (s *Server) handleDeleteColumn(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid column ID"})
	}

	if err := s.db.DeleteColumn(id); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to delete column"})
	}

	return c.NoContent(http.StatusOK)
}

// @Summary Update todo position
// @Description Move a todo to a different column and update its position.
// @Tags Columns
// @Accept json
// @Produce json
// @Param id path int true "Todo ID"
// @Param updateTodoPositionRequest body UpdateTodoPositionRequest true "Update Todo Position Request"
// @Success 200 {object} map[string]string "Todo position updated successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to update todo position"
// @Router /api/todos/{id}/position [put]
func (s *Server) handleUpdateTodoPosition(c echo.Context) error {
	var req UpdateTodoPositionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	// Prüfe ob es sich um die Done-Spalte handelt
	if req.ColumnID == int64(DoneColumn) {
		todo, err := s.db.GetTodoByID(req.TodoID)
		if err != nil {
			return c.JSON(http.StatusNotFound, models.ErrorResponse{Message: "Todo not found"})
		}
		todo.Done = true
		if err := s.db.UpdateTodo(todo); err != nil {
			return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update todo"})
		}
	}

	if err := s.db.UpdateTodoPosition(req.TodoID, req.ColumnID, req.Position); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update todo position"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Todo position updated successfully",
	})
}
