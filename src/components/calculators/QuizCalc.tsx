import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check, Gift, Shield, FileText, Info, ChevronDown } from 'lucide-react';
import { reachGoal } from '../../utils/metrica';

type QuizType = 'apartment' | 'bathroom' | 'engineering';
type RepairType = 'cosmetic' | 'capital' | 'design';
type BuildingType = 'new' | 'old';
type BathroomVariant = 'combined' | 'separate';
type ShowerType = 'standard' | 'tile';
type ToiletType = 'standard' | 'installation';
type PlumbingType = 'base' | 'collector';
type WallType = 'visual' | 'beacons';

const QUIZ_TYPES = [
  { id: 'apartment',   label: 'Квартира',  desc: 'Косметический, капитальный и дизайнерский ремонт', photo: '/quiz/photo/k1.png' },
  { id: 'bathroom',    label: 'Санузел',   desc: 'Детальный расчёт: плитка, сантехника, инсталляция', photo: '/quiz/photo/k2.png' },
  { id: 'engineering', label: 'Инженерия', desc: 'Черновые работы, электрика, надёжная разводка труб', photo: '/quiz/photo/k3.png' },
] as const;

const REPAIR_RATES = {
  cosmetic: { rate: 7500,  label: 'Косметический', sub: 'Обновление отделки без перепланировки' },
  capital:  { rate: 14500, label: 'Капитальный',   sub: 'Замена коммуникаций + стяжка' },
  design:   { rate: 22000, label: 'Дизайнерский',  sub: 'Проект + авторский надзор' },
};

interface WorkItem { id: string; label: string; fixedPrice: number; perM2: number; unit: string; }

const WORK_ITEMS: Record<string, WorkItem[]> = {
  apartment_cosmetic: [
    { id: 'ceilings',     label: 'Натяжные потолки',    fixedPrice: 0,     perM2: 850,  unit: '850 ₽/м²' },
    { id: 'doors',        label: 'Межкомнатные двери',  fixedPrice: 15000, perM2: 0,    unit: 'от 15 000 ₽/шт' },
    { id: 'partial_elec', label: 'Электрика частичная', fixedPrice: 25000, perM2: 0,    unit: 'от 25 000 ₽' },
  ],
  apartment_capital: [
    { id: 'design_proj',  label: 'Дизайн-проект',            fixedPrice: 30000, perM2: 0,    unit: 'от 30 000 ₽' },
    { id: 'warm_floor',   label: 'Тёплый пол (водяной)',     fixedPrice: 0,     perM2: 1500, unit: '1 500 ₽/м²' },
    { id: 'conditioner',  label: 'Кондиционирование',        fixedPrice: 18000, perM2: 0,    unit: '18 000 ₽/точка' },
    { id: 'ceilings',     label: 'Натяжные потолки',         fixedPrice: 0,     perM2: 850,  unit: '850 ₽/м²' },
  ],
  apartment_design: [
    { id: 'supervision',  label: 'Авторский надзор',              fixedPrice: 0,     perM2: 500,  unit: '500 ₽/м²' },
    { id: 'large_tile',   label: 'Крупноформатный керамогранит',  fixedPrice: 0,     perM2: 2500, unit: '2 500 ₽/м²' },
    { id: 'hidden_doors', label: 'Скрытые двери',                fixedPrice: 35000, perM2: 0,    unit: 'от 35 000 ₽' },
    { id: 'smart_home',   label: 'Умный дом (базовый)',           fixedPrice: 45000, perM2: 0,    unit: 'от 45 000 ₽' },
  ],
  bathroom: [
    { id: 'warm_floor_b', label: 'Тёплый пол электрический', fixedPrice: 0,     perM2: 3500, unit: '3 500 ₽/м²' },
    { id: 'ventilation',  label: 'Приточная вентиляция',     fixedPrice: 12000, perM2: 0,    unit: '12 000 ₽' },
    { id: 'smart_bath',   label: 'Умный санузел',            fixedPrice: 20000, perM2: 0,    unit: 'от 20 000 ₽' },
  ],
  engineering: [
    { id: 'heating',     label: 'Теплоснабжение',                  fixedPrice: 35000, perM2: 0, unit: 'от 35 000 ₽' },
    { id: 'ventilation', label: 'Приточно-вытяжная вентиляция',    fixedPrice: 25000, perM2: 0, unit: 'от 25 000 ₽' },
    { id: 'network',     label: 'Слаботочные сети (интернет, ТВ)', fixedPrice: 15000, perM2: 0, unit: '15 000 ₽' },
  ],
};

