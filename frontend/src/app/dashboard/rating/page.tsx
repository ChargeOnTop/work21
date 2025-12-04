'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ratingsApi, usersApi, Rating, ApiError } from '@/lib/api';
import { ArrowLeft, Trophy, Star, Loader2, AlertCircle, MessageSquare } from 'lucide-react';

export default function RatingPage() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') return;

    const loadRatings = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await ratingsApi.getUserRatings(user.id);
        setRatings(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке отзывов');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRatings();
  }, [user]);

  if (!user || user.role !== 'student') {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">Доступно только для студентов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Мой рейтинг</h1>
          <p className="text-sm text-gray-400">История отзывов и оценок</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-work21-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-accent-amber/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-accent-amber" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Текущий рейтинг</div>
            <div className="text-4xl font-bold text-white flex items-center gap-2">
              <Star className="w-8 h-8 text-accent-amber" />
              {user.rating_score.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
        </div>
      ) : ratings.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-work21-border text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Пока нет отзывов</h3>
          <p className="text-gray-400">Отзывы появятся здесь после завершения проектов</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="glass-card rounded-2xl border border-work21-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent-amber" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{rating.score}.0</div>
                    <div className="text-xs text-gray-500">
                      {new Date(rating.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/projects/${rating.project_id}`}
                  className="px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm"
                >
                  Проект #{rating.project_id}
                </Link>
              </div>
              {rating.comment && (
                <div className="mb-4 p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{rating.comment}</p>
                </div>
              )}
              {(rating.quality_score || rating.communication_score || rating.deadline_score) && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {rating.quality_score && (
                    <div>
                      <div className="text-gray-500 mb-1">Качество</div>
                      <div className="text-white font-semibold">{rating.quality_score}/5</div>
                    </div>
                  )}
                  {rating.communication_score && (
                    <div>
                      <div className="text-gray-500 mb-1">Коммуникация</div>
                      <div className="text-white font-semibold">{rating.communication_score}/5</div>
                    </div>
                  )}
                  {rating.deadline_score && (
                    <div>
                      <div className="text-gray-500 mb-1">Сроки</div>
                      <div className="text-white font-semibold">{rating.deadline_score}/5</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

