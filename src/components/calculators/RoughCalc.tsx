import React, { useState } from 'react';
import LeadMagnet from './LeadMagnet';
import { reachGoal } from '../../utils/metrica';

const RoughCalc: React.FC = () => {
  const [area, setArea] = useState<number>(50);
  const [electricPoints, setElectricPoints] = useState<number>(40);
  const [plumbingType, setPlumbingType] = useState<'base' | 'collector'>('collector');
  const [wallType, setWallType] = useState<'visual' | 'beacons'>('beacons');
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleInteraction = () => {
    if (!hasInteracted) {
      reachGoal('calc_interacted');
      setHasInteracted(true);
    }
  };

  const roughWorkRate = 7500;
  const electricRate = electricPoints * 1500;
  const plumbingExtra = plumbingType === 'collector' ? 45000 : 20000;
  const wallsExtra = wallType === 'beacons' ? area * 950 : area * 400;

  const totalWorkCost = (area * roughWorkRate) + electricRate + plumbingExtra + wallsExtra;
  const materialsCost = Math.round(totalWorkCost * 0.7); // Черновые материалы дорогие на этом этапе
  const totalEstimated = totalWorkCost + materialsCost;

  const pdfData = {
    title: 'СМЕТА: Черновые работы и Инженерия',
    parameters: [
      ['Площадь по полу', `${area} м²`],
      ['Точек электрики', electricPoints.toString()],
      ['Разводка труб', plumbingType === 'base' ? 'Тройниковая (базовая)' : 'Коллекторная (надежная)'],
      ['Выравнивание стен', wallType === 'visual' ? 'Визуальное' : 'По маякам (углы 90°)']
    ] as [string, string][],
    fileName: `smeta_rough_${area}m2.pdf`
  };

  const costs = [
    { label: 'Черновые и инженерные работы', value: totalWorkCost },
    { label: 'Строительные материалы (черновые)', value: materialsCost }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Top Section: Inputs & Calculation */}
      <div className="flex flex-col lg:flex-row border-b border-slate-50">
        <div className="p-6 md:p-8 lg:w-[65%] space-y-8 lg:border-r border-slate-50">
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="font-bold text-lg text-slate-800">Площадь объекта</label>
              <div className="text-2xl font-bold text-accent">{area} м²</div>
            </div>
            <input 
              type="range" min="20" max="150" step="1" value={area}
              onChange={(e) => {
                setArea(Number(e.target.value));
                handleInteraction();
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="font-bold text-lg text-slate-800">Точек электрики</label>
              <div className="text-2xl font-bold text-accent">{electricPoints}</div>
            </div>
            <input 
              type="range" min="10" max="150" step="5" value={electricPoints}
              onChange={(e) => {
                setElectricPoints(Number(e.target.value));
                handleInteraction();
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Разводка труб</label>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setPlumbingType('base');
                    handleInteraction();
                  }}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${plumbingType === 'base' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <span className="text-sm">Тройниковая</span>
                  <span className="text-[10px] opacity-70 font-normal text-slate-400 text-balance">Последовательная (базовая)</span>
                </button>
                <button 
                  onClick={() => {
                    setPlumbingType('collector');
                    handleInteraction();
                  }}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${plumbingType === 'collector' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <span className="text-sm">Коллекторная</span>
                  <span className="text-[10px] opacity-70 font-normal text-slate-400 text-balance">Лучевая (надежная, с опрессовкой)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Стены</label>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setWallType('visual');
                    handleInteraction();
                  }}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${wallType === 'visual' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <span className="text-sm">Визуально</span>
                  <span className="text-[10px] opacity-70 font-normal text-slate-400 text-balance">Плоские стены без геометрии</span>
                </button>
                <button 
                  onClick={() => {
                    setWallType('beacons');
                    handleInteraction();
                  }}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${wallType === 'beacons' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <span className="text-sm">По маякам</span>
                  <span className="text-[10px] opacity-70 font-normal text-slate-400 text-balance">Углы 90° под мебель и ванну</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[35%]">
          <LeadMagnet 
            totalEstimated={totalEstimated}
            costs={costs}
            pdfData={pdfData}
          />
        </div>
      </div>

      {/* Bottom Section: Information (Full Width) */}
      <div className="p-6 md:p-8 space-y-10 bg-slate-50/30">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-slate-200"></span>
            Единичные расценки 2026
            <span className="w-8 h-[1px] bg-slate-200"></span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-xs text-slate-600">
            <div className="space-y-2">
              <p className="font-bold text-slate-800 uppercase tracking-tight text-[10px]">Электрика</p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Монтаж точки <span>1 500 ₽</span></p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Сборка щита <span>от 20 000 ₽</span></p>
              <p className="text-[10px] text-slate-400 italic">Штробление включено в стоимость</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-800 uppercase tracking-tight text-[10px]">Стены и Пол</p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Штукатурка <span>950 ₽/м²</span></p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Стяжка пола <span>1 300 ₽/м²</span></p>
              <p className="text-[10px] text-slate-400 italic">Маяки и грунтовка включены</p>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <p className="font-bold text-slate-800 uppercase tracking-tight text-[10px]">Сантехника</p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Разводка труб <span>от 15 000 ₽</span></p>
              <p className="flex justify-between border-b border-slate-100 pb-1">Опрессовка <span>0 ₽</span></p>
              <p className="text-[10px] text-slate-400 italic">Шумоизоляция стояка в подарок</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-10">
          <h4 className="font-bold text-slate-800 mb-8 flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
            <span className="w-2 h-2 bg-accent rotate-45"></span>
            Фундамент вашего ремонта
            <span className="w-2 h-2 bg-accent rotate-45"></span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[11px] text-slate-500 leading-normal">
            <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <span className="text-xl">🔌</span> Электрика
              </p>
              <p>Кабель ВВГнг-LS (не поддерживает горение), защита каждой линии отдельным автоматом и реле напряжения в щите.</p>
            </div>
            <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <span className="text-xl">🚿</span> Сантехника
              </p>
              <p>Трубы из сшитого полиэтилена Rehau/Stout. Коллекторная схема исключает перепады напора и температуры.</p>
            </div>
            <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <span className="text-xl">📐</span> Геометрия
              </p>
              <p>Выведение углов 90° по маякам в зонах установки кухни и ванны. Идеальное примыкание мебели без щелей.</p>
            </div>
            <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <span className="text-xl">🛡</span> Скрытые работы
              </p>
              <p>Обязательная опрессовка систем воздухом, шумоизоляция стояков канализации и контроль соблюдения ГОСТ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoughCalc;
