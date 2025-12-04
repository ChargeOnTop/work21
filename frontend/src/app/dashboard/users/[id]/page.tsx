'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  User,
  Trophy,
  Briefcase,
  Star,
  Mail,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usersApi, User as UserType, ApiError } from '@/lib/api';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = parseInt(params.id as string);
  
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser || !userId) return;

    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await usersApi.getById(userId);
        setUser(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке профиля пользователя');
        }
        console.error('Ошибка загрузки профиля:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [currentUser, userId]);

  if (!currentUser) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const parseSkills = (skills: string | undefined): string[] => {
    if (!skills) return [];
    try {
      if (skills.startsWith('[')) {
        return JSON.parse(skills);
      }
      return skills.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
      return skills.split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/students"
            className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Профиль пользователя</h1>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const skills = parseSkills(user.skills);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/students"
          className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Профиль исполнителя</h1>
          <p className="text-sm text-gray-400">
            Подробная информация о пользователе
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="glass-card rounded-2xl border border-work21-border p-6">
        {/* Header */}
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-24 h-24 rounded-full object-cover border-2 border-accent-green/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent-green/20 flex items-center justify-center border-2 border-accent-green/30">
              <span className="text-3xl font-bold text-accent-green">
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
          )}

          {/* Name and Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h2>
              {user.is_verified && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent-green/10 text-accent-green text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Проверен
                </div>
              )}
              {user.is_active ? (
                <span className="px-2 py-1 rounded bg-accent-green/10 text-accent-green text-xs">
                  Активен
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-gray-500/10 text-gray-500 text-xs">
                  Неактивен
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                На платформе с {formatDate(user.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-accent-amber" />
              <span className="text-sm text-gray-400">Рейтинг</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {user.rating_score.toFixed(1)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-accent-blue" />
              <span className="text-sm text-gray-400">Завершено проектов</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {user.completed_projects}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-accent-green" />
              <span className="text-sm text-gray-400">Статус</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {user.is_active ? 'Активен' : 'Неактивен'}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">О себе</h3>
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap">
              {user.bio}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Навыки</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-6 border-t border-work21-border">
          <h3 className="text-lg font-semibold text-white mb-3">Дополнительная информация</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Email</div>
              <div className="text-white">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Дата регистрации</div>
              <div className="text-white">{formatDate(user.created_at)}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Роль</div>
              <div className="text-white capitalize">
                {user.role === 'student' ? 'Студент' : user.role === 'customer' ? 'Заказчик' : 'Администратор'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Статус аккаунта</div>
              <div className="text-white">
                {user.is_active ? 'Активен' : 'Неактивен'} • {user.is_verified ? 'Проверен' : 'Не проверен'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

