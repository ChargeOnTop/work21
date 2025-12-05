import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'WORK21 — Платформа для Школы 21',
  description: 'Соединяем студентов Школы 21 с реальными заказчиками. Получайте коммерческий опыт и портфолио.',
  keywords: ['School 21', 'freelance', 'студенты', 'разработка', 'IT проекты'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        {/* Скрипт для предотвращения мерцания при загрузке */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased transition-colors duration-300" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

