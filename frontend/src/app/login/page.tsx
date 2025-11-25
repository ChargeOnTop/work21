'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      // Редирект происходит автоматически в login()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - декоративная */}
      <div className="hidden lg:flex flex-1 bg-work21-card border-r border-work21-border items-center justify-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        
        <div className="max-w-md text-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center mx-auto mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            С возвращением!
          </h2>
          <p className="text-gray-400 mb-8">
            Войдите в свой аккаунт, чтобы продолжить работу над проектами 
            или найти новых исполнителей.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-work21-dark/50 border border-work21-border">
              <div className="text-2xl font-bold text-accent-green">9000+</div>
              <div className="text-sm text-gray-400">Студентов</div>
            </div>
            <div className="p-4 rounded-xl bg-work21-dark/50 border border-work21-border">
              <div className="text-2xl font-bold text-accent-blue">500+</div>
              <div className="text-sm text-gray-400">Проектов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - форма */}
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
          <h1 className="text-3xl font-bold text-white mb-2">Вход в аккаунт</h1>
          <p className="text-gray-400 mb-8">
            Введите свои данные для входа
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Пароль
                </label>
                <Link href="/forgot-password" className="text-sm text-accent-green hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-work21-card border border-work21-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Ваш пароль"
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
                  Войти
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-work21-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-work21-dark text-gray-500">или</span>
            </div>
          </div>

          {/* Register Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/register?role=student"
              className="py-3 px-4 bg-work21-card hover:bg-work21-border border border-work21-border rounded-lg text-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              Я студент
            </Link>
            <Link
              href="/register?role=customer"
              className="py-3 px-4 bg-work21-card hover:bg-work21-border border border-work21-border rounded-lg text-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              Я заказчик
            </Link>
          </div>

          {/* Register Link */}
          <p className="mt-8 text-center text-gray-400">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-accent-green hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


