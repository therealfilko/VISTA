import axios from "axios";
 
// Typdefinitionen
export interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
  user_id: number;
  column_id: number;
  position: number;
  created_at: string;
}
 
export interface Column {
  id: number;
  title: string;
  position: number;
  todos: Todo[];
}
 
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  created_at: string;
}
 
interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
}
 
interface UpdatePasswordData {
  current_password: string;
  new_password: string;
}
 
export interface CreateTodoData {
  title: string;
  description: string;
  column_id: number;
  position: number;
}
 
interface UpdateTodoData {
  title: string;
  description: string;
  done: boolean;
}
 
export interface UpdateTodoPositionData {
  todo_id: number;
  column_id: number; 
  position: number;
}
 
class ApiService {
  private api;
  private baseURL = "http://localhost:8080";
 
  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
 
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }
 
  // User Endpoints
  async getUserProfile(): Promise<User> {
    const { data } = await this.api.get<User>("/api/users/profile");
    return data;
  }
 
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const { data: responseData } = await this.api.put<User>(
      "/api/users/profile",
      data,
    );
    return responseData;
  }
 
  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await this.api.put("/api/users/password", data);
  }
 
  // Column Endpoints
  async getColumns(): Promise<Column[]> {
    const { data } = await this.api.get<Column[]>("/api/columns");
    return data;
  }
 
  // Todo Endpoints
  async getTodos(): Promise<Todo[]> {
    const { data } = await this.api.get<Todo[]>("/api/todos");
    return data;
  }
 
  async createTodo(data: CreateTodoData): Promise<Todo> {
    const { data: responseData } = await this.api.post<Todo>(
      "/api/todos",
      data,
    );
    return responseData;
  }
 
  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
    const { data: responseData } = await this.api.put<Todo>(
      `/api/todos/${id}`,
      data,
    );
    return responseData;
  }
 
  async deleteTodo(id: number): Promise<void> {
    await this.api.delete(`/api/todos/${id}`);
  }
 
  async toggleTodoDone(id: number): Promise<Todo> {
    const { data } = await this.api.patch<Todo>(`/api/todos/${id}/done`);
    return data;
  }
 
  async updateTodoPosition(data: UpdateTodoPositionData): Promise<void> {
    await this.api.put(`/api/todos/${data.todo_id}/position`, data);
  }
}
 
export const apiService = new ApiService();