import { Brain, UserSearch, FileCheck, ArrowRight } from 'lucide-react'

const agents = [
  {
    id: 'task-analyst',
    name: 'Task Analyst',
    title: 'Агент-аналитик',
    description: 'Превращает идею заказчика в структурированное техническое задание. Анализирует требования, дробит на подзадачи, оценивает сроки и риски.',
    icon: Brain,
    color: 'green',
    features: ['Анализ требований', 'Декомпозиция задач', 'Оценка сложности', 'Планирование сроков'],
  },
  {
    id: 'talent-matcher',
    name: 'Talent Matcher',
    title: 'HR-агент',
    description: 'Находит идеальных исполнителей. Анализирует навыки, рейтинг и портфолио студентов, подбирая команду под конкретный проект.',
    icon: UserSearch,
    color: 'blue',
    features: ['Поиск по навыкам', 'Анализ рейтинга', 'Проверка портфолио', 'Ранжирование'],
  },
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    title: 'Агент-юрист',
    description: 'Обеспечивает безопасность сделки. Формирует типовой договор, фиксирует условия, защищает интересы обеих сторон.',
    icon: FileCheck,
    color: 'violet',
    features: ['Генерация договора', 'Условия и сроки', 'Защита сторон', 'Обработка платежей'],
  },
]

const colorStyles = {
  green: {
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/30',
    text: 'text-accent-green',
    glow: 'shadow-accent-green/20',
  },
  blue: {
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/30',
    text: 'text-accent-blue',
    glow: 'shadow-accent-blue/20',
  },
  violet: {
    bg: 'bg-accent-violet/10',
    border: 'border-accent-violet/30',
    text: 'text-accent-violet',
    glow: 'shadow-accent-violet/20',
  },
}

export default function AIAgents() {
  return (
    <section className="section bg-work21-darker relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container-lg mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
            Искусственный интеллект
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            AI — не помощник, а{' '}
            <span className="gradient-text">архитектор проектов</span>
          </h2>
          <p className="text-lg text-gray-400">
            Три AI-агента работают синхронно, превращая идею в готовый проект за дни, а не месяцы
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {agents.map((agent, index) => {
            const styles = colorStyles[agent.color as keyof typeof colorStyles]
            const Icon = agent.icon
            
            return (
              <div
                key={agent.id}
                className={`glass-card rounded-2xl p-6 lg:p-8 border ${styles.border} hover:shadow-lg hover:${styles.glow} transition-all duration-300 group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl ${styles.bg} ${styles.text} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <div className="mb-4">
                  <span className={`text-sm font-mono ${styles.text}`}>{agent.name}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{agent.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {agent.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <ArrowRight className={`w-4 h-4 ${styles.text}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            За считанные минуты система полностью готова к работе
          </p>
          <div className="inline-flex items-center gap-2 text-accent-green font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
            </span>
            Агенты активны и готовы к работе
          </div>
        </div>
      </div>
    </section>
  )
}


