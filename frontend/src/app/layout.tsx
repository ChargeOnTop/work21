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
    <html lang="ru">
      <body className="min-h-screen bg-work21-dark text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

