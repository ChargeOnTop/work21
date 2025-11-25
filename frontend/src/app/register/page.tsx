'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, User, Mail, Lock, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

type UserRole = 'student' | 'customer';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading } = useAuth();
  
  // Получаем роль из URL параметра
  const initialRole = (searchParams.get('role') as UserRole) || 'student';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: initialRole,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
      });
      // Редирект происходит автоматически в register()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - форма */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              WORK<span className="text-accent-green">21</span>
            </span>
          </Link>

          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-2">Создать аккаунт</h1>
          <p className="text-gray-400 mb-8">
            Присоединяйтесь к платформе WORK21
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === 'student'
                  ? 'border-accent-green bg-accent-green/10'
                  : 'border-work21-border hover:border-gray-600'
              }`}
            >
              <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                formData.role === 'student' ? 'text-accent-green' : 'text-gray-400'
              }`} />
              <div className={`font-medium ${
                formData.role === 'student' ? 'text-white' : 'text-gray-400'
              }`}>
                Студент
              </div>
              <div className="text-xs text-gray-500 mt-1">Ищу проекты</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === 'customer'
                  ? 'border-accent-blue bg-accent-blue/10'
                  : 'border-work21-border hover:border-gray-600'
              }`}
            >
              <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                formData.role === 'customer' ? 'text-accent-blue' : 'text-gray-400'
              }`} />
              <div className={`font-medium ${
                formData.role === 'customer' ? 'text-white' : 'text-gray-400'
              }`}>
                Заказчик
              </div>
              <div className="text-xs text-gray-500 mt-1">Ищу исполнителей</div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Иван"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Петров"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Минимум 8 символов"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Повторите пароль"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-accent-green hover:bg-accent-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Создать аккаунт
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-400">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-accent-green hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>

      {/* Правая часть - декоративная */}
      <div className="hidden lg:flex flex-1 bg-work21-card border-l border-work21-border items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center mx-auto mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {formData.role === 'student' 
              ? 'Начните зарабатывать на своих навыках'
              : 'Найдите талантливых разработчиков'
            }
          </h2>
          <p className="text-gray-400">
            {formData.role === 'student'
              ? 'Получайте реальный опыт, работая над коммерческими проектами. Стройте портфолио и карьеру.'
              : 'Более 9000 студентов Школы 21 готовы взяться за ваш проект. Быстро, качественно, безопасно.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}


