// internal/server/user_handler.go
package server

import (
	"net/http"
	"time"
	"todo-app/internal/models"

	"github.com/labstack/echo/v4"
)

type UpdateProfileRequest struct {
    FirstName   string    `json:"first_name" validate:"required"`
    LastName    string    `json:"last_name" validate:"required"`
    Email       string    `json:"email" validate:"required,email"`
    DateOfBirth time.Time `json:"date_of_birth" validate:"required"`
}

type UpdatePasswordRequest struct {
    CurrentPassword string `json:"current_password" validate:"required"`
    NewPassword     string `json:"new_password" validate:"required,min=6"`
}

func (s *Server) handleGetProfile(c echo.Context) error {
    user := c.Get("user").(*models.User)
    return c.JSON(http.StatusOK, user)
}

func (s *Server) handleUpdateProfile(c echo.Context) error {
    user := c.Get("user").(*models.User)

    var req UpdateProfileRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    if err := c.Validate(req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }

    // Update user fields
    user.FirstName = req.FirstName
    user.LastName = req.LastName
    user.Email = req.Email
    user.DateOfBirth = req.DateOfBirth

    if err := s.db.UpdateUser(user); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update profile")
    }

    return c.JSON(http.StatusOK, user)
}

func (s *Server) handleUpdatePassword(c echo.Context) error {
    user := c.Get("user").(*models.User)

    var req UpdatePasswordRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    if err := c.Validate(req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }

    // Verify current password
    if !user.CheckPassword(req.CurrentPassword) {
        return echo.NewHTTPError(http.StatusUnauthorized, "Current password is incorrect")
    }

    // Set new password
    if err := user.SetPassword(req.NewPassword); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update password")
    }

    if err := s.db.UpdateUser(user); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to save new password")
    }

    return c.JSON(http.StatusOK, map[string]string{
        "message": "Password updated successfully",
    })
}
