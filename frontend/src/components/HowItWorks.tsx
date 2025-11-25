import { ClipboardList, Bot, Users, Code, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Заказчик создаёт задачу',
    description: 'Описывает потребности: что нужно разработать, какой результат ожидает, какой бюджет готов выделить.',
    color: 'green',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI-агенты анализируют',
    description: 'Task Analyst формирует ТЗ, Talent Matcher ищет исполнителей, Legal Assistant готовит договор.',
    color: 'blue',
  },
  {
    number: '03',
    icon: Users,
    title: 'Студенты подают заявки',
    description: 'Видят реальный проект, реальную оплату и возможность добавить работу в портфолио.',
    color: 'violet',
  },
  {
    number: '04',
    icon: Code,
    title: 'Работа над проектом',
    description: 'Отобранные участники выполняют этапы согласно ТЗ, получают обратную связь.',
    color: 'amber',
  },
  {
    number: '05',
    icon: CheckCircle,
    title: 'Готовый продукт',
    description: 'В кратчайшие сроки вы получаете результат. Оплата, рейтинг, договор — всё закрывается автоматически.',
    color: 'green',
  },
]

const colorStyles = {
  green: { bg: 'bg-accent-green/10', text: 'text-accent-green', border: 'border-accent-green/30' },
  blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'border-accent-blue/30' },
  violet: { bg: 'bg-accent-violet/10', text: 'text-accent-violet', border: 'border-accent-violet/30' },
  amber: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', border: 'border-accent-amber/30' },
}

export default function HowItWorks() {
  return (
    <section className="section bg-work21-darker relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container-lg mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-medium mb-4">
            Процесс
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Как это работает
          </h2>
          <p className="text-lg text-gray-400">
            От идеи до готового продукта за 5 простых шагов
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-green via-accent-blue to-accent-violet" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => {
              const styles = colorStyles[step.color as keyof typeof colorStyles]
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={step.number}
                  className={`relative md:flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className={`glass-card rounded-2xl p-6 border ${styles.border} hover:shadow-lg transition-shadow`}>
                      <div className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`p-3 rounded-xl ${styles.bg}`}>
                          <Icon className={`w-6 h-6 ${styles.text}`} />
                        </div>
                        <span className={`text-sm font-mono ${styles.text}`}>Шаг {step.number}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-work21-dark border-2 border-accent-green z-10" />

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


