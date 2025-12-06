'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  DollarSign,
  Calendar,
  Tag,
  FolderKanban,
  Clock,
  Send,
  Users,
  FileText,
  Edit,
  Save,
  X,
  Sparkles,
  UserPlus,
  Search,
  Trophy,
  Briefcase,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { projectsApi, estimatorApi, usersApi, ratingsApi, Project, Task, User as UserType, ApiError } from '@/lib/api';

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'bg-gray-500/20 text-gray-400' },
  open: { label: 'Открыт', color: 'bg-accent-green/20 text-accent-green' },
  in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
  review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
  completed: { label: 'Завершен', color: 'bg-accent-green/20 text-accent-green' },
  cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-400' },
};

const taskStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'bg-gray-500/20 text-gray-400' },
  in_progress: { label: 'В работе', color: 'bg-accent-blue/20 text-accent-blue' },
  review: { label: 'На проверке', color: 'bg-accent-amber/20 text-accent-amber' },
  completed: { label: 'Завершена', color: 'bg-accent-green/20 text-accent-green' },
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const projectId = parseInt(params.id as string);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: '',
    tech_stack: [] as string[],
    llm_estimation: '',
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<string | null>(null);
  const [estimationError, setEstimationError] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [students, setStudents] = useState<UserType[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignProjectModalOpen, setAssignProjectModalOpen] = useState(false);
  const [isAssigningProject, setIsAssigningProject] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRequestingReview, setIsRequestingReview] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    complexity: 3,
    estimated_hours: '',
    deadline: '',
  });
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [hasRating, setHasRating] = useState(false);
  const [ratingFormData, setRatingFormData] = useState({
    score: 5,
    comment: '',
    quality_score: 5,
    communication_score: 5,
    deadline_score: 5,
  });

  const parseTechStack = (techStack: string | string[] | undefined): string[] => {
    if (!techStack) return [];
    try {
      if (typeof techStack === 'string') {
        if (techStack.startsWith('[')) {
          return JSON.parse(techStack);
        }
        return [];
      }
      if (Array.isArray(techStack)) {
        return techStack;
      }
      return [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!user || !projectId) return;

    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await projectsApi.getById(projectId);
        setProject(data);
        
        // Инициализируем форму данными проекта
        const techStack = parseTechStack(data.tech_stack);
        setFormData({
          title: data.title,
          description: data.description,
          requirements: data.requirements || '',
          budget: data.budget.toString(),
          deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : '',
          tech_stack: techStack,
          llm_estimation: data.llm_estimation || '',
        });
        setEstimationResult(data.llm_estimation || null);
        
        if (data.status === 'completed' && user) {
          try {
            const revieweeId = (user.role === 'customer' && data.assignee_id) || (user.role === 'student' && data.customer_id);
            if (revieweeId) {
              const ratings = await ratingsApi.getUserRatings(revieweeId);
              const hasExistingRating = ratings.some(r => r.project_id === data.id && r.reviewer_id === user.id);
              setHasRating(hasExistingRating);
            }
          } catch {
            setHasRating(false);
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Ошибка при загрузке проекта');
        }
        console.error('Ошибка загрузки проекта:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [user, projectId]);

  const handlePublish = async () => {
    if (!project) return;
    
    try {
      setIsPublishing(true);
      setPublishSuccess(false);
      await projectsApi.publish(project.id);
      setPublishSuccess(true);
      // Обновляем проект
      const updated = await projectsApi.getById(project.id);
      setProject(updated);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при публикации проекта');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Восстанавливаем данные проекта
    if (project) {
      const techStack = parseTechStack(project.tech_stack);
      setFormData({
        title: project.title,
        description: project.description,
        requirements: project.requirements || '',
        budget: project.budget.toString(),
        deadline: project.deadline ? new Date(project.deadline).toISOString().slice(0, 16) : '',
        tech_stack: techStack,
        llm_estimation: project.llm_estimation || '',
      });
      setEstimationResult(project.llm_estimation || null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAddTechStack = () => {
    const tech = techStackInput.trim();
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, tech],
      });
      setTechStackInput('');
    }
  };

  const handleRemoveTechStack = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((t) => t !== tech),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechStack();
    }
  };

  const handleEstimate = async () => {
    if (!formData.description.trim()) {
      setEstimationError('Сначала заполните описание проекта');
      return;
    }

    setIsEstimating(true);
    setEstimationError('');
    setEstimationResult(null);

    try {
      const response = await estimatorApi.estimate(formData.description);
      
      // Получаем содержимое ответа (из message.content или response для обратной совместимости)
      const responseContent = response.message?.content || response.response || '';
      
      if (response.success !== false && responseContent) {
        // Если есть структурированная оценка, используем её
        if (response.estimation) {
          setEstimationResult(response.estimation.data);
          // Автоподстановка стоимости в поле budget (используем price из верхнего уровня или из estimation)
          const price = response.price || response.estimation.price;
          if (price) {
            setFormData({ 
              ...formData, 
              llm_estimation: response.estimation.data,
              budget: price.toString()
            });
          } else {
            setFormData({ ...formData, llm_estimation: response.estimation.data });
          }
        } else if (response.price) {
          // Если есть price, но нет estimation (fallback)
          setEstimationResult(responseContent);
          setFormData({ 
            ...formData, 
            llm_estimation: responseContent,
            budget: response.price.toString()
          });
        } else {
          // Fallback на старый формат (если JSON не распарсился)
          setEstimationResult(responseContent);
          setFormData({ ...formData, llm_estimation: responseContent });
        }
      } else {
        setEstimationError(response.error || 'Не удалось получить оценку');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setEstimationError(err.message);
      } else {
        setEstimationError('Ошибка при расчете времени выполнения');
      }
      console.error('Ошибка расчета времени:', err);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;

    setError('');
    setSaveSuccess(false);

    // Валидация
    if (!formData.title.trim()) {
      setError('Название проекта обязательно');
      return;
    }

    if (!formData.description.trim()) {
      setError('Описание проекта обязательно');
      return;
    }

    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget <= 0) {
      setError('Бюджет должен быть положительным числом');
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim() || undefined,
        budget: budget,
        deadline: formData.deadline || undefined,
        tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : undefined,
        llm_estimation: formData.llm_estimation || undefined,
      };

      const updated = await projectsApi.update(project.id, updateData);
      setProject(updated);
      
      // Обновляем форму с новыми данными
      const updatedTechStack = parseTechStack(updated.tech_stack);
      setFormData({
        title: updated.title,
        description: updated.description,
        requirements: updated.requirements || '',
        budget: updated.budget.toString(),
        deadline: updated.deadline ? new Date(updated.deadline).toISOString().slice(0, 16) : '',
        tech_stack: updatedTechStack,
        llm_estimation: updated.llm_estimation || '',
      });
      setEstimationResult(updated.llm_estimation || null);
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при сохранении проекта');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAssignModal = async (task: Task) => {
    setSelectedTask(task);
    setAssignModalOpen(true);
    setIsLoadingStudents(true);
    setSearchQuery('');
    
    try {
      const data = await usersApi.getStudents(0, 100);
      setStudents(data);
    } catch (err) {
      console.error('Ошибка загрузки студентов:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleAssignTask = async (assigneeId: number | null) => {
    if (!selectedTask || !project) return;

    setIsAssigning(true);
    try {
      await projectsApi.assignTaskAssignee(project.id, selectedTask.id, assigneeId);
      
      // Обновляем проект
      const updated = await projectsApi.getById(project.id);
      setProject(updated);
      
      setAssignModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при назначении исполнителя');
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const handleOpenAssignProjectModal = async () => {
    setAssignProjectModalOpen(true);
    setIsLoadingStudents(true);
    setSearchQuery('');
    
    try {
      const data = await usersApi.getStudents(0, 100);
      setStudents(data);
    } catch (err) {
      console.error('Ошибка загрузки студентов:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleAssignProject = async (assigneeId: number | null) => {
    if (!project) return;

    setIsAssigningProject(true);
    try {
      await projectsApi.assignProjectAssignee(project.id, assigneeId);
      
      // Обновляем проект
      const updated = await projectsApi.getById(project.id);
      setProject(updated);
      
      setAssignProjectModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при назначении исполнителя проекту');
      }
    } finally {
      setIsAssigningProject(false);
    }
  };

  const handleCreateTask = async () => {
    if (!project) return;

    if (!taskFormData.title.trim()) {
      setError('Название задачи обязательно');
      return;
    }

    setIsCreatingTask(true);
    setError('');
    try {
      await projectsApi.createTask(project.id, {
        title: taskFormData.title.trim(),
        description: taskFormData.description.trim() || undefined,
        complexity: taskFormData.complexity,
        estimated_hours: taskFormData.estimated_hours ? parseInt(taskFormData.estimated_hours) : undefined,
        deadline: taskFormData.deadline || undefined,
      });
      
      const updated = await projectsApi.getById(project.id);
      setProject(updated);
      
      setCreateTaskModalOpen(false);
      setTaskFormData({
        title: '',
        description: '',
        complexity: 3,
        estimated_hours: '',
        deadline: '',
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при создании задачи');
      }
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!project) return;

    setIsSubmittingRating(true);
    setError('');
    try {
      const revieweeId = isOwner && project.assignee_id ? project.assignee_id : project.customer_id;
      if (!revieweeId) {
        setError('Не указан получатель отзыва');
        return;
      }

      await ratingsApi.create({
        project_id: project.id,
        reviewee_id: revieweeId,
        score: ratingFormData.score,
        comment: ratingFormData.comment || undefined,
        quality_score: ratingFormData.quality_score || undefined,
        communication_score: ratingFormData.communication_score || undefined,
        deadline_score: ratingFormData.deadline_score || undefined,
      });
      
      setRatingModalOpen(false);
      setHasRating(true);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при отправке отзыва');
      }
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleComplete = async () => {
    if (!project) return;

    if (!confirm('Вы уверены, что хотите завершить проект? После завершения можно будет оставить отзыв.')) {
      return;
    }

    setIsCompleting(true);
    setError('');
    try {
      const updated = await projectsApi.complete(project.id);
      setProject(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при завершении проекта');
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleRequestReview = async () => {
    if (!project) return;

    setIsRequestingReview(true);
    setError('');
    try {
      const updated = await projectsApi.requestReview(project.id);
      setProject(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при запросе проверки');
      }
    } finally {
      setIsRequestingReview(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

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
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Проект</h1>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const techStack = parseTechStack(project.tech_stack);
  const status = statusLabels[project.status] || statusLabels.draft;
  const isOwner = user.role === 'customer' && project.customer_id === user.id;
  const isAssignee = user.role === 'student' && project.assignee_id === user.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg bg-work21-card border border-work21-border hover:border-accent-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="text-2xl font-bold bg-transparent border-b-2 border-accent-green/50 focus:border-accent-green text-white focus:outline-none pb-1"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              )}
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              ID: {project.id} • Создан: {formatDate(project.created_at)}
              {project.assignee && (
                <> • Исполнитель: {project.assignee.first_name} {project.assignee.last_name}</>
              )}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            {(project.status === 'in_progress' || project.status === 'review') && project.assignee_id && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Завершение...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Завершить проект
                  </>
                )}
              </button>
            )}
            {project.status !== 'draft' && (
              <button
                onClick={handleOpenAssignProjectModal}
                className="px-4 py-2 rounded-lg bg-accent-violet/10 border border-accent-violet/30 text-accent-violet hover:bg-accent-violet/20 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {project.assignee ? 'Изменить исполнителя' : 'Назначить исполнителя'}
              </button>
            )}
            {project.status === 'draft' && (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing || publishSuccess}
                      className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Публикация...
                        </>
                      ) : publishSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Опубликовано
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Опубликовать
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Отмена
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Сохранить
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {isAssignee && (
          <>
            <div className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Вы назначены исполнителем этого проекта
            </div>
            {project.status === 'in_progress' && (
              <button
                onClick={handleRequestReview}
                disabled={isRequestingReview}
                className="px-4 py-2 rounded-lg bg-accent-amber/10 border border-accent-amber/30 text-accent-amber hover:bg-accent-amber/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRequestingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Запросить проверку
                  </>
                )}
              </button>
            )}
          </>
        )}
        {user.role === 'student' && project.status === 'open' && !isAssignee && (
          <Link
            href={`/dashboard/projects/${project.id}/apply`}
            className="btn-primary flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Подать заявку
          </Link>
        )}
      </div>

      {/* Success Messages */}
      {publishSuccess && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Проект успешно опубликован!</p>
            <p className="text-sm text-gray-400">Теперь студенты могут подавать заявки</p>
          </div>
        </div>
      )}
      {saveSuccess && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Проект успешно сохранен!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Основная информация */}
      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-blue" />
            Основная информация
          </h2>
          <p className="text-sm text-gray-400">
            Описание проекта и требования
          </p>
        </div>

        {/* Title - только в режиме редактирования */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название проекта <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              placeholder="Название проекта"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Описание проекта {isEditing && <span className="text-red-400">*</span>}
          </label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Подробно опишите проект..."
            />
          ) : (
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap">
              {project.description}
            </div>
          )}
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Требования
          </label>
          {isEditing ? (
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Дополнительные требования..."
            />
          ) : project.requirements ? (
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap">
              {project.requirements}
            </div>
          ) : (
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-500 italic">
              Не указано
            </div>
          )}
        </div>
      </div>

      {/* Детали проекта */}
      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-accent-violet" />
            Детали проекта
          </h2>
          <p className="text-sm text-gray-400">
            Бюджет, сроки и технологии
          </p>
        </div>

        {/* Estimate Button - только в режиме редактирования */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-violet" />
              Оценка времени выполнения
            </label>
            <button
              type="button"
              onClick={handleEstimate}
              disabled={isEstimating || !formData.description.trim()}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-accent-violet to-accent-blue border-2 border-accent-violet/50 text-white hover:from-accent-violet/90 hover:to-accent-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold shadow-lg shadow-accent-violet/20 hover:shadow-accent-violet/40"
            >
              {isEstimating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Расчет времени выполнения...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Рассчитать оценку времени выполнения</span>
                </>
              )}
            </button>
            
            {estimationError && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400">{estimationError}</div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-green" />
              Бюджет {isEditing && <span className="text-red-400">*</span>}
              {isEditing && formData.budget && (
                <span className="ml-2 text-xs text-accent-green">
                  (автоматически рассчитано)
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="150000"
              />
            ) : (
              <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-white font-semibold">
                {project.budget.toLocaleString('ru-RU')} ₽
              </div>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-blue" />
              Срок выполнения
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              />
            ) : (
              <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-white">
                {formatDate(project.deadline)}
              </div>
            )}
          </div>
        </div>

        {/* LLM Estimation - Full Width Field */}
        {(project.llm_estimation || estimationResult) && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-violet" />
              Оценка времени выполнения от LLM
            </label>
            <div className="px-4 py-4 rounded-lg bg-accent-violet/10 border border-accent-violet/30 text-gray-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {estimationResult || project.llm_estimation}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent-blue" />
            Технологии
          </label>
          {isEditing ? (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Например: React, Python, PostgreSQL"
                />
                <button
                  type="button"
                  onClick={handleAddTechStack}
                  className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors"
                >
                  Добавить
                </button>
              </div>
              {formData.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechStack(tech)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-500 italic">
              Не указано
            </div>
          )}
        </div>
      </div>

      {/* Задачи проекта */}
      <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-accent-violet" />
              Задачи проекта
            </h2>
            <p className="text-sm text-gray-400">
              {project.tasks && project.tasks.length > 0
                ? `${project.tasks.length} ${project.tasks.length === 1 ? 'задача' : 'задач'}`
                : 'Задачи не созданы'}
            </p>
          </div>
          {isOwner && project.status !== 'draft' && (
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить задачу
            </button>
          )}
        </div>

        {project.tasks && project.tasks.length > 0 ? (
          <div className="space-y-3">
            {project.tasks.map((task) => {
              const taskStatus = taskStatusLabels[task.status] || taskStatusLabels.pending;
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-work21-dark/50 border border-work21-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        task.status === 'completed' ? 'bg-accent-green' :
                        task.status === 'in_progress' ? 'bg-accent-blue' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${taskStatus.color}`}>
                      {taskStatus.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {task.estimated_hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimated_hours} ч
                        </div>
                      )}
                      {task.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.deadline)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Сложность: {task.complexity}/5
                      </div>
                    </div>
                    
                    {/* Исполнитель */}
                    <div className="flex items-center gap-3">
                      {task.assignee ? (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/30">
                          {task.assignee.avatar_url ? (
                            <img
                              src={task.assignee.avatar_url}
                              alt={`${task.assignee.first_name} ${task.assignee.last_name}`}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-accent-blue">
                                {task.assignee.first_name[0]}{task.assignee.last_name[0]}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-gray-300">
                            {task.assignee.first_name} {task.assignee.last_name}
                          </span>
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(task)}
                              className="text-xs text-accent-blue hover:text-accent-green transition-colors underline"
                            >
                              Изменить
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          {isOwner ? (
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(task)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors text-xs font-medium"
                            >
                              <UserPlus className="w-3 h-3" />
                              Назначить исполнителя
                            </button>
                          ) : (
                            <div className="text-xs text-gray-500 italic">
                              Исполнитель не назначен
                            </div>
                          )}
                        </>
                      )}
                      {user.role === 'student' && task.assignee_id === user.id && (
                        <div className="px-2 py-1 rounded-lg bg-accent-green/10 border border-accent-green/30 text-xs text-accent-green font-medium">
                          Моя задача
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Задачи проекта будут отображаться здесь</p>
          </div>
        )}
      </div>

      {/* Дополнительная информация */}
      <div className="glass-card rounded-2xl border border-work21-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent-amber" />
          Дополнительная информация
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Дата создания</div>
            <div className="text-white">{formatDate(project.created_at)}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Последнее обновление</div>
            <div className="text-white">{formatDate(project.updated_at)}</div>
          </div>
          {project.generated_spec && (
            <div className="md:col-span-2">
              <div className="text-gray-500 mb-1">Сгенерированная спецификация</div>
              <div className="px-4 py-3 rounded-lg bg-work21-dark/50 border border-work21-border text-gray-300 whitespace-pre-wrap text-xs">
                {project.generated_spec}
              </div>
            </div>
          )}
        </div>
      </div>

      {project.status === 'completed' && !hasRating && (
        <div className="glass-card rounded-2xl border border-work21-border p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-amber" />
            Оставить отзыв
          </h2>
          {isOwner && project.assignee ? (
            <div className="space-y-4">
              <p className="text-gray-400">
                Оцените работу исполнителя {project.assignee.first_name} {project.assignee.last_name}
              </p>
              <button
                onClick={() => setRatingModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-accent-amber/10 border border-accent-amber/30 text-accent-amber hover:bg-accent-amber/20 transition-colors"
              >
                Оставить отзыв
              </button>
            </div>
          ) : isAssignee && project.customer_id ? (
            <div className="space-y-4">
              <p className="text-gray-400">Оцените работу с заказчиком</p>
              <button
                onClick={() => setRatingModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-accent-amber/10 border border-accent-amber/30 text-accent-amber hover:bg-accent-amber/20 transition-colors"
              >
                Оставить отзыв
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Модальное окно выбора исполнителя */}
      {assignModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-work21-border p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Назначить исполнителя для задачи: {selectedTask.title}
              </h3>
              <button
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedTask(null);
                  setSearchQuery('');
                }}
                className="p-2 rounded-lg hover:bg-work21-border transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Поиск */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              />
            </div>

            {/* Кнопка убрать исполнителя */}
            {selectedTask.assignee_id && (
              <button
                onClick={() => handleAssignTask(null)}
                disabled={isAssigning}
                className="w-full mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Убрать исполнителя
              </button>
            )}

            {/* Список студентов */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-accent-green animate-spin" />
                </div>
              ) : (
                students
                  .filter((student) => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
                    const email = student.email.toLowerCase();
                    return fullName.includes(query) || email.includes(query);
                  })
                  .map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAssignTask(student.id)}
                      disabled={isAssigning || selectedTask.assignee_id === student.id}
                      className={`w-full p-4 rounded-lg border transition-colors text-left ${
                        selectedTask.assignee_id === student.id
                          ? 'bg-accent-green/20 border-accent-green/50'
                          : 'bg-work21-dark/50 border-work21-border hover:border-accent-green/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        {student.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={`${student.first_name} ${student.last_name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-accent-green/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center border-2 border-accent-green/30">
                            <span className="text-lg font-bold text-accent-green">
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-400">{student.email}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {student.rating_score.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {student.completed_projects} проектов
                            </div>
                          </div>
                        </div>
                        {selectedTask.assignee_id === student.id && (
                          <CheckCircle2 className="w-5 h-5 text-accent-green" />
                        )}
                      </div>
                    </button>
                  ))
              )}
              {!isLoadingStudents && students.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  Студенты не найдены
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора исполнителя для проекта */}
      {assignProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-work21-border p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Назначить исполнителя для проекта: {project.title}
              </h3>
              <button
                onClick={() => {
                  setAssignProjectModalOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 rounded-lg hover:bg-work21-border transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Поиск */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              />
            </div>

            {/* Кнопка убрать исполнителя */}
            {project.assignee_id && (
              <button
                onClick={() => handleAssignProject(null)}
                disabled={isAssigningProject}
                className="w-full mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Убрать исполнителя
              </button>
            )}

            {/* Список студентов */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-accent-green animate-spin" />
                </div>
              ) : (
                students
                  .filter((student) => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
                    const email = student.email.toLowerCase();
                    return fullName.includes(query) || email.includes(query);
                  })
                  .map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAssignProject(student.id)}
                      disabled={isAssigningProject || project.assignee_id === student.id}
                      className={`w-full p-4 rounded-lg border transition-colors text-left ${
                        project.assignee_id === student.id
                          ? 'bg-accent-green/20 border-accent-green/50'
                          : 'bg-work21-dark/50 border-work21-border hover:border-accent-green/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        {student.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={`${student.first_name} ${student.last_name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-accent-green/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center border-2 border-accent-green/30">
                            <span className="text-lg font-bold text-accent-green">
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-400">{student.email}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {student.rating_score.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {student.completed_projects} проектов
                            </div>
                          </div>
                        </div>
                        {project.assignee_id === student.id && (
                          <CheckCircle2 className="w-5 h-5 text-accent-green" />
                        )}
                      </div>
                    </button>
                  ))
              )}
              {!isLoadingStudents && students.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  Студенты не найдены
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {createTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-work21-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Создать задачу</h3>
              <button
                onClick={() => {
                  setCreateTaskModalOpen(false);
                  setTaskFormData({ title: '', description: '', complexity: 3, estimated_hours: '', deadline: '' });
                  setError('');
                }}
                className="p-2 rounded-lg hover:bg-work21-border transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название задачи <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Например: Настроить базу данных"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
                <textarea
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
                  placeholder="Подробное описание задачи..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Сложность (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={taskFormData.complexity}
                    onChange={(e) => setTaskFormData({ ...taskFormData, complexity: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Оценка времени (часы)</label>
                  <input
                    type="number"
                    min="1"
                    value={taskFormData.estimated_hours}
                    onChange={(e) => setTaskFormData({ ...taskFormData, estimated_hours: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="8"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Срок выполнения</label>
                <input
                  type="datetime-local"
                  value={taskFormData.deadline}
                  onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-work21-border">
              <button
                onClick={() => {
                  setCreateTaskModalOpen(false);
                  setTaskFormData({ title: '', description: '', complexity: 3, estimated_hours: '', deadline: '' });
                  setError('');
                }}
                disabled={isCreatingTask}
                className="px-4 py-2 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTask}
                disabled={isCreatingTask || !taskFormData.title.trim()}
                className="px-4 py-2 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreatingTask ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Создать задачу
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {ratingModalOpen && project && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-work21-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Оставить отзыв</h3>
              <button
                onClick={() => {
                  setRatingModalOpen(false);
                  setRatingFormData({ score: 5, comment: '', quality_score: 5, communication_score: 5, deadline_score: 5 });
                  setError('');
                }}
                className="p-2 rounded-lg hover:bg-work21-border transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Общая оценка (1-5) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratingFormData.score}
                  onChange={(e) => setRatingFormData({ ...ratingFormData, score: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Комментарий</label>
                <textarea
                  value={ratingFormData.comment}
                  onChange={(e) => setRatingFormData({ ...ratingFormData, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
                  placeholder="Ваш отзыв..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Качество (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratingFormData.quality_score}
                    onChange={(e) => setRatingFormData({ ...ratingFormData, quality_score: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Коммуникация (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratingFormData.communication_score}
                    onChange={(e) => setRatingFormData({ ...ratingFormData, communication_score: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Сроки (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratingFormData.deadline_score}
                    onChange={(e) => setRatingFormData({ ...ratingFormData, deadline_score: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-work21-border">
              <button
                onClick={() => {
                  setRatingModalOpen(false);
                  setRatingFormData({ score: 5, comment: '', quality_score: 5, communication_score: 5, deadline_score: 5 });
                  setError('');
                }}
                disabled={isSubmittingRating}
                className="px-4 py-2 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={isSubmittingRating}
                className="px-4 py-2 rounded-lg bg-accent-amber text-white hover:bg-accent-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingRating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    Отправить отзыв
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

