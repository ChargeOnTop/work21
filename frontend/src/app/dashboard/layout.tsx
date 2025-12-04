'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  User,
  Settings,
  LogOut,
  Trophy,
  Briefcase,
  Plus,
  Bell,
} from 'lucide-react';

// Навигация для студента
const studentNavigation = [
  { name: 'Главная', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Проекты', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Мои заявки', href: '/dashboard/applications', icon: Briefcase },
  { name: 'Рейтинг', href: '/dashboard/rating', icon: Trophy },
  { name: 'Профиль', href: '/dashboard/profile', icon: User },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
];

// Навигация для заказчика
const customerNavigation = [
  { name: 'Главная', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Мои проекты', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Создать проект', href: '/dashboard/projects/new', icon: Plus },
  { name: 'Исполнители', href: '/dashboard/students', icon: User },
  { name: 'Профиль', href: '/dashboard/profile', icon: User },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Редирект на логин если не авторизован
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-work21-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Не показываем ничего пока редирект не произошёл
  if (!isAuthenticated || !user) {
    return null;
  }

  const navigation = user.role === 'customer' ? customerNavigation : studentNavigation;

  return (
    <div className="min-h-screen bg-work21-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-work21-card border-r border-work21-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-work21-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              WORK<span className="text-accent-green">21</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-work21-border transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-work21-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-work21-dark/50 mb-3">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-10 h-10 rounded-full object-cover border border-work21-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                <span className="text-accent-green font-semibold">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {user.role === 'student' ? 'Студент' : 'Заказчик'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-work21-card border-b border-work21-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-white">
              Добро пожаловать, {user.first_name}!
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              href="/dashboard/settings"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-work21-border transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-green rounded-full"></span>
            </Link>
            
            {/* Rating (for students) */}
            {user.role === 'student' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-amber/10 text-accent-amber">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">{user.rating_score.toFixed(1)}</span>
              </div>
            )}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-work21-border bg-work21-dark flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


