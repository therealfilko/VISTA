package server

import (
	"fmt"
	"net/http"
	"time"

	"todo-app/internal/models"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	FirstName   string `json:"first_name" validate:"required"`
	LastName    string `json:"last_name" validate:"required"`
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=6"`
	DateOfBirth string `json:"date_of_birth" validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// @Summary Register a new user
// @Description Register a new user with first name, last name, email, password, and date of birth.
// @Tags Auth
// @Accept json
// @Produce json
// @Param registerRequest body RegisterRequest true "Register Request"
// @Success 201 {object} models.AuthResponse
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 500 {object} models.ErrorResponse "Failed to create user"
// @Router /auth/register [post]
func (s *Server) handleRegister(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid date format, use YYYY-MM-DD")
	}

	user := &models.User{
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Email:       req.Email,
		DateOfBirth: dob,
	}

	// Hash password with specific cost
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to process password")
	}
	user.PasswordHash = string(hashedPassword)

	if err := s.db.CreateUser(user); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create user")
	}

	token, err := s.generateJWT(user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
	}

	return c.JSON(http.StatusCreated, models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

// @Summary Login a user
// @Description Login with email and password.
// @Tags Auth
// @Accept json
// @Produce json
// @Param loginRequest body LoginRequest true "Login Request"
// @Success 200 {object} models.AuthResponse
// @Failure 400 {object} models.ErrorResponse "Invalid request payload"
// @Failure 401 {object} models.ErrorResponse "Invalid credentials"
// @Router /auth/login [post]
func (s *Server) handleLogin(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		fmt.Printf("Bind error: %v\n", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	fmt.Printf("Login attempt with email: %s\n", req.Email)

	user, err := s.db.GetUserByEmail(req.Email)
	if err != nil {
		fmt.Printf("GetUserByEmail error: %v\n", err)
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	// Direct password comparison using bcrypt
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		fmt.Printf("Password comparison failed: %v\n", err)
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	token, err := s.generateJWT(user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
	}

	return c.JSON(http.StatusOK, models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

// @Summary Get current user info
// @Description Retrieve the information of the currently authenticated user.
// @Tags Auth
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Router /auth/me [get]
func (s *Server) handleGetMe(c echo.Context) error {
	user := c.Get("user").(*models.User)
	return c.JSON(http.StatusOK, user)
}
