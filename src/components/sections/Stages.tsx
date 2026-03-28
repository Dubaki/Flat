import React from 'react';
import { Hammer, Zap, Ruler, Droplets, Paintbrush, Sofa, CheckCircle2, Star } from 'lucide-react';

const Stages: React.FC = () => {
  const stages = [
    {
      title: 'Демонтаж и перегородки',
      icon: Hammer,
      items: [
        { name: 'Снос старых конструкций', price: 'от 450 ₽/м²' },
        { name: 'Вывоз мусора', price: 'от 6000 ₽/рейс' },
        { name: 'Возведение новых стен', price: 'от 1200 ₽/м²' }
      ]
    },
    {
      title: 'Инженерные сети',
      icon: Zap,
      items: [
        { name: 'Штробление стен', price: 'от 450 ₽/п.м.' },
        { name: 'Прокладка электрокабеля', price: 'от 200 ₽/п.м.' },
        { name: 'Разводка труб (черновая)', price: 'от 4500 ₽/точка' },
        { name: 'Сборка электрощита', price: 'от 20000 ₽' }
      ]
    },
    {
      title: 'Черновая отделка',
      icon: Ruler,
      items: [
        { name: 'Штукатурка стен по маякам', price: 'от 950 ₽/м²' },
        { name: 'Заливка стяжки пола', price: 'от 1300 ₽/м²' },
        { name: 'Монтаж теплого пола', price: 'от 900 ₽/м²' },
        { name: 'Шумоизоляция', price: 'от 1100 ₽/м²' }
      ]
    },
    {
      title: 'Предчистовая (White Box)',
      icon: Droplets,
      items: [
        { name: 'Шпаклевка стен под обои', price: 'от 550 ₽/м²' },
        { name: 'Монтаж гипсокартона', price: 'от 1100 ₽/м²' },
        { name: 'Установка подоконников', price: 'от 2500 ₽/шт' }
      ]
    },
    {
      title: 'Чистовая отделка',
      icon: Paintbrush,
      items: [
        { name: 'Укладка керамогранита', price: 'от 2500 ₽/м²' },
        { name: 'Настил ламината', price: 'от 550 ₽/м²' },
        { name: 'Поклейка обоев', price: 'от 450 ₽/м²' },
        { name: 'Натяжные потолки', price: 'от 850 ₽/м²' }
      ]
    },
    {
      title: 'Завершение',
      icon: Sofa,
      items: [
        { name: 'Установка розеток', price: 'от 450 ₽/шт' },
        { name: 'Монтаж санфаянса', price: 'от 3500 ₽/шт' },
        { name: 'Установка плинтусов', price: 'от 350 ₽/п.м.' },
        { name: 'Финальная уборка', price: 'бесплатно' }
      ]
    }
  ];

  return (
    <section id="stages" className="section-padding bg-white w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Детальная разбивка работ</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ремонт — это строгий технологический процесс. Мы соблюдаем последовательность этапов для гарантии долговечности.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stages.map((stage, idx) => (
            <div key={idx} className="relative pl-8 md:pl-0">
              {/* Mobile timeline line */}
              {idx !== stages.length - 1 && (
                <div className="absolute left-[11px] top-10 bottom-[-2rem] w-[2px] bg-slate-100 md:hidden"></div>
              )}
              
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 h-full relative z-10">
                <div className="absolute -left-4 md:-left-4 top-6 md:top-8 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg md:hidden">
                  {idx + 1}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="hidden md:flex w-10 h-10 bg-accent text-white rounded-full items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <stage.icon className="text-accent w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{stage.title}</h3>
                </div>
                
                <ul className="space-y-4">
                  {stage.items.map((item, i) => (
                    <li key={i} className="flex items-start justify-between gap-2 text-sm">
                      <div className="flex items-start gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5 shrink-0"></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Price Factors Note */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <Star className="text-accent w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3">От чего зависит итоговая стоимость?</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Указанные цены являются базовыми за работу. Итоговая стоимость ремонта рассчитывается индивидуально и может меняться в зависимости от нескольких факторов:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                {[
                  'Общий объем работ (на больших площадях цена за м² ниже)',
                  'Сложность геометрии (эркеры, ниши, многоуровневые конструкции)',
                  'Состояние стен и пола (перепады, требующие доп. выравнивания)',
                  'Выбранные чистовые материалы (крупный формат плитки и т.д.)',
                  'Удаленность объекта от Екатеринбурга',
                  'Срочность выполнения работ'
                ].map((factor, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stages;
