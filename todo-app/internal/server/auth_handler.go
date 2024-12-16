package server

import (
	"net/http"
	"time"

	"todo-app/internal/models"

	"github.com/labstack/echo/v4"
)

type RegisterRequest struct {
    FirstName   string    `json:"first_name" validate:"required"`
    LastName    string    `json:"last_name" validate:"required"`
    Email       string    `json:"email" validate:"required,email"`
    Password    string    `json:"password" validate:"required,min=6"`
    DateOfBirth time.Time `json:"date_of_birth" validate:"required"`
}

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
    Token string      `json:"token"`
    User  models.User `json:"user"`
}

func (s *Server) handleRegister(c echo.Context) error {
    var req RegisterRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    if err := c.Validate(req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }

    user := &models.User{
        FirstName:   req.FirstName,
        LastName:    req.LastName,
        Email:       req.Email,
        DateOfBirth: req.DateOfBirth,
    }

    if err := user.SetPassword(req.Password); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to process password")
    }

    if err := s.db.CreateUser(user); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create user")
    }

    token, err := s.generateJWT(user)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
    }

    return c.JSON(http.StatusCreated, AuthResponse{
        Token: token,
        User:  *user,
    })
}

func (s *Server) handleLogin(c echo.Context) error {
    var req LoginRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    if err := c.Validate(req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }

    user, err := s.db.GetUserByEmail(req.Email)
    if err != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    if !user.CheckPassword(req.Password) {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    token, err := s.generateJWT(user)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
    }

    return c.JSON(http.StatusOK, AuthResponse{
        Token: token,
        User:  *user,
    })
}

func (s *Server) handleGetMe(c echo.Context) error {
    user := c.Get("user").(*models.User)
    return c.JSON(http.StatusOK, user)
}
