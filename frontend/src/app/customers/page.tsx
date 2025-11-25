import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ArrowRight, 
  Rocket, 
  Eye, 
  ShieldCheck, 
  Bot,
  Clock,
  DollarSign,
  Users,
  FileCheck,
  Zap
} from 'lucide-react'

const benefits = [
  {
    icon: Rocket,
    title: 'Быстрый старт',
    description: 'От идеи до первого этапа разработки за считанные дни, а не месяцы.',
  },
  {
    icon: Eye,
    title: 'Прозрачная стоимость',
    description: 'AI помогает честно оценить объём работ и бюджет. Никаких скрытых платежей.',
  },
  {
    icon: ShieldCheck,
    title: 'Безопасность сделки',
    description: 'Платформа выступает гарантом. Деньги переводятся исполнителю только после приёмки.',
  },
  {
    icon: Bot,
    title: 'AI-ассистенты',
    description: 'Три AI-агента автоматически формируют ТЗ, подбирают команду и готовят договор.',
  },
  {
    icon: Users,
    title: 'Проверенные исполнители',
    description: 'Студенты Школы 21 — это талантливые разработчики с актуальными навыками.',
  },
  {
    icon: DollarSign,
    title: 'Доступные цены',
    description: 'Качественная разработка по конкурентным ценам. Сниженные комиссии.',
  },
]

const aiAgents = [
  {
    name: 'Task Analyst',
    title: 'Анализ задачи',
    description: 'Превращает вашу идею в детальное ТЗ с подзадачами, сроками и оценкой рисков.',
    icon: FileCheck,
    color: 'green',
  },
  {
    name: 'Talent Matcher',
    title: 'Подбор команды',
    description: 'Находит лучших исполнителей среди студентов по навыкам и рейтингу.',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Legal Assistant',
    title: 'Договор',
    description: 'Автоматически формирует типовой договор, защищающий ваши интересы.',
    icon: ShieldCheck,
    color: 'violet',
  },
]

const colorStyles = {
  green: 'bg-accent-green/10 text-accent-green',
  blue: 'bg-accent-blue/10 text-accent-blue',
  violet: 'bg-accent-violet/10 text-accent-violet',
}

export default function CustomersPage() {
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-6">
                Для бизнеса и госструктур
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Найдите талантливых{' '}
                <span className="gradient-text">разработчиков</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                WORK21 открывает доступ к пулу из 9000+ студентов Школы 21 — 
                молодых IT-специалистов с актуальными навыками и высокой мотивацией.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?role=customer" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                  Создать проект
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/how-it-works" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
                  Узнать больше
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
                Преимущества платформы
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Всё для быстрой, качественной и безопасной разработки
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="glass-card rounded-2xl p-6 hover:border-accent-blue/30 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-accent-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Agents */}
        <section className="section">
          <div className="container-lg mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-medium mb-4">
                Автоматизация
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                AI делает всю рутину за вас
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Три AI-агента работают параллельно, чтобы за минуты подготовить проект к старту
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiAgents.map((agent, index) => {
                const Icon = agent.icon
                const styles = colorStyles[agent.color as keyof typeof colorStyles]
                
                return (
                  <div key={index} className="glass-card rounded-2xl p-8 text-center">
                    <div className={`inline-flex p-4 rounded-2xl ${styles} mb-6`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={`text-sm font-mono ${styles.split(' ')[1]}`}>{agent.name}</span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-3">{agent.title}</h3>
                    <p className="text-gray-400">{agent.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section bg-work21-darker">
          <div className="container-lg mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium mb-4">
                  Процесс
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  От идеи до результата
                </h2>
                <p className="text-gray-400 mb-8">
                  Простой и прозрачный процесс работы с платформой. 
                  Вы описываете задачу — мы делаем всё остальное.
                </p>
                
                <div className="space-y-6">
                  {[
                    { icon: FileCheck, title: 'Опишите задачу', desc: 'Расскажите, что нужно разработать' },
                    { icon: Bot, title: 'AI сформирует ТЗ', desc: 'Получите детальный план проекта' },
                    { icon: Users, title: 'Выберите команду', desc: 'Из предложенных кандидатов' },
                    { icon: Zap, title: 'Получите результат', desc: 'В оговорённые сроки' },
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Пример проекта</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-work21-dark/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Мобильное приложение</span>
                      <span className="px-2 py-1 rounded bg-accent-green/10 text-accent-green text-xs">Активен</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">React Native, Firebase, REST API</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>3 недели</span>
                      </div>
                      <div className="font-medium text-white">150 000 ₽</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-work21-dark/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Веб-сервис аналитики</span>
                      <span className="px-2 py-1 rounded bg-accent-blue/10 text-accent-blue text-xs">Новый</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Python, FastAPI, PostgreSQL</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>2 недели</span>
                      </div>
                      <div className="font-medium text-white">80 000 ₽</div>
                    </div>
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
              Запустите проект уже сегодня
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Создайте первый проект бесплатно. Комиссия взимается только 
              при успешном завершении работы.
            </p>
            <Link href="/register?role=customer" className="btn-primary inline-flex items-center gap-2 text-lg">
              Создать проект
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


