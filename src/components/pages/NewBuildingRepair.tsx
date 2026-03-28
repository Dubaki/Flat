import React from 'react';
import { Paintbrush, Hammer, Layout, Wrench, ArrowRight } from 'lucide-react';

const NewBuildingRepair = () => {
  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/Flat/" className="text-accent hover:underline text-sm font-medium flex items-center gap-2 transition-all hover:gap-3">
            ← На главную
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 font-serif">
              Ремонт квартир в новостройках
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Комплексный ремонт квартир с нуля. Возводим перегородки, делаем разводку электрики и сантехники, выравниваем стены по маякам и выполняем чистовую отделку.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
                <div className="text-sm text-slate-500 mb-1">Стоимость</div>
                <div className="text-xl sm:text-2xl font-bold text-accent whitespace-nowrap">от 12 000 ₽/м²</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
                <div className="text-sm text-slate-500 mb-1">Сроки</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-800">от 30 дней</div>
              </div>
            </div>
            <a href="/Flat/calculator" className="inline-block bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20">
              Рассчитать стоимость
            </a>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000" 
              alt="Ремонт новостройки Екатеринбург" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center font-serif text-slate-900">Этапы ремонта новостройки</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Планировка', desc: 'Возведение межкомнатных перегородок из ПГП, газоблока или гипсокартона.' },
            { title: 'Инженерные сети', desc: 'Прокладка кабеля, сборка электрощита, разводка труб водоснабжения и канализации.' },
            { title: 'Черновая отделка', desc: 'Штукатурка стен по маякам, заливка стяжки пола, шумоизоляция.' },
            { title: 'Предчистовая отделка', desc: 'Шпаклевка стен под обои или покраску, монтаж подоконников.' },
            { title: 'Чистовая отделка', desc: 'Укладка плитки, ламината, поклейка обоев, монтаж натяжных потолков.' },
            { title: 'Финальный этап', desc: 'Установка розеток, выключателей, светильников, санфаянса и плинтусов.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold mb-4 font-sans text-sm">
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewBuildingRepair;
