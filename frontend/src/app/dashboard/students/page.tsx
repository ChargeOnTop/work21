'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  User,
  Trophy,
  Briefcase,
  Star,
  Search,
  Filter,
  Mail,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usersApi, User as UserType, ApiError } from '@/lib/api';

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'projects' | 'name'>('rating');

  // Проверяем, что пользователь - заказчик
  useEffect(() => {
    if (user && user.role !== 'customer') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (!user || user.role !== 'customer') return;

    const loadStudents = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await usersApi.getStudents(0, 100);
        setStudents(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке исполнителей');
        }
        console.error('Ошибка загрузки исполнителей:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [user]);

  if (!user || user.role !== 'customer') {
    return null;
  }

  // Фильтрация и сортировка
  const filteredAndSortedStudents = students
    .filter((student) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const email = student.email.toLowerCase();
      const skills = student.skills?.toLowerCase() || '';
      return fullName.includes(query) || email.includes(query) || skills.includes(query);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_score - a.rating_score;
        case 'projects':
          return b.completed_projects - a.completed_projects;
        case 'name':
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`, 'ru');
        default:
          return 0;
      }
    });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Исполнители</h1>
          <p className="text-sm text-gray-400">
            Найдите талантливых студентов для ваших проектов
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

      {/* Filters */}
      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email или навыкам..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'projects' | 'name')}
              className="px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
            >
              <option value="rating">По рейтингу</option>
              <option value="projects">По проектам</option>
              <option value="name">По имени</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Найдено: {filteredAndSortedStudents.length} {filteredAndSortedStudents.length === 1 ? 'исполнитель' : 'исполнителей'}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
        </div>
      ) : filteredAndSortedStudents.length === 0 ? (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 border border-work21-border text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'Исполнители не найдены' : 'Нет доступных исполнителей'}
          </h3>
          <p className="text-gray-400">
            {searchQuery 
              ? 'Попробуйте изменить параметры поиска'
              : 'Исполнители появятся здесь после регистрации'}
          </p>
        </div>
      ) : (
        /* Students List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedStudents.map((student) => {
            const skills = parseSkills(student.skills);
            
            return (
              <div
                key={student.id}
                className="glass-card rounded-2xl p-6 border border-work21-border hover:border-accent-green/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  {student.avatar_url ? (
                    <img
                      src={student.avatar_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-accent-green/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-accent-green/20 flex items-center justify-center border-2 border-accent-green/30">
                      <span className="text-2xl font-bold text-accent-green">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </span>
                    </div>
                  )}

                  {/* Name and Rating */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {student.first_name} {student.last_name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-accent-amber" />
                      <span className="text-sm font-medium text-accent-amber">
                        {student.rating_score.toFixed(1)}
                      </span>
                    </div>
                    {student.is_verified && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent-green/10 text-accent-green text-xs">
                        <Star className="w-3 h-3" />
                        Проверен
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {student.bio && (
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {student.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-work21-dark/50 border border-work21-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-accent-blue" />
                      <span className="text-xs text-gray-500">Проектов</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {student.completed_projects}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-work21-dark/50 border border-work21-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-accent-amber" />
                      <span className="text-xs text-gray-500">Рейтинг</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {student.rating_score.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Навыки:</div>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="px-2 py-1 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-400 text-xs">
                          +{skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-work21-border">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(student.created_at)}
                    </div>
                    {student.is_active ? (
                      <span className="px-2 py-1 rounded bg-accent-green/10 text-accent-green">
                        Активен
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-500/10 text-gray-500">
                        Неактивен
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/users/${student.id}`}
                    className="w-full btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Посмотреть профиль
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

