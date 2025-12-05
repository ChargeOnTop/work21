'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components';
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Загрузка...</p>
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
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col transition-colors duration-300" style={{ background: 'var(--color-card)', borderRight: '1px solid var(--color-border)' }}>
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
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
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-opacity-50"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
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
        <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-3" style={{ background: 'var(--color-bg)' }}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: '1px solid var(--color-border)' }}
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
              <div className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                {user.role === 'student' ? 'Студент' : 'Заказчик'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:text-red-400 hover:bg-red-500/10"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 transition-colors duration-300" style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              Добро пожаловать, {user.first_name}!
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <Link
              href="/dashboard/settings"
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
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
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
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


