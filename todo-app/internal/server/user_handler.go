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

// @Summary Get user profile
// @Description Retrieve the profile information of the authenticated user.
// @Tags User
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Router /api/users/profile [get]
func (s *Server) handleGetProfile(c echo.Context) error {
	user := c.Get("user").(*models.User)
	return c.JSON(http.StatusOK, user)
}

// @Summary Update user profile
// @Description Update the profile information of the authenticated user.
// @Tags User
// @Accept json
// @Produce json
// @Param updateProfileRequest body UpdateProfileRequest true "Update Profile Request"
// @Success 200 {object} models.User
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Failed to update profile"
// @Router /api/users/profile [put]
func (s *Server) handleUpdateProfile(c echo.Context) error {
	user := c.Get("user").(*models.User)

	var req UpdateProfileRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	// Update user fields
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Email = req.Email
	user.DateOfBirth = req.DateOfBirth

	if err := s.db.UpdateUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update profile"})
	}

	return c.JSON(http.StatusOK, user)
}

// @Summary Update user password
// @Description Update the password of the authenticated user.
// @Tags User
// @Accept json
// @Produce json
// @Param updatePasswordRequest body UpdatePasswordRequest true "Update Password Request"
// @Success 200 {object} map[string]string "Password updated successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Unauthorized or incorrect current password"
// @Failure 500 {object} models.ErrorResponse "Failed to update password"
// @Router /api/users/password [put]
func (s *Server) handleUpdatePassword(c echo.Context) error {
	user := c.Get("user").(*models.User)

	var req UpdatePasswordRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
	}

	if err := c.Validate(req); err != nil {
		return c.JSON(http.StatusBadRequest, models.ErrorResponse{Message: err.Error()})
	}

	// Verify current password
	if !user.CheckPassword(req.CurrentPassword) {
		return c.JSON(http.StatusUnauthorized, models.ErrorResponse{Message: "Current password is incorrect"})
	}

	// Set new password
	if err := user.SetPassword(req.NewPassword); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to update password"})
	}

	if err := s.db.UpdateUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, models.ErrorResponse{Message: "Failed to save new password"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Password updated successfully",
	})
}
