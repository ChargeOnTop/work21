'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Send, FileText, DollarSign } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { projectsApi, Project, ApiError } from '@/lib/api';

export default function ApplyProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const projectId = parseInt(params.id as string);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_rate: '',
  });

  useEffect(() => {
    if (!user || !projectId) return;
    if (user.role !== 'student') {
      router.push('/dashboard');
      return;
    }

    const loadProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectsApi.getById(projectId);
        setProject(data);
        if (data.status !== 'open') {
          setError('Проект не открыт для заявок');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проекта');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [user, projectId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await projectsApi.apply(
        projectId,
        formData.cover_letter || undefined,
        formData.proposed_rate ? parseFloat(formData.proposed_rate) : undefined
      );
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/projects/${projectId}`);
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при подаче заявки');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'student') return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Назад к проекту</span>
        </Link>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Подать заявку</h1>
          <p className="text-sm text-gray-400">{project.title}</p>
        </div>
      </div>

      {success && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Заявка успешно подана!</p>
            <p className="text-sm text-gray-400">Перенаправление на страницу проекта...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Информация о проекте</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>Бюджет: {project.budget.toLocaleString('ru-RU')} ₽</span>
            </div>
            {project.deadline && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>Срок: {new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Сопроводительное письмо
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Расскажите о своем опыте и почему вы подходите для этого проекта..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Предложенная ставка (опционально)
            </label>
            <input
              type="number"
              name="proposed_rate"
              value={formData.proposed_rate}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              placeholder="Оставьте пустым, если согласны с бюджетом проекта"
            />
            <p className="text-xs text-gray-500 mt-1">
              Если вы хотите предложить другую ставку, укажите её здесь
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="px-6 py-3 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || success || project.status !== 'open'}
              className="px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Подать заявку
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

