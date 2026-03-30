import React from 'react';
import { ChevronRight, Calculator } from 'lucide-react';

const QuizCTA: React.FC = () => (
  <section className="relative py-20 overflow-hidden bg-slate-900">
    <div className="absolute inset-0">
      <img src="/quiz/photo/arhplan.png" alt="" className="w-full h-full object-cover opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Без ввода телефона
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Предварительная смета<br />
            <span className="text-accent">за 1 минуту</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Мы покажем итоговую сумму сразу — вводить номер телефона{' '}
            <span className="text-white font-bold">НЕ НУЖНО!</span> Результат открытый, без форм-ловушек.
          </p>
          <a
            href="/quiz"
            className="inline-flex items-center gap-3 bg-accent text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 group"
          >
            <Calculator className="w-5 h-5" />
            Рассчитать стоимость за 4 шага
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Right — cards */}
        <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full lg:w-72">
          {[
            { label: 'Квартира под ключ',   sub: 'от 7 500 ₽/м²',  img: '/quiz/photo/k1.png' },
            { label: 'Санузел',             sub: 'от 175 000 ₽',   img: '/quiz/photo/k2.png' },
            { label: 'Инженерия',           sub: 'от 7 500 ₽/м²',  img: '/quiz/photo/k3.png' },
          ].map(item => (
            <a key={item.label} href="/quiz"
              className="relative overflow-hidden rounded-2xl border border-white/10 h-20 flex items-end group hover:border-accent/50 transition-all">
              <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
              <div className="relative px-4 pb-3">
                <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
                <p className="text-accent text-xs font-bold">{item.sub}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  </section>
);

export default QuizCTA;
