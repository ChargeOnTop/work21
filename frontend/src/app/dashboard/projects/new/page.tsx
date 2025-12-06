'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { projectsApi, estimatorApi, ApiError } from '@/lib/api';

interface ProjectFormData {
  title: string;
  description: string;
  requirements: string;
  budget: string;
  deadline: string;
  tech_stack: string[];
  llm_estimation?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: '',
    tech_stack: [],
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<string | null>(null);
  const [estimationError, setEstimationError] = useState('');

  // Проверяем, что пользователь - заказчик
  useEffect(() => {
    if (user && user.role !== 'customer') {
      router.push('/dashboard');
    }
  }, [user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

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

    setIsSubmitting(true);

    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim() || undefined,
        budget: budget,
        deadline: formData.deadline || undefined,
        tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : undefined,
        llm_estimation: formData.llm_estimation || undefined,
      };

      const project = await projectsApi.create(projectData);
      
      setSuccess(true);
      
      // Редирект на главную страницу дашборда через 1.5 секунды
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при создании проекта');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'customer') {
    return null;
  }

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
          <h1 className="text-2xl font-bold text-white">Создать проект</h1>
          <p className="text-sm text-gray-400">
            Заполните информацию о проекте, чтобы найти исполнителей
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="glass-card rounded-xl p-4 border border-accent-green/30 bg-accent-green/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
          <div>
            <p className="text-accent-green font-medium">Проект успешно создан!</p>
            <p className="text-sm text-gray-400">Перенаправление на страницу проекта...</p>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
          {/* Основная информация */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Основная информация
            </h2>
            <p className="text-sm text-gray-400">
              Укажите название и описание вашего проекта
            </p>
          </div>

          {/* Title */}
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
              placeholder="Например: Мобильное приложение для доставки"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/255 символов
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание проекта <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Подробно опишите, что нужно сделать. Чем больше деталей, тем лучше исполнители поймут задачу."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Требования
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
              placeholder="Дополнительные требования: платформы, интеграции, особенности..."
            />
          </div>
        </div>

        {/* Детали проекта */}
        <div className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Детали проекта
            </h2>
            <p className="text-sm text-gray-400">
              Укажите бюджет, сроки и технологии
            </p>
          </div>

          {/* Estimate Button - Prominent */}
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
            
            {/* Estimation Error */}
            {estimationError && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400">{estimationError}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Бюджет (₽) <span className="text-red-400">*</span>
                {formData.budget && (
                  <span className="ml-2 text-xs text-accent-green">
                    (автоматически рассчитано)
                  </span>
                )}
              </label>
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
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Срок выполнения
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
              />
            </div>
          </div>

          {/* LLM Estimation - Full Width Field */}
          {estimationResult && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-violet" />
                Оценка времени выполнения от LLM
              </label>
              <div className="px-4 py-4 rounded-lg bg-accent-violet/10 border border-accent-violet/30 text-gray-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
                {estimationResult}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Технологии
            </label>
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
            
            {/* Tech Stack Tags */}
            {formData.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech) => (
                  <span
                    key={tech}
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
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-work21-card border border-work21-border text-gray-300 hover:border-gray-600 transition-colors"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Создание...
              </>
            ) : (
              'Создать проект'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

