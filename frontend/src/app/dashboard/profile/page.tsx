'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Save, Shield, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';

interface ProfileFormState {
  first_name: string;
  last_name: string;
  bio?: string;
  skills?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormState>({
    first_name: '',
    last_name: '',
    bio: '',
    skills: '',
    avatar_url: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        skills: user.skills || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const skillBadges = useMemo(() => {
    if (!formData.skills) return [];
    return formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [formData.skills]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          ? formData.skills
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean)
          : undefined,
      };

      await api.users.updateMe(payload);
      await refreshUser();
      setSuccessMessage('Профиль успешно обновлён');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не удалось сохранить изменения. Попробуйте снова.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Профиль</h1>
        <p className="text-gray-400">
          Обновите информацию о себе, чтобы повысить доверие заказчиков и увеличить шанс получить проект.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-2 space-y-6">
          {successMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/40 bg-green-500/10 text-green-300 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основное */}
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Основная информация</h2>
                <p className="text-sm text-gray-400">
                  Эти данные видны заказчикам в списках и карточках профиля.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Имя</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Иван"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Фамилия</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="Сидоров"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors min-h-[140px]"
                  placeholder="Опишите опыт, сильные стороны и интересы."
                />
              </div>
            </section>

            {/* Навыки */}
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Навыки и стек</h2>
                  <p className="text-sm text-gray-400">
                    Перечислите ключевые технологии через запятую — они появятся тегами.
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors min-h-[100px]"
                  placeholder="Python, FastAPI, PostgreSQL, Docker"
                />
              </div>

              {skillBadges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skillBadges.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Медиа */}
            <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Фото профиля</h2>
                <p className="text-sm text-gray-400">
                  Укажите ссылку на изображение — поддерживается любой публичный URL.
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">URL аватара</label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-work21-dark border border-work21-border text-white focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="https://..."
                />
              </div>
              {formData.avatar_url && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-work21-dark border border-work21-border">
                  <img
                    src={formData.avatar_url}
                    alt="Аватар"
                    className="w-16 h-16 rounded-full object-cover border border-work21-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="text-sm text-gray-400">
                    Предпросмотр изображения профиля
                  </div>
                </div>
              )}
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Сохраняем...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Сохранить профиль
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-2xl font-semibold text-white">
                {user.first_name[0]}
                {user.last_name[0]}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-400 capitalize">
                  {user.role === 'student' ? 'Студент' : 'Заказчик'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-work21-dark border border-work21-border p-4">
                <div className="text-gray-400 text-sm mb-1">Рейтинг</div>
                <div className="flex items-center gap-2 text-white text-2xl font-semibold">
                  <Star className="w-5 h-5 text-accent-amber" />
                  {user.rating_score.toFixed(1)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Обновляется ежедневно</p>
              </div>
              <div className="rounded-2xl bg-work21-dark border border-work21-border p-4">
                <div className="text-gray-400 text-sm mb-1">Проекты</div>
                <div className="text-white text-2xl font-semibold">{user.completed_projects}</div>
                <p className="text-xs text-gray-500 mt-1">Успешно завершено</p>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl border border-work21-border p-6 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-5 h-5 text-accent-blue" />
              <div className="font-semibold">Верификация аккаунта</div>
            </div>
            <p className="text-sm text-gray-400">
              Верифицированные профили получают больше доверия от заказчиков и чаще попадают в подборки AI-агентов.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className={`w-4 h-4 ${user.is_verified ? 'text-accent-green' : 'text-gray-600'}`} />
              {user.is_verified ? 'Аккаунт подтверждён' : 'Ожидает подтверждения'}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


