/**
 * API клиент для взаимодействия с backend WORK21
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Типы данных
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'customer' | 'admin';
  bio?: string;
  skills?: string;
  avatar_url?: string;
  rating_score: number;
  completed_projects: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'customer';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline?: string;
  tech_stack?: string | string[]; // Может быть JSON строка или массив
  status: 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  customer_id: number;
  generated_spec?: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  complexity: number;
  estimated_hours?: number;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  project_id: number;
  assignee_id?: number;
  order: number;
  created_at: string;
}

export interface Application {
  id: number;
  project_id: number;
  student_id: number;
  cover_letter?: string;
  proposed_rate?: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// API Error
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Получение токена из localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Базовый fetch с обработкой ошибок
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || `Ошибка ${response.status}`
    );
  }
  
  // Для 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// ==================== AUTH API ====================

export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterData): Promise<User> {
    return fetchApi<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Вход в систему
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.detail || 'Неверный email или пароль'
      );
    }
    
    return response.json();
  },
};

// ==================== USERS API ====================

export const usersApi = {
  /**
   * Получить текущего пользователя
   */
  async getMe(): Promise<User> {
    return fetchApi<User>('/api/v1/users/me');
  },
  
  /**
   * Обновить профиль
   */
  async updateMe(data: Partial<User>): Promise<User> {
    return fetchApi<User>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Получить пользователя по ID
   */
  async getById(id: number): Promise<User> {
    return fetchApi<User>(`/api/v1/users/${id}`);
  },
  
  /**
   * Получить список студентов
   */
  async getStudents(skip = 0, limit = 20): Promise<User[]> {
    return fetchApi<User[]>(`/api/v1/users/?skip=${skip}&limit=${limit}`);
  },
  
  /**
   * Получить лидерборд
   */
  async getLeaderboard(limit = 10): Promise<User[]> {
    return fetchApi<User[]>(`/api/v1/users/leaderboard?limit=${limit}`);
  },
};

// ==================== PROJECTS API ====================

export interface ProjectCreateData {
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline?: string;
  tech_stack?: string[];
}

export const projectsApi = {
  /**
   * Создать проект
   */
  async create(data: ProjectCreateData): Promise<Project> {
    return fetchApi<Project>('/api/v1/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Получить список проектов
   */
  async getList(status?: string, skip = 0, limit = 20): Promise<Project[]> {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    if (status) params.append('status', status);
    return fetchApi<Project[]>(`/api/v1/projects/?${params}`);
  },
  
  /**
   * Получить мои проекты
   */
  async getMy(): Promise<Project[]> {
    return fetchApi<Project[]>('/api/v1/projects/my');
  },
  
  /**
   * Получить проект по ID
   */
  async getById(id: number): Promise<Project> {
    return fetchApi<Project>(`/api/v1/projects/${id}`);
  },
  
  /**
   * Обновить проект
   */
  async update(id: number, data: Partial<Project>): Promise<Project> {
    return fetchApi<Project>(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Опубликовать проект
   */
  async publish(id: number): Promise<Project> {
    return fetchApi<Project>(`/api/v1/projects/${id}/publish`, {
      method: 'POST',
    });
  },
  
  /**
   * Подать заявку на проект
   */
  async apply(projectId: number, coverLetter?: string, proposedRate?: number): Promise<Application> {
    return fetchApi<Application>(`/api/v1/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        cover_letter: coverLetter,
        proposed_rate: proposedRate,
      }),
    });
  },
  
  /**
   * Получить заявки на проект
   */
  async getApplications(projectId: number): Promise<Application[]> {
    return fetchApi<Application[]>(`/api/v1/projects/${projectId}/applications`);
  },
  
  /**
   * Обновить статус заявки
   */
  async updateApplicationStatus(
    projectId: number,
    applicationId: number,
    status: 'accepted' | 'rejected'
  ): Promise<Application> {
    return fetchApi<Application>(
      `/api/v1/projects/${projectId}/applications/${applicationId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },
};

// Экспорт всего API
export const api = {
  auth: authApi,
  users: usersApi,
  projects: projectsApi,
};

export default api;


