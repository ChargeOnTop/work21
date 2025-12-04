'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { applicationsApi, projectsApi, Application, Project, ApiError } from '@/lib/api';
import { ArrowLeft, Briefcase, Clock, CheckCircle, X, Loader2, AlertCircle, Eye } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'bg-accent-amber/20 text-accent-amber' },
  accepted: { label: 'Принята', color: 'bg-accent-green/20 text-accent-green' },
  rejected: { label: 'Отклонена', color: 'bg-red-500/20 text-red-400' },
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Record<number, Project>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const apps = await applicationsApi.getMy();
        setApplications(apps);
        
        const projectIds = [...new Set(apps.map(a => a.project_id))];
        const projectsData: Record<number, Project> = {};
        for (const id of projectIds) {
          try {
            projectsData[id] = await projectsApi.getById(id);
          } catch (err) {
            console.error(`Ошибка загрузки проекта ${id}:`, err);
          }
        }
        setProjects(projectsData);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке заявок');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
          <h1 className="text-2xl font-bold text-white">Мои заявки</h1>
          <p className="text-sm text-gray-400">Отслеживайте статус ваших заявок на проекты</p>
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
      ) : applications.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-work21-border text-center">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">У вас пока нет заявок</h3>
          <p className="text-gray-400 mb-6">Подайте заявку на проект, чтобы она появилась здесь</p>
          <Link href="/dashboard/projects" className="btn-primary inline-flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Посмотреть проекты
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const project = projects[application.project_id];
            const status = statusLabels[application.status] || statusLabels.pending;
            
            return (
              <div
                key={application.id}
                className="glass-card rounded-2xl p-6 border border-work21-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {project ? (
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(application.created_at).toLocaleDateString('ru-RU')}
                          </div>
                          {application.proposed_rate && (
                            <div className="font-medium text-white">
                              {application.proposed_rate.toLocaleString('ru-RU')} ₽
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">Проект не найден (ID: {application.project_id})</div>
                    )}
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-4 p-4 rounded-lg bg-work21-dark/50 border border-work21-border">
                    <div className="text-xs text-gray-500 mb-2">Сопроводительное письмо:</div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{application.cover_letter}</p>
                  </div>
                )}

                {project && (
                  <div className="flex items-center justify-between pt-4 border-t border-work21-border">
                    <div className="text-xs text-gray-500">
                      ID заявки: {application.id}
                    </div>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Посмотреть проект
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

