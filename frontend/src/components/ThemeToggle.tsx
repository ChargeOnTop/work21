'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1e1e2a 0%, #12121a 100%)' 
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        border: `1px solid ${theme === 'dark' ? '#2a2a3a' : '#cbd5e1'}`,
      }}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
    >
      <div className="relative w-5 h-5">
        {/* Солнце */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 text-amber-500' 
              : 'rotate-90 scale-0 text-gray-400'
          }`}
        />
        {/* Луна */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 text-blue-400' 
              : '-rotate-90 scale-0 text-gray-400'
          }`}
        />
      </div>
      
      {/* Подсветка при hover */}
      <div 
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          theme === 'dark' 
            ? 'bg-blue-500/10' 
            : 'bg-amber-500/10'
        }`}
      />
    </button>
  );
}

