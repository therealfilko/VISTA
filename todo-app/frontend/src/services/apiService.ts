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
  column_id: number;
  position: number;
}

class ApiService {
  private api;
  private baseURL = import.meta.env.PROD 
    ? "http://app:9000"  // Docker-Service-Name
    : "http://localhost:9000"; // Entwicklungsumgebung

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  async createDefaultColumns(): Promise<Column[]> {
    const defaultColumns = [
      { title: "To Do", position: 1 },
      { title: "In Progress", position: 2 },
      { title: "Done", position: 3 },
    ];

    const createdColumns = await Promise.all(
      defaultColumns.map((column) =>
        this.api.post<Column>("/api/columns", column),
      ),
    );

    return createdColumns.map((response) => response.data);
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


  async updateTodoPosition(todoId: number, data: UpdateTodoPositionData): Promise<void> {
    const payload = {
      todo_id: todoId,
      column_id: data.column_id,
      position: data.position
    };
    await this.api.put(`/api/todos/${todoId}/position`, payload);
  }
}

export const apiService = new ApiService();
