import React, { useState } from 'react';
import GlobalCalc from '../calculators/GlobalCalc';
import BathroomCalc from '../calculators/BathroomCalc';
import RoughCalc from '../calculators/RoughCalc';
import { Home, Bath, Drill } from 'lucide-react';
import { reachGoal } from '../../utils/metrica';

const CalculatorHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'bathroom' | 'rough' | null>(null);

  const tabs = [
    { 
      id: 'global', 
      label: 'Вся квартира', 
      icon: Home, 
      description: 'Расчет бюджета на капитальный или дизайнерский ремонт всей площади.',
      tag: 'Популярно'
    },
    { 
      id: 'bathroom', 
      label: 'Санузел под ключ', 
      icon: Bath, 
      description: 'Детальный расчет самого сложного узла: плитка, сантехника, инсталляция.',
      tag: 'Точно'
    },
    { 
      id: 'rough', 
      label: 'Инженерия', 
      icon: Drill, 
      description: 'Черновые работы, электрика по ГОСТу и надежная разводка труб.',
      tag: 'Экспертно'
    },
  ] as const;

  return (
    <section id="calculator" className="section-padding bg-slate-50 w-full min-h-[400px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {activeTab ? 'Ваш расчет' : 'Выберите тип расчета'}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {activeTab 
              ? 'Вы можете переключиться на другой тип калькулятора в любой момент.' 
              : 'Три специализированных инструмента для точной оценки вашего будущего ремонта в Екатеринбурге.'
            }
          </p>
        </div>

        {/* Selection Cards / Tabs */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${activeTab ? 'mb-12' : 'mb-20'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reachGoal(`calc_${tab.id}_opened`);
                }}
                className={`group relative flex flex-col items-start p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 text-left ${
                  isActive 
                    ? 'border-accent bg-white shadow-xl ring-4 ring-accent/5 translate-y-[-4px]' 
                    : 'border-white bg-white/50 hover:bg-white hover:shadow-lg hover:border-slate-200'
                }`}
              >
                {tab.tag && !activeTab && (
                  <span className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider">
                    {tab.tag}
                  </span>
                )}
                <div className={`p-4 rounded-2xl mb-6 transition-colors ${isActive ? 'bg-accent text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-accent/10 group-hover:text-accent'}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                  {tab.label}
                </h3>
                <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                  {tab.description}
                </p>
                
                {isActive && (
                  <div className="mt-6 flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest animate-pulse">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Активен
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Calculator Content */}
        {activeTab ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            {activeTab === 'global' && <GlobalCalc />}
            {activeTab === 'bathroom' && <BathroomCalc />}
            {activeTab === 'rough' && <RoughCalc />}
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => {
                  setActiveTab(null);
                  window.scrollTo({ top: document.getElementById('calculator')?.offsetTop || 0, behavior: 'smooth' });
                }}
                className="text-slate-400 hover:text-accent text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                ← Вернуться к выбору типа расчета
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-bounce opacity-20">
            <p className="text-4xl">↓</p>
          </div>
        )}

        <div className="mt-16 text-center text-slate-400 text-[11px] uppercase tracking-widest">
          <p>Цены актуальны на 2026 год • Екатеринбург и Свердловская область</p>
        </div>
      </div>
    </section>
  );
};

export default CalculatorHub;
