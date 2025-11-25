import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  Trophy, 
  Star, 
  Code, 
  Clock,
  DollarSign,
  Award,
  Target
} from 'lucide-react'

const benefits = [
  {
    icon: Briefcase,
    title: 'Реальные проекты',
    description: 'Работайте над настоящими коммерческими задачами от реальных заказчиков, а не над учебными симуляциями.',
  },
  {
    icon: TrendingUp,
    title: 'Рост портфолио',
    description: 'Каждый завершённый проект — это новая строчка в резюме и доказательство ваших навыков.',
  },
  {
    icon: DollarSign,
    title: 'Честная оплата',
    description: 'Получайте деньги за свою работу. Платформа гарантирует безопасность платежей.',
  },
  {
    icon: Trophy,
    title: 'Рейтинговая система',
    description: 'Зарабатывайте очки репутации, поднимайтесь в рейтинге и получайте доступ к лучшим проектам.',
  },
  {
    icon: Award,
    title: 'Ежемесячные бонусы',
    description: 'Топ-студенты получают денежные премии из специального фонда платформы.',
  },
  {
    icon: Target,
    title: 'Job Connect',
    description: 'Работодатели видят ваш профиль и могут пригласить на постоянную работу.',
  },
]

const howToStart = [
  { step: '01', title: 'Регистрация', description: 'Создайте профиль, укажите навыки и опыт' },
  { step: '02', title: 'Поиск проектов', description: 'Изучайте доступные задачи и подавайте заявки' },
  { step: '03', title: 'Выполнение', description: 'Работайте согласно ТЗ, получайте обратную связь' },
  { step: '04', title: 'Оплата и рейтинг', description: 'Получите деньги и очки репутации' },
]

export default function StudentsPage() {
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium mb-6">
                Для студентов Школы 21
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Превратите навыки в{' '}
                <span className="gradient-text">реальный опыт</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                WORK21 — это мост между обучением и карьерой. Выполняйте реальные проекты, 
                зарабатывайте деньги и стройте портфолио ещё до окончания Школы 21.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?role=student" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                  Начать зарабатывать
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/how-it-works" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
                  Как это работает
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="section bg-work21-darker">
          <div className="container-lg mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Что вы получаете
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Всё, что нужно для профессионального роста и финансовой независимости
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="glass-card rounded-2xl p-6 hover:border-accent-green/30 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-accent-green/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-accent-green" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How to Start */}
        <section className="section">
          <div className="container-lg mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Начните за 4 простых шага
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToStart.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-green">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rating System */}
        <section className="section bg-work21-darker">
          <div className="container-lg mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-amber/10 text-accent-amber text-sm font-medium mb-4">
                  Геймификация
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Рейтинговая система с бонусами
                </h2>
                <p className="text-gray-400 mb-6">
                  Ваш рейтинг строится на основе количества проектов, оценок заказчиков, 
                  сложности задач и соблюдения сроков. Топ-студенты ежемесячно получают 
                  денежные премии из специального фонда.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Star className="w-5 h-5 text-accent-amber" />
                    Очки за каждый завершённый проект
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Code className="w-5 h-5 text-accent-amber" />
                    Бонусы за сложные технические задачи
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-accent-amber" />
                    Множители за соблюдение дедлайнов
                  </li>
                </ul>
              </div>
              
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Пример рейтинга</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Алексей К.', score: 4850, projects: 23 },
                    { name: 'Мария С.', score: 4720, projects: 19 },
                    { name: 'Дмитрий В.', score: 4580, projects: 21 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-work21-dark/50">
                      <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                        <span className="font-bold text-accent-green">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.projects} проектов</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent-green">{user.score}</div>
                        <div className="text-xs text-gray-400">очков</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container-lg mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Готовы начать свой путь?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Присоединяйтесь к тысячам студентов, которые уже зарабатывают 
              и строят карьеру на WORK21
            </p>
            <Link href="/register?role=student" className="btn-primary inline-flex items-center gap-2 text-lg">
              Создать профиль
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


