import React from 'react';
import { Hammer } from 'lucide-react';
import HashScrollLinkButton from '../ui/HashScrollLinkButton';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6 min-w-0">
              <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-lg shrink-0">
                <Hammer className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter truncate">
                Дядя <span className="text-accent">Фёдор</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Профессиональный ремонт квартир и домов в Екатеринбурге и городах-спутниках. 
              Работаем с 2012 года.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Навигация</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><HashScrollLinkButton to="services" className="hover:text-accent transition-colors">Цены</HashScrollLinkButton></li>
              <li><HashScrollLinkButton to="stages" className="hover:text-accent transition-colors">Этапы работ</HashScrollLinkButton></li>
              <li><HashScrollLinkButton to="portfolio" className="hover:text-accent transition-colors">Портфолио</HashScrollLinkButton></li>
              <li><a href="/Flat/calculator" className="hover:text-accent transition-colors">Калькулятор</a></li>
              <li><a href="/Flat/blog" className="hover:text-accent transition-colors">Блог о ремонте</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Услуги</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="/Flat/kosmeticheskiy-remont" className="hover:text-accent transition-colors">Косметический ремонт</a></li>
              <li><a href="/Flat/remont-novostroek" className="hover:text-accent transition-colors">Ремонт новостроек</a></li>
              <li><HashScrollLinkButton to="calculator" className="hover:text-accent transition-colors">Капитальный ремонт</HashScrollLinkButton></li>
              <li><HashScrollLinkButton to="calculator" className="hover:text-accent transition-colors">Дизайн интерьера</HashScrollLinkButton></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Контакты</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="tel:89221800911" className="hover:text-white transition-colors">8-922-18-00-911</a></li>
              <li><a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram / MAX: @Mebabanza</a></li>
              <li><a href="mailto:3536246@gmail.com" className="hover:text-white transition-colors">3536246@gmail.com</a></li>
              <li>Пн-Вс: 09:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Дядя Фёдор. Все права защищены.</p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center">
            {/* Юридические данные будут добавлены позже */}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center">
            <a href="/Flat/privacy" className="hover:text-white transition-colors">Политика обработки персональных данных</a>
            <span className="cursor-default text-white/30">Пользовательское соглашение</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
