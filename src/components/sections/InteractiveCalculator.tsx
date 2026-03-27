import React, { useState } from 'react';

const InteractiveCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(50);
  const [buildingType, setBuildingType] = useState<'new' | 'old'>('new');
  const [repairType, setRepairType] = useState<'cosmetic' | 'capital' | 'designer'>('capital');
  
  // Base rates for Yekaterinburg 2024-2026
  const rates = {
    cosmetic: 4500,
    capital: 9500,
    designer: 15000
  };

  // Secondary housing requires dismantling (+20% to work cost)
  const buildingMultiplier = buildingType === 'old' ? 1.2 : 1;
  
  // Calculations
  const baseWorkCost = area * rates[repairType];
  const totalWorkCost = Math.round(baseWorkCost * buildingMultiplier);
  
  // Rough materials (черновые материалы) are usually ~40-50% of work cost for capital/designer, less for cosmetic
  const roughMaterialRatio = repairType === 'cosmetic' ? 0.2 : 0.45;
  const roughMaterialsCost = Math.round(totalWorkCost * roughMaterialRatio);
  
  const totalEstimated = totalWorkCost + roughMaterialsCost;

  return (
    <section id="calculator" className="section-padding bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Калькулятор ремонта</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Рассчитайте ориентировочную стоимость ремонта вашей квартиры в Екатеринбурге. Точная смета составляется после бесплатного выезда замерщика.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Inputs */}
          <div className="p-6 md:p-8 lg:p-12 lg:w-3/5 space-y-8 lg:space-y-10">
            
            {/* Area Slider */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-lg text-slate-800">Площадь квартиры</label>
                <div className="text-2xl font-bold text-accent">{area} м²</div>
              </div>
              <input 
                type="range" 
                min="20" 
                max="150" 
                step="1"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>20 м²</span>
                <span>150 м²</span>
              </div>
            </div>

            {/* Building Type */}
            <div>
              <label className="font-bold text-lg text-slate-800 block mb-4">Тип жилья</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setBuildingType('new')}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${buildingType === 'new' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Новостройка
                </button>
                <button 
                  onClick={() => setBuildingType('old')}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all flex flex-col items-center justify-center ${buildingType === 'old' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <span>Вторичка</span>
                  <span className="text-xs font-normal opacity-70 mt-1">+ демонтаж</span>
                </button>
              </div>
            </div>

            {/* Repair Type */}
            <div>
              <label className="font-bold text-lg text-slate-800 block mb-4">Вид ремонта</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setRepairType('cosmetic')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'cosmetic' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Косметический
                </button>
                <button 
                  onClick={() => setRepairType('capital')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'capital' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Капитальный
                </button>
                <button 
                  onClick={() => setRepairType('designer')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'designer' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Дизайнерский
                </button>
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="bg-primary text-white p-6 md:p-8 lg:p-12 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Предварительный расчет</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 gap-4">
                  <span className="text-white/70 min-w-0 break-words">Стоимость работ:</span>
                  <span className="font-bold text-lg shrink-0 whitespace-nowrap">{totalWorkCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4 gap-4">
                  <span className="text-white/70 min-w-0 break-words">Черновые материалы:</span>
                  <span className="font-bold text-lg shrink-0 whitespace-nowrap">{roughMaterialsCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center pb-4 gap-4">
                  <span className="text-white/70 text-sm min-w-0 break-words">Чистовые материалы (обои, плитка, ламинат):</span>
                  <span className="font-medium text-sm text-accent text-right shrink-0">Покупаются отдельно<br/>под ваш вкус</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-white/70 mb-2">Итого (работа + черновые мат-лы):</div>
                <div className="text-3xl sm:text-4xl font-bold text-accent whitespace-nowrap">
                  ~ {totalEstimated.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            <button className="w-full bg-accent text-white py-5 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 relative z-10">
              Вызвать замерщика бесплатно
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCalculator;
