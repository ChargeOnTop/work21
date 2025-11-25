import { Rocket, Eye, ShieldCheck, Trophy, Briefcase, TrendingUp } from 'lucide-react'

const features = {
  students: [
    {
      icon: Briefcase,
      title: 'Реальный опыт',
      description: 'Не симуляции, а настоящие коммерческие проекты от реальных заказчиков',
    },
    {
      icon: TrendingUp,
      title: 'Карьерный рост',
      description: 'Каждый проект — строчка в резюме и очки к вашему рейтингу',
    },
    {
      icon: Trophy,
      title: 'Денежные бонусы',
      description: 'Топ-студенты ежемесячно получают премии из фонда платформы',
    },
  ],
  customers: [
    {
      icon: Rocket,
      title: 'Быстрый старт',
      description: 'От идеи до первого этапа разработки за считанные дни',
    },
    {
      icon: Eye,
      title: 'Прозрачность',
      description: 'AI помогает честно оценить объём работ и бюджет проекта',
    },
    {
      icon: ShieldCheck,
      title: 'Безопасность',
      description: 'Платформа гарантирует качество результата и защиту сделки',
    },
  ],
}

export default function Features() {
  return (
    <section className="section relative">
      <div className="container-lg mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium mb-4">
            Преимущества
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Выигрывают все
          </h2>
          <p className="text-lg text-gray-400">
            WORK21 создаёт win-win ситуацию для студентов и заказчиков
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Students Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Для студентов</h3>
                <p className="text-sm text-gray-400">Получите опыт и заработок</p>
              </div>
            </div>
            <div className="space-y-4">
              {features.students.map((feature, index) => (
                <FeatureCard key={index} {...feature} color="green" />
              ))}
            </div>
          </div>

          {/* Customers Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Для заказчиков</h3>
                <p className="text-sm text-gray-400">Получите результат быстро</p>
              </div>
            </div>
            <div className="space-y-4">
              {features.customers.map((feature, index) => (
                <FeatureCard key={index} {...feature} color="blue" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color = 'green',
}: {
  icon: React.ElementType
  title: string
  description: string
  color?: 'green' | 'blue'
}) {
  const colorClasses = {
    green: 'text-accent-green bg-accent-green/10',
    blue: 'text-accent-blue bg-accent-blue/10',
  }

  return (
    <div className="glass-card rounded-xl p-5 flex gap-4 hover:border-work21-border/80 transition-colors group">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}


