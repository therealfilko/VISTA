package server

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "reflect"
    "strings"
    "testing"
    "time"
    "todo-app/internal/auth"
    "todo-app/internal/models"

    "github.com/go-playground/validator/v10"
    "github.com/labstack/echo/v4"
    "golang.org/x/crypto/bcrypt"
)

type MockDB struct{}

func (m *MockDB) GetUserByEmail(email string) (*models.User, error) {
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    return &models.User{
        ID:           1,
        Email:        email,
        PasswordHash: string(hashedPassword),
        FirstName:    "Test",
        LastName:     "User",
        DateOfBirth:  time.Now(),
    }, nil
}

func (m *MockDB) GetUserByID(id int64) (*models.User, error) {
    return &models.User{
        ID:        id,
        Email:     "test@example.com",
        FirstName: "Test",
        LastName:  "User",
    }, nil
}

func (m *MockDB) CreateUser(user *models.User) error                            { return nil }
func (m *MockDB) UpdateUser(user *models.User) error                            { return nil }
func (m *MockDB) UpdatePassword(userID int64, hashedPassword string) error      { return nil }
func (m *MockDB) GetTodosByUserID(userID int64) ([]models.Todo, error)          { return nil, nil }
func (m *MockDB) CreateTodo(todo *models.Todo) error                            { return nil }
func (m *MockDB) GetTodoByID(id int64) (*models.Todo, error)                    { return nil, nil }
func (m *MockDB) UpdateTodo(todo *models.Todo) error                            { return nil }
func (m *MockDB) DeleteTodo(id int64) error                                     { return nil }
func (m *MockDB) GetColumnsByUserID(userID int64) ([]models.Column, error)      { return nil, nil }
func (m *MockDB) CreateColumn(column *models.Column) error                      { return nil }
func (m *MockDB) UpdateColumn(column *models.Column) error                      { return nil }
func (m *MockDB) DeleteColumn(id int64) error                                   { return nil }
func (m *MockDB) UpdateTodoPosition(todoID, columnID int64, position int) error { return nil }
func (m *MockDB) GetTodosByColumnID(columnID int64) ([]models.Todo, error)      { return nil, nil }
func (m *MockDB) Health() map[string]string                                     { return nil }
func (m *MockDB) Close() error                                                  { return nil }

func setupTestServer() (*Server, *echo.Echo) {
    e := echo.New()
    e.Validator = &CustomValidator{validator: validator.New()}

    mockDB := &MockDB{}
    tokenStore := auth.NewMemoryTokenStore()
    jwtService := auth.NewJWTService("test-access-secret", "test-refresh-secret", tokenStore)

    s := &Server{
        db:         mockDB,
        jwtService: jwtService,
        tokenStore: tokenStore,
    }

    return s, e
}

func TestHandler(t *testing.T) {
    s, e := setupTestServer()

    req := httptest.NewRequest(http.MethodGet, "/", nil)
    rec := httptest.NewRecorder()
    c := e.NewContext(req, rec)

    if err := s.HelloWorldHandler(c); err != nil {
        t.Errorf("HelloWorldHandler failed: %v", err)
        return
    }

    if rec.Code != http.StatusOK {
        t.Errorf("Expected status code %d, got %d", http.StatusOK, rec.Code)
        return
    }

    expected := map[string]string{"message": "Hello World"}
    var actual map[string]string
    if err := json.NewDecoder(rec.Body).Decode(&actual); err != nil {
        t.Errorf("Failed to decode response: %v", err)
        return
    }

    if !reflect.DeepEqual(expected, actual) {
        t.Errorf("Expected response %v, got %v", expected, actual)
    }
}

