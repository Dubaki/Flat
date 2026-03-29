import React from 'react';
import { ChevronRight } from 'lucide-react';
import HashScrollLinkButton from '../ui/HashScrollLinkButton';
import DirectorCard from './DirectorCard';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-12 w-full bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1920" 
          alt="Modern interior" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Левая часть */}
          <div className="lg:col-span-7 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-3xl xs:text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
              Ремонт квартир <span className="italic font-serif text-accent break-keep">без посредников</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Честные цены по рынку Екатеринбурга. От черновой отделки в новостройке до капитального ремонта вторички. Точная смета до начала работ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <HashScrollLinkButton to="calculator" className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-accent/30">
                Рассчитать стоимость
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </HashScrollLinkButton>
              <HashScrollLinkButton to="portfolio" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Смотреть примеры
              </HashScrollLinkButton>
            </div>

            <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-3xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Лет в Екб</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">350+</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Сданных квартир</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">3 года</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Гарантия по договору</div>
              </div>
            </div>
          </div>

          {/* Правая часть */}
          <div className="lg:col-span-5 w-full mt-12 lg:mt-0">
            <DirectorCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