const INFO_INCLUDES = {
  apartment: {
    title: 'Что входит в стоимость «Под ключ»',
    items: [
      { icon: '🏗', title: 'Подготовка',      desc: 'Демонтаж (для вторички), возведение перегородок, выравнивание стен и пола под лазерный уровень.' },
      { icon: '⚡', title: 'Инженерия',       desc: 'Полная разводка электрики и сантехники, сборка электрощита и коллекторного узла.' },
      { icon: '✨', title: 'Чистовой этап',   desc: 'Укладка ламината/кварцвинила, оклейка обоев или покраска, монтаж плинтусов и розеток.' },
      { icon: '💡', title: 'Потолки и свет',  desc: 'Натяжные потолки во всех комнатах, установка светильников и трековых систем.' },
    ],
  },
  bathroom: {
    title: 'Что включено в санузел «Под ключ»',
    items: [
      { icon: '🔲', title: 'Плиточные работы', desc: 'Укладка керамогранита (2 500 ₽/м²) с запилом 45°, сверлением отверстий и эпоксидной затиркой.' },
      { icon: '🚰', title: 'Водоподготовка',   desc: 'Скрытая разводка труб, установка фильтров, редукторов давления и коллекторного узла.' },
      { icon: '🛡', title: 'Безопасность',     desc: 'Двухслойная гидроизоляция всей площади пола и «мокрых» зон стен — защита от протечек.' },
      { icon: '🚿', title: 'Финиш',            desc: 'Установка ванны/душа, инсталляции, раковины, смесителей, гигиенического душа и мебели.' },
    ],
  },
  engineering: {
    title: 'Фундамент вашего ремонта',
    items: [
      { icon: '🔌', title: 'Электрика',      desc: 'Кабель ВВГнг-LS (не поддерживает горение), защита каждой линии отдельным автоматом и реле напряжения.' },
      { icon: '🚿', title: 'Сантехника',     desc: 'Трубы из сшитого полиэтилена Rehau/Stout. Коллекторная схема исключает перепады напора.' },
      { icon: '📐', title: 'Геометрия',      desc: 'Выведение углов 90° по маякам в зонах установки кухни и ванны. Идеальное примыкание мебели.' },
      { icon: '🛡', title: 'Скрытые работы', desc: 'Обязательная опрессовка систем воздухом, шумоизоляция стояков канализации, контроль ГОСТ.' },
    ],
  },
};

const BONUSES = [
  { id: 'discount',  Icon: Gift,     label: 'Скидка 5%',       unlockedAt: 1 },
  { id: 'guarantee', Icon: Shield,   label: 'Гарантия 3 года', unlockedAt: 2 },
  { id: 'plan',      Icon: FileText, label: 'Тех. план',       unlockedAt: 3 },
];

function fmtPhone(val: string) {
  const digits = val.replace(/\D/g, '');
  let d = (digits.startsWith('8') || digits.startsWith('7')) ? digits.slice(1) : digits;
  d = d.slice(0, 10);
  let r = '+7';
  if (d.length > 0) r += ' (' + d.slice(0, 3);
  if (d.length >= 3) r += ') ' + d.slice(3, 6);
  if (d.length >= 6) r += '-' + d.slice(6, 8);
  if (d.length >= 8) r += '-' + d.slice(8, 10);
  return r;
}