func TestAuthFlow(t *testing.T) {
    s, e := setupTestServer()

    t.Run("Register New User", func(t *testing.T) {
        registerJSON := `{
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "password": "password123",
        "date_of_birth": "1990-01-01T00:00:00Z"
        }`

        req := httptest.NewRequest(http.MethodPost, "/auth/register", strings.NewReader(registerJSON))
        req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
        rec := httptest.NewRecorder()
        c := e.NewContext(req, rec)

        err := s.handleRegister(c)
        if err != nil {
            t.Logf("Register error: %v", err)
        }

        if rec.Code != http.StatusCreated {
            body := rec.Body.String()
            t.Logf("Response body: %s", body)
            t.Errorf("Expected status code %d, got %d", http.StatusCreated, rec.Code)
        }

        cookies := rec.Result().Cookies()
        var hasAccessToken, hasRefreshToken bool
        for _, cookie := range cookies {
            switch cookie.Name {
            case "access_token":
                hasAccessToken = true
            case "refresh_token":
                hasRefreshToken = true
            }
        }

        if !hasAccessToken {
            t.Error("Access token cookie not set")
        }
        if !hasRefreshToken {
            t.Error("Refresh token cookie not set")
        }
    })

    t.Run("Login User", func(t *testing.T) {
        loginJSON := `{"email":"test@example.com","password":"password123"}`

        req := httptest.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(loginJSON))
        req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
        rec := httptest.NewRecorder()
        c := e.NewContext(req, rec)

        err := s.handleLogin(c)
        if err != nil {
            t.Logf("Login error: %v", err)
        }

        if rec.Code != http.StatusOK {
            t.Errorf("Expected status code %d, got %d", http.StatusOK, rec.Code)
        }

        cookies := rec.Result().Cookies()
        var hasAccessToken, hasRefreshToken bool
        for _, cookie := range cookies {
            switch cookie.Name {
            case "access_token":
                hasAccessToken = true
            case "refresh_token":
                hasRefreshToken = true
            }
        }

        if !hasAccessToken {
            t.Error("Access token cookie not set")
        }
        if !hasRefreshToken {
            t.Error("Refresh token cookie not set")
        }
    })

    t.Run("Refresh Token", func(t *testing.T) {
        // Login first to get valid tokens
        loginJSON := `{"email":"test@example.com","password":"password123"}`
        loginReq := httptest.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(loginJSON))
        loginReq.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
        loginRec := httptest.NewRecorder()
        loginC := e.NewContext(loginReq, loginRec)
        s.handleLogin(loginC)

        // Extract refresh token from login response
        var refreshToken string
        for _, cookie := range loginRec.Result().Cookies() {
            if cookie.Name == "refresh_token" {
                refreshToken = cookie.Value
                break
            }
        }

        // Perform refresh request
        req := httptest.NewRequest(http.MethodPost, "/auth/refresh", nil)
        cookie := &http.Cookie{
            Name:  "refresh_token",
            Value: refreshToken,
        }
        req.AddCookie(cookie)
        rec := httptest.NewRecorder()
        c := e.NewContext(req, rec)

        err := s.handleRefreshToken(c)
        if err != nil {
            t.Logf("Refresh error: %v", err)
        }

        if rec.Code != http.StatusOK {
            t.Errorf("Expected status code %d, got %d", http.StatusOK, rec.Code)
        }

        // Check for new tokens
        cookies := rec.Result().Cookies()
        var hasNewAccessToken, hasNewRefreshToken bool
        for _, cookie := range cookies {
            switch cookie.Name {
            case "access_token":
                hasNewAccessToken = true
            case "refresh_token":
                hasNewRefreshToken = true
            }
        }

        if !hasNewAccessToken {
            t.Error("New access token cookie not set")
        }
        if !hasNewRefreshToken {
            t.Error("New refresh token cookie not set")
        }
    })
}

func TestTodoOperations(t *testing.T) {
    s, e := setupTestServer()

    t.Run("Create Todo", func(t *testing.T) {
        todoJSON := `{
        "title": "Test Todo",
        "description": "Test Description",
        "column_id": 1,
        "position": 1
        }`

        req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(todoJSON))
        req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
        rec := httptest.NewRecorder()
        c := e.NewContext(req, rec)
        c.Set("user", &models.User{ID: 1})

        if err := s.handleCreateTodo(c); err != nil {
            t.Fatalf("Create todo failed: %v", err)
        }

        if rec.Code != http.StatusCreated {
            t.Errorf("Expected status code %d, got %d", http.StatusCreated, rec.Code)
        }
    })
}

func TestColumnOperations(t *testing.T) {
    s, e := setupTestServer()

    t.Run("Create Column", func(t *testing.T) {
        columnJSON := `{
        "title": "Test Column",
        "position": 1
        }`

        req := httptest.NewRequest(http.MethodPost, "/api/columns", strings.NewReader(columnJSON))
        req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
        rec := httptest.NewRecorder()
        c := e.NewContext(req, rec)
        c.Set("user", &models.User{ID: 1})

        if err := s.handleCreateColumn(c); err != nil {
            t.Fatalf("Create column failed: %v", err)
        }

        if rec.Code != http.StatusCreated {
            t.Errorf("Expected status code %d, got %d", http.StatusCreated, rec.Code)
        }
    })
}
