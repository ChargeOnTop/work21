import Link from 'next/link'
import { Zap, Github, MessageCircle, Mail } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'Для студентов', href: '/students' },
    { name: 'Для заказчиков', href: '/customers' },
    { name: 'Как это работает', href: '/how-it-works' },
    { name: 'Job Connect', href: '/jobs' },
  ],
  support: [
    { name: 'Документация', href: '/docs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Контакты', href: '/contacts' },
    { name: 'Поддержка', href: '/support' },
  ],
  legal: [
    { name: 'Условия использования', href: '/terms' },
    { name: 'Политика конфиденциальности', href: '/privacy' },
    { name: 'Публичная оферта', href: '/offer' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-work21-darker border-t border-work21-border">
      <div className="container-lg mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                WORK<span className="text-accent-green">21</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Платформа, соединяющая студентов Школы 21 с реальными заказчиками. 
              Получайте опыт, создавайте портфолио, зарабатывайте.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="https://t.me" icon={<MessageCircle className="w-5 h-5" />} />
              <SocialLink href="mailto:hello@work21.ru" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-4">Платформа</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Поддержка</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Правовая информация</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-work21-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WORK21. Все права защищены.
          </p>
          <p className="text-sm text-gray-500">
            Сделано с 💚 для{' '}
            <span className="text-accent-green">Школы 21</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg bg-work21-card border border-work21-border flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-green/50 transition-all"
    >
      {icon}
    </a>
  )
}


