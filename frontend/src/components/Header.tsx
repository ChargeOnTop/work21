'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import ThemeToggle from './ThemeToggle'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Для студентов', href: '/students' },
  { name: 'Для заказчиков', href: '/customers' },
  { name: 'Как это работает', href: '/how-it-works' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      <nav className="container-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              WORK<span className="text-accent-green">21</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-green transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  background: 'var(--color-card)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <span className="text-accent-green text-sm font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>{user.first_name}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                  Войти
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Начать
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors py-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <ThemeToggle />
                {isAuthenticated && user ? (
                  <Link 
                    href="/dashboard" 
                    className="btn-primary text-sm flex-1 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="btn-secondary text-sm flex-1 text-center">
                      Войти
                    </Link>
                    <Link href="/register" className="btn-primary text-sm flex-1 text-center">
                      Начать
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

