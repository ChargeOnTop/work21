'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold text-white">Настройки</h1>
          <p className="text-sm text-gray-400">Управление настройками аккаунта</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-work21-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-accent-blue" />
          <h2 className="text-xl font-semibold text-white">Уведомления</h2>
        </div>
        <p className="text-gray-400 mb-4">Настройки уведомлений будут доступны в будущих обновлениях</p>
      </div>

      <div className="glass-card rounded-2xl border border-work21-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-accent-green" />
          <h2 className="text-xl font-semibold text-white">Безопасность</h2>
        </div>
        <p className="text-gray-400 mb-4">Настройки безопасности будут доступны в будущих обновлениях</p>
      </div>

      <div className="glass-card rounded-2xl border border-work21-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-accent-violet" />
          <h2 className="text-xl font-semibold text-white">Пароль</h2>
        </div>
        <p className="text-gray-400 mb-4">Смена пароля будет доступна в будущих обновлениях</p>
      </div>
    </div>
  );
}

