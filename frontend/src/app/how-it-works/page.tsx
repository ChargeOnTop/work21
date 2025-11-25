import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HowItWorks from '@/components/HowItWorks'
import { ArrowRight, Brain, UserSearch, FileCheck, CheckCircle } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute inset-0 gradient-glow" />
          
          <div className="container-lg mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-medium mb-6">
                Процесс работы
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Как работает{' '}
                <span className="gradient-text">WORK21</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                Простой и прозрачный процесс от создания задачи до получения готового продукта
              </p>
            </div>
          </div>
        </section>

        {/* Reuse HowItWorks component */}
        <HowItWorks />

        {/* AI Agents Detail */}
        <section className="section">
          <div className="container-lg mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Три AI-агента на страже проекта
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Когда заказчик создаёт задачу, автоматически активируются три интеллектуальных агента
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Task Analyst */}
              <div className="glass-card rounded-2xl p-8 border-accent-green/20">
                <div className="inline-flex p-4 rounded-2xl bg-accent-green/10 text-accent-green mb-6">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Task Analyst</h3>
                <p className="text-gray-400 mb-6">
                  Анализирует задачу заказчика и превращает её в структурированное техническое задание.
                </p>
                <ul className="space-y-3">
                  {[
                    'Анализ требований',
                    'Декомпозиция на подзадачи',
                    'Оценка сложности проекта',
                    'Определение сроков',
                    'Выявление рисков',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-accent-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talent Matcher */}
              <div className="glass-card rounded-2xl p-8 border-accent-blue/20">
                <div className="inline-flex p-4 rounded-2xl bg-accent-blue/10 text-accent-blue mb-6">
                  <UserSearch className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Talent Matcher</h3>
                <p className="text-gray-400 mb-6">
                  Ищет идеальных исполнителей среди студентов Школы 21 на основе данных профиля.
                </p>
                <ul className="space-y-3">
                  {[
                    'Поиск по навыкам',
                    'Анализ рейтинга',
                    'Проверка портфолио',
                    'Оценка доступности',
                    'Ранжирование кандидатов',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-accent-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Assistant */}
              <div className="glass-card rounded-2xl p-8 border-accent-violet/20">
                <div className="inline-flex p-4 rounded-2xl bg-accent-violet/10 text-accent-violet mb-6">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Legal Assistant</h3>
                <p className="text-gray-400 mb-6">
                  Обеспечивает юридическую безопасность сделки для обеих сторон.
                </p>
                <ul className="space-y-3">
                  {[
                    'Генерация договора',
                    'Фиксация условий',
                    'Определение ответственности',
                    'Обработка платежей',
                    'Закрытие договора',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-accent-violet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Model */}
        <section className="section bg-work21-darker">
          <div className="container-lg mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-amber/10 text-accent-amber text-sm font-medium mb-4">
                  Финансовая модель
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Прозрачная комиссия
                </h2>
                <p className="text-gray-400 mb-6">
                  Платформа взимает комиссию только с успешно завершённых проектов. 
                  Мы выступаем гарантом безопасности сделки для обеих сторон.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent-green font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Заказчик оплачивает проект</h4>
                      <p className="text-sm text-gray-400">Полная сумма + комиссия платформы</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent-blue font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Средства удерживаются</h4>
                      <p className="text-sm text-gray-400">Как гарант до завершения проекта</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent-violet font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Студент получает оплату</h4>
                      <p className="text-sm text-gray-400">100% согласованной суммы после приёмки</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card rounded-2xl p-8 text-center">
                <h3 className="text-lg text-gray-400 mb-2">Комиссия платформы</h3>
                <div className="text-6xl font-bold text-white mb-4">10%</div>
                <p className="text-gray-400 mb-6">от суммы проекта</p>
                <div className="pt-6 border-t border-work21-border space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Стоимость проекта</span>
                    <span className="text-white font-medium">100 000 ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Комиссия</span>
                    <span className="text-white font-medium">10 000 ₽</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-work21-border">
                    <span className="text-gray-400">Итого к оплате</span>
                    <span className="text-accent-green font-bold">110 000 ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container-lg mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Всё понятно? Начинаем!
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Присоединяйтесь к платформе и начните работать уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=student" className="btn-primary inline-flex items-center justify-center gap-2">
                Я студент
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register?role=customer" className="btn-outline inline-flex items-center justify-center gap-2">
                Я заказчик
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


