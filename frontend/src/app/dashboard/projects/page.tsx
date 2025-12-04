'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { projectsApi, Project, ApiError } from '@/lib/api';
import {
  FolderKanban,
  Clock,
  DollarSign,
  Calendar,
  Tag,
  ArrowLeft,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  Users,
} from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'bg-gray-500/20 text-gray-400' },
  open: { label: 'Открыт', color: 'bg-accent-green/20 text-accent-green' },
  in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
  review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
  completed: { label: 'Завершен', color: 'bg-accent-green/20 text-accent-green' },
  cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-400' },
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        let data: Project[];
        if (user.role === 'customer') {
          // Для заказчика - его проекты
          data = await projectsApi.getMy();
        } else {
          // Для студента - открытые проекты И проекты где он назначен исполнителем
          const [openProjects, myProjects] = await Promise.all([
            projectsApi.getList('open'),
            projectsApi.getMy(), // Это вернет проекты где студент назначен исполнителем
          ]);
          // Объединяем и убираем дубликаты
          const allProjects = [...openProjects];
          myProjects.forEach(p => {
            if (!allProjects.find(ap => ap.id === p.id)) {
              allProjects.push(p);
            }
          });
          data = allProjects;
        }
        
        setProjects(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проектов');
        }
        console.error('Ошибка загрузки проектов:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  if (!user) return null;

  const parseTechStack = (techStack: string | undefined): string[] => {
    if (!techStack) return [];
    try {
      // Если это JSON строка
      if (typeof techStack === 'string' && techStack.startsWith('[')) {
        return JSON.parse(techStack);
      }
      // Если это уже массив
      if (Array.isArray(techStack)) {
        return techStack;
      }
      return [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.role === 'customer' ? 'Мои проекты' : 'Открытые проекты'}
            </h1>
            <p className="text-sm text-gray-400">
              {user.role === 'customer' 
                ? 'Управляйте своими проектами и отслеживайте их статус'
                : 'Найдите подходящий проект и подайте заявку'}
            </p>
          </div>
        </div>
        {user.role === 'customer' && (
          <Link
            href="/dashboard/projects/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать проект
          </Link>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 border border-work21-border text-center">
          <FolderKanban className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {user.role === 'customer' ? 'У вас пока нет проектов' : 'Нет доступных проектов'}
          </h3>
          <p className="text-gray-400 mb-6">
            {user.role === 'customer' 
              ? 'Создайте первый проект, чтобы начать работу'
              : 'Открытые проекты появятся здесь'}
          </p>
          {user.role === 'customer' && (
            <Link href="/dashboard/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Создать проект
            </Link>
          )}
        </div>
      ) : (
        /* Projects List */
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => {
            const techStack = parseTechStack(project.tech_stack);
            const status = statusLabels[project.status] || statusLabels.draft;
            
            return (
              <div
                key={project.id}
                className="glass-card rounded-2xl p-6 border border-work21-border hover:border-accent-green/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Budget */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <DollarSign className="w-5 h-5 text-accent-green flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Бюджет</div>
                      <div className="text-sm font-semibold text-white">
                        {project.budget.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  {project.deadline && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                      <Calendar className="w-5 h-5 text-accent-blue flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Срок</div>
                        <div className="text-sm font-semibold text-white">
                          {new Date(project.deadline).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <FolderKanban className="w-5 h-5 text-accent-violet flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Задач</div>
                      <div className="text-sm font-semibold text-white">
                        {project.tasks?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-work21-dark/50">
                    <Clock className="w-5 h-5 text-accent-amber flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Создан</div>
                      <div className="text-sm font-semibold text-white">
                        {new Date(project.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {project.requirements && (
                  <div className="mb-4 p-4 rounded-lg bg-work21-dark/30 border border-work21-border">
                    <div className="text-xs text-gray-500 mb-2">Требования:</div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">
                      {project.requirements}
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Технологии:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks List */}
                {project.tasks && project.tasks.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Задачи проекта:</div>
                    <div className="space-y-2">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-work21-dark/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              task.status === 'completed' ? 'bg-accent-green' :
                              task.status === 'in_progress' ? 'bg-accent-blue' :
                              'bg-gray-500'
                            }`} />
                            <span className="text-sm text-gray-300">{task.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {task.status === 'completed' ? 'Завершена' :
                             task.status === 'in_progress' ? 'В работе' :
                             'Ожидает'}
                          </span>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <div className="text-xs text-gray-500 text-center pt-2">
                          И еще {project.tasks.length - 3} задач...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-work21-border">
                  <div className="text-xs text-gray-500">
                    ID: {project.id} • Обновлен: {new Date(project.updated_at).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.role === 'customer' && (
                      <>
                        {project.status === 'draft' && (
                          <button
                            onClick={async () => {
                              try {
                                await projectsApi.publish(project.id);
                                router.refresh();
                              } catch (err) {
                                console.error('Ошибка публикации:', err);
                              }
                            }}
                            className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors text-sm"
                          >
                            Опубликовать
                          </button>
                        )}
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Подробнее
                        </Link>
                      </>
                    )}
                    {user.role === 'student' && project.assignee_id === user.id && (
                      <>
                        <div className="px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium">
                          Вы исполнитель
                        </div>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Подробнее
                        </Link>
                      </>
                    )}
                    {user.role === 'student' && project.status === 'open' && !project.assignee_id && (
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="btn-primary text-sm flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Подать заявку
                      </Link>
                    )}
                    {user.role === 'student' && project.status !== 'open' && project.assignee_id !== user.id && (
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Подробнее
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

