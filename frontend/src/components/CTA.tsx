import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-work21-dark via-work21-darker to-work21-dark" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-green/10 rounded-full blur-3xl" />

      <div className="container-lg mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex p-4 rounded-2xl bg-accent-green/10 text-accent-green mb-8 animate-pulse-glow">
            <Zap className="w-10 h-10" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Готовы начать?
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Присоединяйтесь к платформе, которая соединяет образование с реальным рынком труда. 
            Начните свой путь уже сегодня.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=student"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Зарегистрироваться как студент
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?role=customer"
              className="btn-outline inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Создать проект как заказчик
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              Бесплатная регистрация
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue" />
              Безопасные платежи
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
              Поддержка 24/7
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


