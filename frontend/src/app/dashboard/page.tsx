'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  FolderKanban,
  Users,
  Trophy,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  // Контент для студента
  if (user.role === 'student') {
    return <StudentDashboard user={user} />;
  }

  // Контент для заказчика
  return <CustomerDashboard user={user} />;
}

// Dashboard для студента
function StudentDashboard({ user }: { user: any }) {
  const stats = [
    {
      label: 'Рейтинг',
      value: user.rating_score.toFixed(1),
      icon: Trophy,
      color: 'amber',
      change: '+0.2 за месяц',
    },
    {
      label: 'Выполнено проектов',
      value: user.completed_projects,
      icon: CheckCircle,
      color: 'green',
      change: 'Всего',
    },
    {
      label: 'Активные заявки',
      value: 0,
      icon: Clock,
      color: 'blue',
      change: 'Ожидают ответа',
    },
    {
      label: 'В работе',
      value: 0,
      icon: FolderKanban,
      color: 'violet',
      change: 'Текущие проекты',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass-card rounded-2xl p-6 border border-work21-border">
        <h2 className="text-2xl font-bold text-white mb-2">
          Привет, {user.first_name}! 👋
        </h2>
        <p className="text-gray-400">
          Начните зарабатывать — найдите проект, который подходит вашим навыкам.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            amber: 'bg-accent-amber/10 text-accent-amber',
            green: 'bg-accent-green/10 text-accent-green',
            blue: 'bg-accent-blue/10 text-accent-blue',
            violet: 'bg-accent-violet/10 text-accent-violet',
          };
          return (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-5 border border-work21-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Find Projects */}
        <div className="glass-card rounded-2xl p-6 border border-work21-border">
          <h3 className="text-lg font-semibold text-white mb-4">Найти проекты</h3>
          <p className="text-gray-400 text-sm mb-4">
            Просмотрите открытые проекты и подайте заявку на те, которые вам интересны.
          </p>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-accent-green hover:underline"
          >
            Смотреть проекты
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Profile */}
        <div className="glass-card rounded-2xl p-6 border border-work21-border">
          <h3 className="text-lg font-semibold text-white mb-4">Заполните профиль</h3>
          <p className="text-gray-400 text-sm mb-4">
            Укажите свои навыки и опыт, чтобы заказчики могли найти вас.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 text-accent-blue hover:underline"
          >
            Редактировать профиль
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Projects Placeholder */}
      <div className="glass-card rounded-2xl p-6 border border-work21-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Рекомендованные проекты</h3>
          <Link
            href="/dashboard/projects"
            className="text-sm text-accent-green hover:underline"
          >
            Смотреть все
          </Link>
        </div>
        
        {/* Empty State */}
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Проекты пока не загружены</p>
          <p className="text-sm text-gray-500">
            Нажмите "Смотреть все" чтобы найти подходящие проекты
          </p>
        </div>
      </div>
    </div>
  );
}

// Dashboard для заказчика
function CustomerDashboard({ user }: { user: any }) {
  const stats = [
    {
      label: 'Всего проектов',
      value: 0,
      icon: FolderKanban,
      color: 'green',
      change: 'За всё время',
    },
    {
      label: 'Активных',
      value: 0,
      icon: Clock,
      color: 'blue',
      change: 'В работе',
    },
    {
      label: 'Заявок',
      value: 0,
      icon: Users,
      color: 'violet',
      change: 'Ожидают ответа',
    },
    {
      label: 'Завершено',
      value: 0,
      icon: CheckCircle,
      color: 'amber',
      change: 'Успешно',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass-card rounded-2xl p-6 border border-work21-border">
        <h2 className="text-2xl font-bold text-white mb-2">
          Добро пожаловать, {user.first_name}! 👋
        </h2>
        <p className="text-gray-400">
          Создайте свой первый проект и найдите талантливых исполнителей.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            amber: 'bg-accent-amber/10 text-accent-amber',
            green: 'bg-accent-green/10 text-accent-green',
            blue: 'bg-accent-blue/10 text-accent-blue',
            violet: 'bg-accent-violet/10 text-accent-violet',
          };
          return (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-5 border border-work21-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Project */}
        <Link
          href="/dashboard/projects/new"
          className="glass-card rounded-2xl p-6 border border-accent-green/30 hover:border-accent-green/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-accent-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Создать проект</h3>
              <p className="text-sm text-gray-400">
                Опишите задачу и найдите исполнителей
              </p>
            </div>
          </div>
        </Link>

        {/* Find Students */}
        <Link
          href="/dashboard/students"
          className="glass-card rounded-2xl p-6 border border-work21-border hover:border-accent-blue/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-accent-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Найти исполнителей</h3>
              <p className="text-sm text-gray-400">
                Просмотрите рейтинг студентов
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* My Projects Placeholder */}
      <div className="glass-card rounded-2xl p-6 border border-work21-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Мои проекты</h3>
          <Link
            href="/dashboard/projects/new"
            className="btn-primary text-sm py-2 px-4"
          >
            Создать проект
          </Link>
        </div>
        
        {/* Empty State */}
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">У вас пока нет проектов</p>
          <p className="text-sm text-gray-500">
            Создайте первый проект, чтобы начать работу
          </p>
        </div>
      </div>
    </div>
  );
}

