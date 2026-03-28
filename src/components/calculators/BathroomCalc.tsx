import React, { useState } from 'react';
import LeadMagnet from './LeadMagnet';

const BathroomCalc: React.FC = () => {
  const [type, setType] = useState<'combined' | 'separate'>('combined');
  const [area, setArea] = useState<number>(4);
  const [showerType, setShowerType] = useState<'standard' | 'tile'>('standard');
  const [toiletType, setToiletType] = useState<'standard' | 'installation'>('installation');

  const baseRate = type === 'combined' ? 175000 : 210000;
  const areaRate = area * 22000;
  const showerExtra = showerType === 'tile' ? 45000 : 0;
  const toiletExtra = toiletType === 'installation' ? 25000 : 0;

  const totalWorkCost = baseRate + areaRate + showerExtra + toiletExtra;
  const materialsCost = Math.round(totalWorkCost * 0.6); // Материалы для санузла дороже
  const totalEstimated = totalWorkCost + materialsCost;

  const pdfData = {
    title: 'СМЕТА: Санузел под ключ',
    parameters: [
      ['Тип санузла', type === 'combined' ? 'Совмещенный' : 'Раздельный'],
      ['Площадь по полу', `${area} м²`],
      ['Душевая зона', showerType === 'standard' ? 'Ванна/кабина' : 'Душевая из плитки'],
      ['Унитаз', toiletType === 'standard' ? 'Напольный' : 'Инсталляция']
    ] as [string, string][],
    fileName: `smeta_bathroom_${area}m2.pdf`
  };

  const costs = [
    { label: 'Сантехнические и отделочные работы', value: totalWorkCost },
    { label: 'Черновые материалы и инженерия', value: materialsCost }
  ];

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px]">
      <div className="p-8 lg:w-3/5 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Тип санузла</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('combined')}
                className={`py-3 px-2 rounded-xl border-2 font-semibold transition-all text-xs ${type === 'combined' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                Совмещенный
              </button>
              <button 
                onClick={() => setType('separate')}
                className={`py-3 px-2 rounded-xl border-2 font-semibold transition-all text-xs ${type === 'separate' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                Раздельный
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Площадь (м²)</label>
            <input 
              type="number" min="2" max="15" value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-100 focus:border-accent focus:outline-none transition-all font-semibold text-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Душевая зона</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowerType('standard')}
              className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${showerType === 'standard' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Ванна / Кабина</span>
              <span className="text-[10px] opacity-70 font-normal">Стандартная установка</span>
            </button>
            <button 
              onClick={() => setShowerType('tile')}
              className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${showerType === 'tile' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Из плитки</span>
              <span className="text-[10px] opacity-70 font-normal">Строительное исполнение + трап</span>
            </button>
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-3 text-sm uppercase tracking-wider">Тип унитаза</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setToiletType('standard')}
              className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${toiletType === 'standard' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Напольный</span>
              <span className="text-[10px] opacity-70 font-normal">Классический вариант</span>
            </button>
            <button 
              onClick={() => setToiletType('installation')}
              className={`p-4 rounded-xl border-2 font-semibold transition-all text-left flex flex-col gap-1 ${toiletType === 'installation' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
            >
              <span className="text-sm">Инсталляция</span>
              <span className="text-[10px] opacity-70 font-normal">Подвесной унитаз (эстетично)</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Базовые расценки на работы:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px] text-slate-600">
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Плитка:</p>
              <p>Стены/пол: 2 500 ₽/м²</p>
              <p>Затирка швов: включена</p>
              <p>Отверстия: включены</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Сантехника:</p>
              <p>Точка воды: 5 500 ₽</p>
              <p>Установка ванны: 8 000 ₽</p>
              <p>Инсталляция: 15 000 ₽</p>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <p className="font-bold text-slate-800">Инженерия:</p>
              <p>Гидроизоляция: 850 ₽/м²</p>
              <p>Трап для душа: 8 000 ₽</p>
              <p>Потолок + свет: в подарок</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 mt-8">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-full"></span>
            Что включено в санузел «Под ключ»?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-slate-500 leading-relaxed">
            <div className="flex gap-3">
              <span className="text-accent font-bold">●</span>
              <p><span className="font-bold text-slate-700">Плиточные работы:</span> Укладка керамогранита (2 500 ₽/м²) с запилом углов под 45°, сверлением отверстий и эпоксидной затиркой.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">●</span>
              <p><span className="font-bold text-slate-700">Водоподготовка:</span> Скрытая разводка труб, установка фильтров, редукторов давления и коллекторного узла.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">●</span>
              <p><span className="font-bold text-slate-700">Безопасность:</span> Двухслойная гидроизоляция всей площади пола и «мокрых» зон стен для защиты от протечек.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">●</span>
              <p><span className="font-bold text-slate-700">Финиш:</span> Установка ванны/душа, инсталляции, раковины, смесителей, гигиенического душа и мебели.</p>
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

export default BathroomCalc;
