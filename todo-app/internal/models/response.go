package models

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type AuthResponse struct {
	User    User   `json:"user"`
	Message string `json:"message,omitempty"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Code    int    `json:"code,omitempty"`
}

type TodoResponse struct {
	Todo    Todo   `json:"todo"`
	Message string `json:"message,omitempty"`
}

type TodoListResponse struct {
	Todos      []Todo `json:"todos"`
	TotalCount int    `json:"total_count"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}
