import React, { useState } from 'react';
import LeadMagnet from './LeadMagnet';

const GlobalCalc: React.FC = () => {
  const [area, setArea] = useState<number>(50);
  const [buildingType, setBuildingType] = useState<'new' | 'old'>('new');
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [repairType, setRepairType] = useState<'cosmetic' | 'capital' | 'design'>('capital');

  const baseRates = {
    cosmetic: 7500,
    capital: 14500,
    design: 22000
  };

  const buildingMultiplier = buildingType === 'old' ? 1.2 : 1;
  const bathroomExtra = (bathrooms - 1) * 120000;
  
  const totalWorkCost = Math.round((area * baseRates[repairType] * buildingMultiplier) + bathroomExtra);
  const roughMaterialsCost = Math.round(totalWorkCost * (repairType === 'cosmetic' ? 0.25 : 0.45));
  const totalEstimated = totalWorkCost + roughMaterialsCost;

  const pdfData = {
    title: 'СМЕТА: Вся квартира (Глобальный расчет)',
    parameters: [
      ['Площадь', `${area} м²`],
      ['Тип жилья', buildingType === 'new' ? 'Новостройка' : 'Вторичка'],
      ['Кол-во санузлов', bathrooms >= 3 ? '3+' : bathrooms.toString()],
      ['Вид ремонта', repairType === 'cosmetic' ? 'Косметический' : repairType === 'capital' ? 'Капитальный' : 'Дизайнерский']
    ] as [string, string][],
    fileName: `smeta_flat_${area}m2.pdf`
  };

  const costs = [
    { label: 'Стоимость работ', value: totalWorkCost },
    { label: 'Черновые материалы', value: roughMaterialsCost }
  ];

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px]">
      <div className="p-8 lg:w-3/5 space-y-8">
        <div>
          <div className="flex justify-between items-end mb-4">
            <label className="font-bold text-lg text-slate-800">Площадь квартиры</label>
            <div className="text-2xl font-bold text-accent">{area} м²</div>
          </div>
          <input 
            type="range" min="20" max="150" step="1" value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>20 м²</span>
            <span>150 м²</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Тип жилья</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setBuildingType('new')}
                className={`py-3 px-2 rounded-xl border-2 font-semibold transition-all text-sm ${buildingType === 'new' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                Новостройка
              </button>
              <button 
                onClick={() => setBuildingType('old')}
                className={`py-3 px-2 rounded-xl border-2 font-semibold transition-all text-sm ${buildingType === 'old' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                Вторичка
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Санузлы</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <button 
                  key={num}
                  onClick={() => setBathrooms(num)}
                  className={`py-3 rounded-xl border-2 font-semibold transition-all text-sm ${bathrooms === num ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  {num === 3 ? '3+' : num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Вид ремонта</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => setRepairType('cosmetic')}
              className={`p-3 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${repairType === 'cosmetic' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Косметический</span>
              <span className="text-[10px] opacity-70 font-normal leading-tight">Обновление отделки без перепланировки</span>
            </button>
            <button 
              onClick={() => setRepairType('capital')}
              className={`p-3 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${repairType === 'capital' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Капитальный</span>
              <span className="text-[10px] opacity-70 font-normal leading-tight">Замена коммуникаций + стяжка</span>
            </button>
            <button 
              onClick={() => setRepairType('design')}
              className={`p-3 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${repairType === 'design' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Дизайнерский</span>
              <span className="text-[10px] opacity-70 font-normal leading-tight">Проект + авторский надзор</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Как мы считаем:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px] text-slate-600">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Работа (м²):</p>
                <p>Косметика: от 7 500 ₽</p>
                <p>Капитал: от 14 500 ₽</p>
                <p>Дизайн: от 22 000 ₽</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Материалы (м²):</p>
                <p>Черновые: ~4 500 ₽</p>
                <p>Расходники: включены</p>
                <p className="text-accent">Скидка 10% в PDF</p>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <p className="font-bold text-slate-800">Доп. параметры:</p>
                <p>Вторичка: +20% (демонтаж)</p>
                <p>Доп. санузел: +120 000 ₽</p>
                <p>Гарантия: 3 года по договору</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 mt-8">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-full"></span>
            Что входит в стоимость «Под ключ»?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-slate-500 leading-relaxed">
            <div className="flex gap-3">
              <span className="text-accent font-bold">01.</span>
              <p><span className="font-bold text-slate-700">Подготовка:</span> Демонтаж (для вторички), возведение перегородок, выравнивание стен и пола под лазерный уровень.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">02.</span>
              <p><span className="font-bold text-slate-700">Инженерия:</span> Полная разводка электрики и сантехники, сборка электрощита и коллекторного узла.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">03.</span>
              <p><span className="font-bold text-slate-700">Чистовой этап:</span> Укладка ламината/кварцвинила, оклейка обоев или покраска, монтаж плинтусов и розеток.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">04.</span>
              <p><span className="font-bold text-slate-700">Потолки и свет:</span> Натяжные потолки во всех комнатах, установка светильников и трековых систем.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-2/5">
        <LeadMagnet 
          totalEstimated={totalEstimated}
          costs={costs}
          pdfData={pdfData}
        />
      </div>
    </div>
  );
};

export default GlobalCalc;
