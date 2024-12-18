package models

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Code    string `json:"code,omitempty"`
}

type TodoResponse struct {
	Todo    Todo   `json:"todo"`
	Message string `json:"message,omitempty"`
}

type TodoListResponse struct {
	Todos      []Todo `json:"todos"`
	TotalCount int    `json:"total_count"`
}