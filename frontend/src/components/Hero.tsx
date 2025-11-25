import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 gradient-glow" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <div className="container-lg mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-work21-card border border-work21-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <span className="text-sm text-gray-300">Платформа нового поколения</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="block text-white">Соединяем</span>
            <span className="block gradient-text">таланты и бизнес</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-100">
            <span className="text-white font-medium">WORK21</span> — платформа, где студенты Школы 21 
            получают реальный коммерческий опыт, а компании находят молодые таланты
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animate-delay-200">
            <Link href="/register?role=student" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
              Я студент
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register?role=customer" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
              Я заказчик
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up animate-delay-300">
            <StatCard icon={<Users className="w-6 h-6" />} value="9,000+" label="Студентов в сети" />
            <StatCard icon={<Sparkles className="w-6 h-6" />} value="AI" label="Автоматизация" color="blue" />
            <StatCard icon={<Shield className="w-6 h-6" />} value="100%" label="Безопасность сделок" color="violet" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-work21-dark to-transparent" />
    </section>
  )
}

function StatCard({ 
  icon, 
  value, 
  label, 
  color = 'green' 
}: { 
  icon: React.ReactNode
  value: string
  label: string
  color?: 'green' | 'blue' | 'violet'
}) {
  const colorClasses = {
    green: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    violet: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  }

  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}