const InfoBlock: React.FC<{ content: (typeof INFO_INCLUDES)[keyof typeof INFO_INCLUDES] }> = ({ content }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-accent hover:bg-slate-50 transition-colors">
        <span className="flex items-center gap-2"><Info className="w-4 h-4" />{content.title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
              {content.items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="font-bold text-slate-800 text-xs mb-1">{item.icon} {item.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuizCalc: React.FC = () => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<QuizType | null>(null);

  const [repairType, setRepairType]     = useState<RepairType>('capital');
  const [area, setArea]                 = useState(50);
  const [buildingType, setBuildingType] = useState<BuildingType>('new');
  const [bathrooms, setBathrooms]       = useState(1);

  const [bathroomVariant, setBathroomVariant] = useState<BathroomVariant>('combined');
  const [bathroomArea, setBathroomArea]       = useState(4);
  const [showerType, setShowerType]           = useState<ShowerType>('standard');
  const [toiletType, setToiletType]           = useState<ToiletType>('installation');

  const [engArea, setEngArea]               = useState(50);
  const [electricPoints, setElectricPoints] = useState(40);
  const [plumbingType, setPlumbingType]     = useState<PlumbingType>('collector');
  const [wallType, setWallType]             = useState<WallType>('beacons');

  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToStep = (s: number) => {
    setStep(s);
    setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };
  const toggleWork = (id: string) => setSelectedWorks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const calcResult = () => {
    let workCost = 0;
    const getWorkItemsFor = (key: string) => WORK_ITEMS[key] ?? [];
    const addExtras = (items: WorkItem[], areaVal: number) => {
      items.forEach(item => {
        if (!selectedWorks.has(item.id)) return;
        workCost += item.fixedPrice + item.perM2 * areaVal;
      });
    };

    if (type === 'apartment') {
      const mult = buildingType === 'old' ? 1.2 : 1;
      workCost = Math.round(area * REPAIR_RATES[repairType].rate * mult + (bathrooms - 1) * 120000);
      addExtras(getWorkItemsFor(`apartment_${repairType}`), area);
      const mat = Math.round(workCost * (repairType === 'cosmetic' ? 0.25 : 0.45));
      return { workCost, mat, total: workCost + mat };
    }
    if (type === 'bathroom') {
      workCost = (bathroomVariant === 'combined' ? 175000 : 210000) + bathroomArea * 22000
        + (showerType === 'tile' ? 45000 : 0) + (toiletType === 'installation' ? 15000 : 0);
      addExtras(getWorkItemsFor('bathroom'), bathroomArea);
      const mat = Math.round(workCost * 0.6);
      return { workCost, mat, total: workCost + mat };
    }
    if (type === 'engineering') {
      workCost = engArea * 7500 + electricPoints * 1500
        + (plumbingType === 'collector' ? 45000 : 20000)
        + (wallType === 'beacons' ? engArea * 950 : engArea * 400);
      addExtras(getWorkItemsFor('engineering'), engArea);
      const mat = Math.round(workCost * 0.7);
      return { workCost, mat, total: workCost + mat };
    }
    return { workCost: 0, mat: 0, total: 0 };
  };

  const result = calcResult();
  const fmt = (n: number) => n.toLocaleString('ru');
  const currentInfo = type ? INFO_INCLUDES[type] : null;
  const workItemsKey = type === 'apartment' ? `apartment_${repairType}` : type ?? '';
  const currentWorkItems = WORK_ITEMS[workItemsKey] ?? [];

  const RateInfo = () => {
    if (!type) return null;
    if (type === 'apartment') return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs space-y-1.5">
        <p className="font-bold text-slate-800 mb-2">Как мы считаем:</p>
        {(Object.entries(REPAIR_RATES) as [RepairType, typeof REPAIR_RATES.cosmetic][]).map(([k, v]) => (
          <p key={k} className={`flex justify-between ${repairType === k ? 'text-accent font-bold' : 'text-slate-500'}`}>
            <span>{v.label}</span><span>от {v.rate.toLocaleString('ru')} ₽/м²</span>
          </p>
        ))}
        <p className="flex justify-between text-slate-500 border-t border-blue-100 pt-1.5"><span>Вторичка</span><span>+20%</span></p>
        <p className="flex justify-between text-slate-500"><span>Доп. санузел</span><span>+120 000 ₽</span></p>
        <p className="flex justify-between text-slate-400"><span>Черновые материалы</span><span>~{repairType === 'cosmetic' ? '25' : '45'}% от работ</span></p>
      </div>
    );
    if (type === 'bathroom') return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs space-y-1.5">
        <p className="font-bold text-slate-800 mb-2">Как мы считаем:</p>
        <p className="flex justify-between text-slate-500"><span>Совмещённый (база)</span><span>от 175 000 ₽</span></p>
        <p className="flex justify-between text-slate-500"><span>Раздельный (база)</span><span>от 210 000 ₽</span></p>
        <p className="flex justify-between text-slate-500"><span>За каждый м² площади</span><span>22 000 ₽/м²</span></p>
        <p className="flex justify-between text-slate-500"><span>Плитка стены / пол</span><span>2 500 ₽/м²</span></p>
        <p className="flex justify-between text-slate-500"><span>Инсталляция унитаза</span><span>+15 000 ₽</span></p>
        <p className="flex justify-between text-slate-500"><span>Душевая из плитки</span><span>+45 000 ₽</span></p>
        <p className="flex justify-between text-slate-400"><span>Материалы и инженерия</span><span>~60% от работ</span></p>
      </div>
    );
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs space-y-1.5">
        <p className="font-bold text-slate-800 mb-2">Как мы считаем:</p>
        <p className="flex justify-between text-slate-500"><span>Черновые работы</span><span>7 500 ₽/м²</span></p>
        <p className="flex justify-between text-slate-500"><span>Монтаж эл. точки</span><span>1 500 ₽/точка</span></p>
        <p className="flex justify-between text-slate-500"><span>Штукатурка по маякам</span><span>950 ₽/м²</span></p>
        <p className="flex justify-between text-slate-500"><span>Штукатурка визуально</span><span>400 ₽/м²</span></p>
        <p className="flex justify-between text-slate-500"><span>Коллекторная разводка</span><span>45 000 ₽</span></p>
        <p className="flex justify-between text-slate-500"><span>Тройниковая разводка</span><span>20 000 ₽</span></p>
        <p className="flex justify-between text-slate-400"><span>Черновые материалы</span><span>~70% от работ</span></p>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!name || phone.length < 16) return;
    setSubmitting(true);
    reachGoal('quiz_lead_captured');
    const typeLabel = QUIZ_TYPES.find(t => t.id === type)?.label ?? '—';
    const works = Array.from(selectedWorks).map(id => currentWorkItems.find(i => i.id === id)?.label ?? id).join(', ');
    const details = type === 'apartment'
      ? `Вид: ${REPAIR_RATES[repairType].label}\nПлощадь: ${area} м²\nЖильё: ${buildingType === 'new' ? 'Новостройка' : 'Вторичка'}\nСанузлы: ${bathrooms}`
      : type === 'bathroom'
      ? `Тип: ${bathroomVariant === 'combined' ? 'Совмещённый' : 'Раздельный'}\nПлощадь: ${bathroomArea} м²\nДуш: ${showerType === 'tile' ? 'Из плитки' : 'Ванна/кабина'}\nУнитаз: ${toiletType === 'installation' ? 'Инсталляция' : 'Напольный'}`
      : `Площадь: ${engArea} м²\nЭлектроточек: ${electricPoints}\nТрубы: ${plumbingType === 'collector' ? 'Коллекторная' : 'Тройниковая'}\nСтены: ${wallType === 'beacons' ? 'По маякам' : 'Визуально'}`;
    const message = `🎯 КВИЗ\nТип: ${typeLabel}\n${details}\nДоп. работы: ${works || 'нет'}\nРаботы: ${fmt(result.workCost)} ₽\nМатериалы: ${fmt(result.mat)} ₽\nИтого: ${fmt(result.total)} ₽`;
    try { await fetch('/lead.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, message }) }); } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 scroll-mt-8">
      <div className="h-1.5 bg-slate-100">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      <div className="flex items-center justify-center gap-0 px-6 pt-5 pb-4 border-b border-slate-50">
        {[1, 2, 3, 4].map(s => (
          <React.Fragment key={s}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${step === s ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110' : step > s ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={`h-0.5 w-8 sm:w-16 transition-all ${step > s ? 'bg-green-400' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="p-5 md:p-8">
        {step >= 2 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-5">
            {BONUSES.map(({ id, Icon, label, unlockedAt }) => (
              <div key={id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                ${unlockedAt <= step ? 'bg-accent/10 text-accent border-accent/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                <Icon className="w-3.5 h-3.5" />{label}
                {unlockedAt <= step && <Check className="w-3 h-3" />}
              </div>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl px-4 py-3 mb-6 text-center">
                <p className="font-bold text-sm md:text-base leading-snug">
                  <span className="text-accent">Предварительная смета за 1 минуту. Результат — сразу.</span>{' '}
                  <span className="text-slate-700">Вводить номер телефона <span className="underline decoration-accent decoration-2 underline-offset-2">НЕ НУЖНО!</span></span>
                </p>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Что ремонтируем?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {QUIZ_TYPES.map(t => (
                  <button key={t.id} onClick={() => { setType(t.id as QuizType); setSelectedWorks(new Set()); reachGoal('quiz_type_selected'); setTimeout(() => goToStep(2), 280); }}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left min-h-[190px] flex flex-col
                      ${type === t.id ? 'border-accent shadow-lg shadow-accent/20' : 'border-slate-100 hover:border-accent/50 hover:shadow-md'}`}>
                    <div className="absolute inset-0 bg-slate-800">
                      <img src={t.photo} alt={t.label} className="w-full h-full object-cover opacity-55" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    </div>
                    <div className="relative mt-auto p-4">
                      <div className="text-white font-bold text-xl">{t.label}</div>
                      <div className="text-white/60 text-xs mt-1 leading-snug">{t.desc}</div>
                    </div>
                    {type === t.id && <div className="absolute top-3 right-3 w-7 h-7 bg-accent rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Параметры объекта</h2>

              {type === 'apartment' && (
                <div className="space-y-6">
                  <div>
                    <label className="font-bold text-slate-700 block mb-3 text-xs uppercase tracking-wider">Вид ремонта</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(Object.entries(REPAIR_RATES) as [RepairType, typeof REPAIR_RATES.cosmetic][]).map(([k, v]) => (
                        <button key={k} onClick={() => setRepairType(k)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[64px]
                            ${repairType === k ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600 hover:border-accent/40'}`}>
                          <div className="font-bold text-sm">{v.label}</div>
                          <div className="text-xs opacity-60 mt-0.5 leading-snug">{v.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Площадь квартиры</label>
                      <span className="text-3xl font-black text-accent">{area} м²</span>
                    </div>
                    <input type="range" min={20} max={150} step={1} value={area} onChange={e => setArea(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>20 м²</span><span>150 м²</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Тип жилья</label>
                      {([['new', 'Новостройка', ''], ['old', 'Вторичка', '+20% (демонтаж)']] as [BuildingType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setBuildingType(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[48px]
                            ${buildingType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          {s && <div className="text-xs opacity-60">{s}</div>}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Санузлы</label>
                      {[1, 2, 3].map(n => (
                        <button key={n} onClick={() => setBathrooms(n)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[48px]
                            ${bathrooms === n ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{n === 3 ? '3+ санузла' : n === 1 ? '1 санузел' : '2 санузла'}</div>
                          {n > 1 && <div className="text-xs opacity-60">+{((n - 1) * 120000).toLocaleString('ru')} ₽</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <RateInfo />
                </div>
              )}

              {type === 'bathroom' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Тип санузла</label>
                      {([['combined', 'Совмещённый', 'от 175 000 ₽'], ['separate', 'Раздельный', 'от 210 000 ₽']] as [BathroomVariant, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setBathroomVariant(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${bathroomVariant === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          <div className="text-xs opacity-60">{s}</div>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Площадь (м²)</label>
                      <input type="number" inputMode="numeric" min={2} max={15} value={bathroomArea}
                        onChange={e => setBathroomArea(Number(e.target.value))}
                        className="w-full text-4xl font-black py-5 px-4 rounded-2xl border-2 border-slate-100 focus:border-accent focus:outline-none bg-slate-50 text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Душевая зона</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([['standard', 'Ванна / Кабина', 'Стандартная установка'], ['tile', 'Из плитки', '+45 000 ₽ (строительное + трап)']] as [ShowerType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setShowerType(v)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[72px]
                            ${showerType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          <div className="text-xs opacity-60 mt-0.5 leading-snug">{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Тип унитаза</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([['standard', 'Напольный', 'Классический вариант'], ['installation', 'Инсталляция', '+15 000 ₽ (подвесной)']] as [ToiletType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setToiletType(v)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[72px]
                            ${toiletType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          <div className="text-xs opacity-60 mt-0.5">{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <RateInfo />
                </div>
              )}

              {type === 'engineering' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Площадь объекта</label>
                      <span className="text-3xl font-black text-accent">{engArea} м²</span>
                    </div>
                    <input type="range" min={20} max={150} step={1} value={engArea} onChange={e => setEngArea(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Точек электрики</label>
                      <span className="text-3xl font-black text-accent">{electricPoints}</span>
                    </div>
                    <input type="range" min={10} max={150} step={5} value={electricPoints} onChange={e => setElectricPoints(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10</span><span>150 точек</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Разводка труб</label>
                      {([['base', 'Тройниковая', 'Последовательная, 20 000 ₽'], ['collector', 'Коллекторная', 'Лучевая надёжная, 45 000 ₽']] as [PlumbingType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setPlumbingType(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${plumbingType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          <div className="text-xs opacity-60 leading-snug">{s}</div>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">Стены</label>
                      {([['visual', 'Визуально', 'Плоские, 400 ₽/м²'], ['beacons', 'По маякам', 'Углы 90°, 950 ₽/м²']] as [WallType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setWallType(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${wallType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <div className="font-bold text-sm">{l}</div>
                          <div className="text-xs opacity-60">{s}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <RateInfo />
                </div>
              )}

              <button onClick={() => goToStep(3)}
                className="w-full mt-6 bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                Далее — состав работ <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Состав работ</h2>
              <p className="text-slate-400 text-sm mb-5">Отметьте дополнительные услуги — цена обновится.</p>

              <div className="bg-slate-900 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Текущая оценка</p>
                  <p className="text-2xl font-black text-white">{fmt(result.total)} <span className="text-accent">₽</span></p>
                </div>
                <div className="text-right text-xs text-white/40 space-y-0.5">
                  <p>Работы: {fmt(result.workCost)} ₽</p>
                  <p>Материалы: {fmt(result.mat)} ₽</p>
                </div>
              </div>

              {currentWorkItems.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Дополнительные услуги</p>
                  <div className="space-y-2">
                    {currentWorkItems.map(item => {
                      const checked = selectedWorks.has(item.id);
                      return (
                        <button key={item.id} onClick={() => toggleWork(item.id)}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 text-left transition-all min-h-[56px]
                            ${checked ? 'border-accent bg-accent/5' : 'border-slate-100 hover:border-slate-200'}`}>
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                            {checked && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`flex-1 text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                          <span className="text-xs text-slate-400 shrink-0">{item.unit}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <RateInfo />
              {currentInfo && <InfoBlock content={currentInfo} />}

              <button onClick={() => { reachGoal('quiz_step3_done'); goToStep(4); }}
                className="w-full mt-6 bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                Показать итоговую стоимость <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <div className="text-center mb-8">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Ориентировочная стоимость</p>
                <div className="text-5xl md:text-7xl font-black text-slate-900 mb-2 tabular-nums">
                  {fmt(result.total)} <span className="text-accent">₽</span>
                </div>
                <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Смета может корректироваться (±10–15%) после выезда мастера с лазерным уровнем и оценки скрытых дефектов.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 mb-5 text-sm space-y-2">
                <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Разбивка сметы</p>
                <div className="flex justify-between text-slate-600"><span>Стоимость работ</span><span className="font-semibold">{fmt(result.workCost)} ₽</span></div>
                <div className="flex justify-between text-slate-600"><span>Черновые материалы</span><span className="font-semibold">{fmt(result.mat)} ₽</span></div>
                <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-2 mt-1 text-base">
                  <span>Итого</span><span className="text-accent">{fmt(result.total)} ₽</span>
                </div>
              </div>

              {currentInfo && <InfoBlock content={currentInfo} />}

              {!submitted ? (
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white mt-6">
                  <h3 className="text-xl font-bold mb-2">Хотите зафиксировать эту цену и забрать бонусы?</h3>
                  <p className="text-white/50 text-sm mb-5">
                    Оставьте номер — за вами закрепятся:{' '}
                    <span className="text-accent font-semibold">Скидка 5%</span>,{' '}
                    <span className="text-accent font-semibold">Гарантия 3 года</span> и{' '}
                    <span className="text-accent font-semibold">Технический план раскладки</span>.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {BONUSES.map(({ id, Icon, label }) => (
                      <div key={id} className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-bold">
                        <Icon className="w-3.5 h-3.5" />{label}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mb-4">
                    <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-4 rounded-xl focus:outline-none focus:border-accent transition-all text-sm" />
                    <input type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(fmtPhone(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-4 rounded-xl focus:outline-none focus:border-accent transition-all text-sm" />
                  </div>
                  <button onClick={handleSubmit} disabled={!name || phone.length < 16 || submitting}
                    className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all disabled:opacity-50 shadow-xl shadow-accent/30">
                    {submitting ? 'Отправляем…' : 'Зафиксировать условия и бонусы'}
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center mt-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Бонусы зафиксированы!</h3>
                  <p className="text-slate-500 text-sm">Мастер наберёт вас в течение <strong>15 минут</strong>.</p>
                </motion.div>
              )}

              <button onClick={() => { setStep(1); setType(null); setSelectedWorks(new Set()); setSubmitted(false); }}
                className="w-full mt-4 text-slate-400 hover:text-accent text-sm font-medium transition-colors py-2">
                ← Пройти расчёт заново
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizCalc;
