'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, RegisterData, ApiError } from './api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Загрузка пользователя при инициализации
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.users.getMe();
      setUser(userData);
    } catch (error) {
      // Токен невалидный — удаляем
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Вход
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password);
      localStorage.setItem('access_token', response.access_token);
      
      // Загружаем данные пользователя
      const userData = await api.users.getMe();
      setUser(userData);
      
      // Редирект в dashboard
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Регистрируем пользователя
      await api.auth.register(data);
      
      // Автоматически входим
      await login(data.email, data.password);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Ошибка при регистрации');
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    router.push('/');
  };

  // Обновление данных пользователя
  const refreshUser = async () => {
    try {
      const userData = await api.users.getMe();
      setUser(userData);
    } catch (error) {
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC для защиты страниц
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { allowedRoles?: ('student' | 'customer' | 'admin')[] }
) {
  return function ProtectedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
      
      // Проверка роли
      if (options?.allowedRoles && user && !options.allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-work21-dark">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}


