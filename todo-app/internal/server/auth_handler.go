package server

import (
    "fmt"
    "net/http"
    "time"
    "todo-app/internal/models"

    "github.com/labstack/echo/v4"
)

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
    FirstName   string    `json:"first_name" validate:"required"`
    LastName    string    `json:"last_name" validate:"required"`
    Email       string    `json:"email" validate:"required,email"`
    Password    string    `json:"password" validate:"required,min=8"`
    DateOfBirth time.Time `json:"date_of_birth" validate:"required"`
}

// @Summary Register a new user
// @Description Register a new user with the provided details
// @Tags Auth
// @Accept json
// @Produce json
// @Param registerRequest body RegisterRequest true "Register Request"
// @Success 201 {object} models.AuthResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /auth/register [post]
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

    // Generate tokens
    tokenPair, err := s.jwtService.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate tokens")
    }

    // Set cookies
    s.jwtService.SetTokenCookies(c, tokenPair)

    return c.JSON(http.StatusCreated, models.AuthResponse{
        User:    *user,
        Message: "Registration successful",
    })
}

// @Summary Login user
// @Description Login with email and password
// @Tags Auth
// @Accept json
// @Produce json
// @Param loginRequest body LoginRequest true "Login Request"
// @Success 200 {object} models.AuthResponse
// @Failure 400,401 {object} models.ErrorResponse
// @Router /auth/login [post]
func (s *Server) handleLogin(c echo.Context) error {
    var req LoginRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    user, err := s.db.GetUserByEmail(req.Email)
    if err != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    if !user.CheckPassword(req.Password) {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    // Generate tokens
    tokenPair, err := s.jwtService.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate tokens")
    }

    // Set cookies
    s.jwtService.SetTokenCookies(c, tokenPair)

    return c.JSON(http.StatusOK, models.AuthResponse{
        User:    *user,
        Message: "Login successful",
    })
}

// @Summary Refresh tokens
// @Description Refresh access token using refresh token
// @Tags Auth
// @Success 200 {object} models.SuccessResponse
// @Failure 401 {object} models.ErrorResponse
// @Router /auth/refresh [post]
func (s *Server) handleRefreshToken(c echo.Context) error {
    refreshCookie, err := c.Cookie("refresh_token")
    if err != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "Missing refresh token")
    }

    claims, err := s.jwtService.ValidateRefreshToken(refreshCookie.Value)
    if err != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
    }

    user, err := s.db.GetUserByID(claims.UserID)
    if err != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "User not found")
    }

    // Revoke old token
    s.jwtService.RevokeToken(claims.TokenID)

    // Generate new tokens
    tokenPair, err := s.jwtService.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate tokens")
    }

    // Set new cookies
    s.jwtService.SetTokenCookies(c, tokenPair)

    return c.JSON(http.StatusOK, models.SuccessResponse{
        Message: "Tokens refreshed successfully",
    })
}

// @Summary Logout user
// @Description Logout and invalidate tokens
// @Tags Auth
// @Success 200 {object} models.SuccessResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/logout [post]
func (s *Server) handleLogout(c echo.Context) error {
    // Delete cookies
    c.SetCookie(&http.Cookie{
        Name:     "access_token",
        Value:    "",
        Path:     "/",
        Expires:  time.Now().UTC().Add(-1 * time.Hour),
        HttpOnly: true,
        Secure:   true,
    })

    c.SetCookie(&http.Cookie{
        Name:     "refresh_token",
        Value:    "",
        Path:     "/auth/refresh",
        Expires:  time.Now().UTC().Add(-1 * time.Hour),
        HttpOnly: true,
        Secure:   true,
    })

    // Revoke token in backend
    tokenID := c.Get("tokenID").(string)
    if err := s.jwtService.RevokeToken(tokenID); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to logout")
    }

    return c.JSON(http.StatusOK, models.SuccessResponse{
        Message: "Successfully logged out",
    })
}

// @Summary Get current user
// @Description Get the current authenticated user's info
// @Tags Auth
// @Success 200 {object} models.User
// @Failure 401 {object} models.ErrorResponse
// @Router /auth/me [get]
func (s *Server) handleGetMe(c echo.Context) error {
    user := c.Get("user").(*models.User)
    fmt.Printf("Getting user info for ID: %d\n", user.ID)
    return c.JSON(http.StatusOK, user)
}
