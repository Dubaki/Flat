import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Gift, Shield, FileText, Info, ChevronDown, Plus, Minus } from 'lucide-react';
import { reachGoal } from '../../utils/metrica';

type QuizType = 'apartment' | 'bathroom' | 'engineering';
type RepairType = 'cosmetic' | 'capital' | 'design';
type BuildingType = 'new' | 'old';
type BathroomVariant = 'combined' | 'separate';
type ShowerType = 'standard' | 'tile';
type ToiletType = 'standard' | 'installation';
type PlumbingType = 'base' | 'collector';
type WallType = 'visual' | 'beacons';

// ── Work items with optional quantity ─────────────────
interface WorkItem {
  id: string;
  label: string;
  unitPrice: number;
  unit: string;
  hasQty: boolean;
  defaultQty: (area: number) => number;
}

const WORK_ITEMS: Record<string, WorkItem[]> = {
  apartment_cosmetic: [
    { id: 'garbage',   label: 'Вывоз строит. мусора',       unitPrice: 5000,  unit: 'кузов', hasQty: true,  defaultQty: () => 2 },
    { id: 'ceilings',  label: 'Натяжные потолки',            unitPrice: 850,   unit: 'м²',   hasQty: true,  defaultQty: a => a },
    { id: 'doors',     label: 'Установка дверей',            unitPrice: 3500,  unit: 'шт',   hasQty: true,  defaultQty: () => 3 },
    { id: 'sockets',   label: 'Замена розеток/выкл.',        unitPrice: 500,   unit: 'точка', hasQty: true, defaultQty: () => 10 },
    { id: 'balcony',   label: 'Балконное остекление',        unitPrice: 45000, unit: '',      hasQty: false, defaultQty: () => 1 },
  ],
  apartment_capital: [
    { id: 'garbage',   label: 'Вывоз строит. мусора',        unitPrice: 5000,  unit: 'кузов', hasQty: true,  defaultQty: () => 3 },
    { id: 'ceilings',  label: 'Натяжные потолки',             unitPrice: 850,   unit: 'м²',   hasQty: true,  defaultQty: a => a },
    { id: 'warm_floor',label: 'Тёплый пол (водяной)',         unitPrice: 1500,  unit: 'м²',   hasQty: true,  defaultQty: a => Math.round(a * 0.5) },
    { id: 'conditioner',label: 'Кондиционеры',                unitPrice: 18000, unit: 'шт',   hasQty: true,  defaultQty: () => 2 },
    { id: 'doors',     label: 'Установка дверей',             unitPrice: 3500,  unit: 'шт',   hasQty: true,  defaultQty: () => 4 },
    { id: 'design',    label: 'Дизайн-проект',                unitPrice: 30000, unit: '',      hasQty: false, defaultQty: () => 1 },
  ],
  apartment_design: [
    { id: 'garbage',   label: 'Вывоз строит. мусора',        unitPrice: 5000,  unit: 'кузов', hasQty: true,  defaultQty: () => 3 },
    { id: 'supervision',label: 'Авторский надзор',            unitPrice: 500,   unit: 'м²',   hasQty: true,  defaultQty: a => a },
    { id: 'large_tile',label: 'Крупноформатный керамогранит', unitPrice: 2500,  unit: 'м²',   hasQty: true,  defaultQty: a => Math.round(a * 0.3) },
    { id: 'hidden_doors',label: 'Скрытые двери',             unitPrice: 35000, unit: 'шт',   hasQty: true,  defaultQty: () => 2 },
    { id: 'smart_home',label: 'Умный дом (базовый)',          unitPrice: 45000, unit: '',      hasQty: false, defaultQty: () => 1 },
    { id: 'ceilings',  label: 'Натяжные потолки',             unitPrice: 850,   unit: 'м²',   hasQty: true,  defaultQty: a => a },
  ],
  bathroom: [
    { id: 'warm_floor_b',label: 'Тёплый пол электрический',  unitPrice: 3500,  unit: 'м²',   hasQty: true,  defaultQty: a => a },
    { id: 'ventilation', label: 'Приточная вентиляция',       unitPrice: 12000, unit: '',      hasQty: false, defaultQty: () => 1 },
    { id: 'smart_bath',  label: 'Умный санузел',              unitPrice: 20000, unit: '',      hasQty: false, defaultQty: () => 1 },
    { id: 'extra_sockets',label: 'Доп. розетки (с/у)',       unitPrice: 2500,  unit: 'шт',   hasQty: true,  defaultQty: () => 2 },
  ],
  engineering: [
    { id: 'heating',   label: 'Теплоснабжение',               unitPrice: 35000, unit: '',      hasQty: false, defaultQty: () => 1 },
    { id: 'ventilation',label: 'Приточно-вытяжная вентиляция',unitPrice: 25000, unit: '',      hasQty: false, defaultQty: () => 1 },
    { id: 'network',   label: 'Слаботочные сети (интернет, ТВ)', unitPrice: 15000, unit: '',  hasQty: false, defaultQty: () => 1 },
    { id: 'extra_elec',label: 'Доп. точки электрики',         unitPrice: 1500,  unit: 'шт',   hasQty: true,  defaultQty: () => 10 },
  ],
};

// ── Info content ────────────────────────────────────────
const INFO_INCLUDES = {
  apartment: {
    title: 'Что входит в стоимость «Под ключ»',
    items: [
      { icon: '🏗', title: 'Подготовка',     desc: 'Демонтаж (вторичка), перегородки, выравнивание под лазерный уровень.' },
      { icon: '⚡', title: 'Инженерия',      desc: 'Полная разводка электрики и сантехники, сборка щита и коллектора.' },
      { icon: '✨', title: 'Чистовой этап',  desc: 'Ламинат/кварцвинил, обои или покраска, плинтусы и розетки.' },
      { icon: '💡', title: 'Потолки и свет', desc: 'Натяжные потолки, светильники и трековые системы.' },
    ],
  },
  bathroom: {
    title: 'Что включено в санузел «Под ключ»',
    items: [
      { icon: '🔲', title: 'Плитка',         desc: 'Керамогранит (2 500 ₽/м²), запил 45°, эпоксидная затирка.' },
      { icon: '🚰', title: 'Водоподготовка', desc: 'Скрытая разводка, фильтры, редукторы, коллекторный узел.' },
      { icon: '🛡', title: 'Гидроизоляция',  desc: 'Двухслойная — пол и мокрые зоны стен.' },
      { icon: '🚿', title: 'Финиш',          desc: 'Ванна/душ, инсталляция, раковина, смесители, гигдуш.' },
    ],
  },
  engineering: {
    title: 'Фундамент вашего ремонта',
    items: [
      { icon: '🔌', title: 'Электрика',      desc: 'Кабель ВВГнг-LS, автомат и реле напряжения на каждую линию.' },
      { icon: '🚿', title: 'Сантехника',     desc: 'Трубы Rehau/Stout, коллекторная схема без перепадов напора.' },
      { icon: '📐', title: 'Геометрия',      desc: 'Углы 90° по маякам под кухню и ванну.' },
      { icon: '🛡', title: 'Скрытые работы', desc: 'Опрессовка систем, шумоизоляция стояков, контроль ГОСТ.' },
    ],
  },
};

const REPAIR_RATES = {
  cosmetic: { rate: 7500,  label: 'Косметический', sub: 'Обновление отделки без перепланировки' },
  capital:  { rate: 14500, label: 'Капитальный',   sub: 'Замена коммуникаций + стяжка' },
  design:   { rate: 22000, label: 'Дизайнерский',  sub: 'Проект + авторский надзор' },
};

const QUIZ_TYPES = [
  { id: 'apartment',   label: 'Квартира',  desc: 'Косметический, капитальный или дизайнерский', photo: '/quiz/photo/k1.png' },
  { id: 'bathroom',    label: 'Санузел',   desc: 'Плитка, сантехника, инсталляция под ключ',    photo: '/quiz/photo/k2.png' },
  { id: 'engineering', label: 'Инженерия', desc: 'Электрика, сантехника, черновые работы',       photo: '/quiz/photo/k3.png' },
] as const;

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

// ── Spoiler block ────────────────────────────────────────
const Spoiler: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
          <Info className="w-4 h-4 text-accent shrink-0" />{title}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="p-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Qty stepper ──────────────────────────────────────────
const QtyStepper: React.FC<{ value: number; unit: string; onChange: (v: number) => void }> = ({ value, unit, onChange }) => (
  <div className="flex items-center gap-2 mt-2 ml-10">
    <button onClick={() => onChange(Math.max(1, value - 1))}
      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
      <Minus className="w-3.5 h-3.5 text-slate-600" />
    </button>
    <input type="number" value={value}
      onChange={e => onChange(Math.max(1, Number(e.target.value)))}
      className="w-16 text-center font-bold text-sm border-2 border-slate-100 rounded-xl py-1 focus:outline-none focus:border-accent"
      min={1} />
    <span className="text-xs text-slate-400 font-medium">{unit}</span>
    <button onClick={() => onChange(value + 1)}
      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
      <Plus className="w-3.5 h-3.5 text-slate-600" />
    </button>
  </div>
);

// ── Main component ────────────────────────────────────────
const QuizCalc: React.FC = () => {
  const [step, setStep]       = useState(1);
  const [subStep, setSubStep] = useState(0); // for apartment step 2
  const [type, setType]       = useState<QuizType | null>(null);

  // Apartment
  const [repairType, setRepairType]     = useState<RepairType>('capital');
  const [area, setArea]                 = useState(50);
  const [buildingType, setBuildingType] = useState<BuildingType>('new');
  const [bathrooms, setBathrooms]       = useState(1);

  // Bathroom
  const [bathroomVariant, setBathroomVariant] = useState<BathroomVariant>('combined');
  const [bathroomArea, setBathroomArea]       = useState(4);
  const [showerType, setShowerType]           = useState<ShowerType>('standard');
  const [toiletType, setToiletType]           = useState<ToiletType>('installation');

  // Engineering
  const [engArea, setEngArea]               = useState(50);
  const [electricPoints, setElectricPoints] = useState(40);
  const [plumbingType, setPlumbingType]     = useState<PlumbingType>('collector');
  const [wallType, setWallType]             = useState<WallType>('beacons');

  // Works + quantities
  const [selectedWorks, setSelectedWorks]   = useState<Set<string>>(new Set());
  const [quantities, setQuantities]         = useState<Record<string, number>>({});

  // Lead
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollUp = () => setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

  const goToStep = (s: number, sub = 0) => { setStep(s); setSubStep(sub); scrollUp(); };

  const toggleWork = (id: string, defaultQtyVal: number) => {
    setSelectedWorks(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else {
        n.add(id);
        if (!quantities[id]) setQuantities(q => ({ ...q, [id]: defaultQtyVal }));
      }
      return n;
    });
  };

  const setQty = (id: string, val: number) => setQuantities(q => ({ ...q, [id]: Math.max(1, val) }));

  // ── Active area for calculations ──
  const activeArea = type === 'bathroom' ? bathroomArea : type === 'engineering' ? engArea : area;

  const workItemsKey = type === 'apartment' ? `apartment_${repairType}` : type ?? '';
  const currentItems = WORK_ITEMS[workItemsKey] ?? [];

  // ── Pricing ──────────────────────────────────────────────
  const calcResult = () => {
    let work = 0;
    if (type === 'apartment') {
      work = Math.round(area * REPAIR_RATES[repairType].rate * (buildingType === 'old' ? 1.2 : 1) + (bathrooms - 1) * 120000);
    } else if (type === 'bathroom') {
      work = (bathroomVariant === 'combined' ? 175000 : 210000) + bathroomArea * 22000
        + (showerType === 'tile' ? 45000 : 0) + (toiletType === 'installation' ? 15000 : 0);
    } else if (type === 'engineering') {
      work = engArea * 7500 + electricPoints * 1500
        + (plumbingType === 'collector' ? 45000 : 20000)
        + (wallType === 'beacons' ? engArea * 950 : engArea * 400);
    }
    currentItems.forEach(item => {
      if (!selectedWorks.has(item.id)) return;
      const qty = quantities[item.id] ?? item.defaultQty(activeArea);
      work += item.unitPrice * (item.hasQty ? qty : 1);
    });
    const matRate = type === 'apartment' && repairType === 'cosmetic' ? 0.25 : type === 'engineering' ? 0.7 : type === 'bathroom' ? 0.6 : 0.45;
    const mat = Math.round(work * matRate);
    return { work, mat, total: work + mat };
  };

  const result = calcResult();
  const fmt = (n: number) => n.toLocaleString('ru');

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name || phone.length < 16) return;
    setSubmitting(true);
    reachGoal('quiz_lead_captured');
    const worksList = Array.from(selectedWorks).map(id => {
      const item = currentItems.find(i => i.id === id);
      if (!item) return id;
      const qty = quantities[id] ?? item.defaultQty(activeArea);
      return item.hasQty ? `${item.label}: ${qty} ${item.unit}` : item.label;
    }).join('; ');
    const params = type === 'apartment'
      ? `${REPAIR_RATES[repairType].label} | ${area} м² | ${buildingType === 'new' ? 'Новостройка' : 'Вторичка'} | ${bathrooms} санузл.`
      : type === 'bathroom'
      ? `${bathroomVariant === 'combined' ? 'Совмещённый' : 'Раздельный'} | ${bathroomArea} м² | Душ: ${showerType === 'tile' ? 'из плитки' : 'ванна/кабина'} | ${toiletType === 'installation' ? 'инсталляция' : 'напольный'}`
      : `${engArea} м² | ${electricPoints} точек | ${plumbingType === 'collector' ? 'коллектор' : 'тройник'} | стены ${wallType === 'beacons' ? 'по маякам' : 'визуально'}`;
    const message = `🎯 КВИЗ — ${QUIZ_TYPES.find(t => t.id === type)?.label}\n${params}\nДоп: ${worksList || 'нет'}\nРаботы: ${fmt(result.work)} ₽ | Материалы: ${fmt(result.mat)} ₽ | Итого: ${fmt(result.total)} ₽`;
    try { await fetch('/lead.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, message }) }); } catch {}
    setSubmitted(true); setSubmitting(false);
  };

  // ── Rate spoiler content ──────────────────────────────────
  const RateRows = () => {
    if (type === 'apartment') return (
      <div className="space-y-1.5 text-xs">
        {(Object.entries(REPAIR_RATES) as [RepairType, typeof REPAIR_RATES.cosmetic][]).map(([k, v]) => (
          <div key={k} className={`flex justify-between ${repairType === k ? 'text-accent font-bold' : 'text-slate-500'}`}>
            <span>{v.label}</span><span>от {v.rate.toLocaleString('ru')} ₽/м²</span>
          </div>
        ))}
        <div className="flex justify-between text-slate-400 border-t border-slate-100 pt-1.5 mt-1"><span>Вторичка</span><span>+20%</span></div>
        <div className="flex justify-between text-slate-400"><span>Доп. санузел</span><span>+120 000 ₽</span></div>
        <div className="flex justify-between text-slate-400"><span>Материалы</span><span>~{repairType === 'cosmetic' ? '25' : '45'}% от работ</span></div>
      </div>
    );
    if (type === 'bathroom') return (
      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex justify-between"><span>Совмещённый (база)</span><span>от 175 000 ₽</span></div>
        <div className="flex justify-between"><span>Раздельный (база)</span><span>от 210 000 ₽</span></div>
        <div className="flex justify-between"><span>За каждый м² площади</span><span>22 000 ₽/м²</span></div>
        <div className="flex justify-between"><span>Плитка стены/пол</span><span>2 500 ₽/м²</span></div>
        <div className="flex justify-between"><span>Инсталляция</span><span>+15 000 ₽</span></div>
        <div className="flex justify-between"><span>Душевая из плитки</span><span>+45 000 ₽</span></div>
        <div className="flex justify-between text-slate-400"><span>Материалы и инженерия</span><span>~60% от работ</span></div>
      </div>
    );
    return (
      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex justify-between"><span>Черновые работы</span><span>7 500 ₽/м²</span></div>
        <div className="flex justify-between"><span>Монтаж эл. точки</span><span>1 500 ₽/шт</span></div>
        <div className="flex justify-between"><span>Штукатурка по маякам</span><span>950 ₽/м²</span></div>
        <div className="flex justify-between"><span>Штукатурка визуально</span><span>400 ₽/м²</span></div>
        <div className="flex justify-between"><span>Коллекторная разводка</span><span>45 000 ₽</span></div>
        <div className="flex justify-between"><span>Тройниковая разводка</span><span>20 000 ₽</span></div>
        <div className="flex justify-between text-slate-400"><span>Материалы</span><span>~70% от работ</span></div>
      </div>
    );
  };

  // ── Step label for header ─────────────────────────────────
  const stepLabel = ['Тип объекта', 'Параметры', 'Состав работ', 'Результат'];

  return (
    <div ref={containerRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 scroll-mt-8">

      {/* Progress */}
      <div className="h-1 bg-slate-100">
        <motion.div className="h-full bg-accent" animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          {step > 1 && (
            <button onClick={() => step === 2 && subStep === 1 && type === 'apartment' ? setSubStep(0) : goToStep(Math.max(1, step - 1))}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mr-1">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
          )}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stepLabel[step - 1]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`transition-all duration-300 rounded-full
              ${step === s ? 'w-6 h-2 bg-accent' : step > s ? 'w-2 h-2 bg-green-400' : 'w-2 h-2 bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6">

        {/* Bonus chips (step 2+) */}
        {step >= 2 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {BONUSES.map(({ id, Icon, label, unlockedAt }) => (
              <div key={id} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all
                ${unlockedAt <= step ? 'bg-accent/10 text-accent border-accent/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                <Icon className="w-3 h-3" />{label}
                {unlockedAt <= step && <Check className="w-2.5 h-2.5" />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Type ─────────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Что ремонтируем?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUIZ_TYPES.map(t => (
                  <button key={t.id}
                    onClick={() => { setType(t.id as QuizType); setSelectedWorks(new Set()); reachGoal('quiz_type_selected'); setTimeout(() => goToStep(2, 0), 250); }}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-250 text-left min-h-[160px] flex flex-col
                      ${type === t.id ? 'border-accent shadow-md shadow-accent/20' : 'border-slate-100 hover:border-accent/40'}`}>
                    <div className="absolute inset-0 bg-slate-800">
                      <img src={t.photo} alt={t.label} className="w-full h-full object-cover opacity-50"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    </div>
                    <div className="relative mt-auto p-4">
                      <p className="text-white font-bold text-lg leading-tight">{t.label}</p>
                      <p className="text-white/55 text-xs mt-0.5 leading-snug">{t.desc}</p>
                    </div>
                    {type === t.id && (
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Parameters ───────────────────────── */}
          {step === 2 && (
            <motion.div key={`s2-${subStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>

              {/* Apartment sub-step 0: repair type only */}
              {type === 'apartment' && subStep === 0 && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Вид ремонта</h2>
                  <div className="space-y-2">
                    {(Object.entries(REPAIR_RATES) as [RepairType, typeof REPAIR_RATES.cosmetic][]).map(([k, v]) => (
                      <button key={k}
                        onClick={() => { setRepairType(k); setTimeout(() => setSubStep(1) || scrollUp(), 250); }}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all min-h-[64px]
                          ${repairType === k ? 'border-accent bg-accent/5' : 'border-slate-100 hover:border-accent/30'}`}>
                        <div>
                          <p className={`font-bold text-base ${repairType === k ? 'text-accent' : 'text-slate-800'}`}>{v.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{v.sub}</p>
                        </div>
                        <p className={`font-bold text-sm shrink-0 ml-3 ${repairType === k ? 'text-accent' : 'text-slate-400'}`}>
                          от {v.rate.toLocaleString('ru')} ₽/м²
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Apartment sub-step 1: area + building + bathrooms */}
              {type === 'apartment' && subStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">Параметры квартиры</h2>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-sm font-bold text-slate-600">Площадь</label>
                      <span className="text-2xl font-black text-accent">{area} м²</span>
                    </div>
                    <input type="range" min={20} max={200} step={1} value={area} onChange={e => setArea(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>20</span><span>200 м²</span></div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Тип жилья</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['new', 'Новостройка', ''], ['old', 'Вторичка', '+20%']] as [BuildingType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setBuildingType(v)}
                          className={`p-3 rounded-xl border-2 text-left transition-all min-h-[52px]
                            ${buildingType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          {s && <p className="text-xs opacity-60">{s}</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Санузлы</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(n => (
                        <button key={n} onClick={() => setBathrooms(n)}
                          className={`p-3 rounded-xl border-2 text-center transition-all min-h-[52px]
                            ${bathrooms === n ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{n === 3 ? '3+' : n}</p>
                          {n > 1 && <p className="text-xs opacity-60">+{((n - 1) * 120).toLocaleString('ru')}к</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => goToStep(3)}
                    className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                    Далее — состав работ <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Bathroom params */}
              {type === 'bathroom' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">Параметры санузла</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-2">Тип санузла</label>
                      {([['combined', 'Совмещённый', '175 000 ₽'], ['separate', 'Раздельный', '210 000 ₽']] as [BathroomVariant, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setBathroomVariant(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${bathroomVariant === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          <p className="text-xs opacity-60">от {s}</p>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-2">Площадь (м²)</label>
                      <input type="number" inputMode="numeric" min={2} max={20} value={bathroomArea}
                        onChange={e => setBathroomArea(Number(e.target.value))}
                        className="w-full text-4xl font-black py-4 px-3 rounded-2xl border-2 border-slate-100 focus:border-accent focus:outline-none bg-slate-50 text-slate-900 text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Душевая зона</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['standard', 'Ванна / Кабина', 'Стандарт'], ['tile', 'Из плитки', '+45 000 ₽']] as [ShowerType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setShowerType(v)}
                          className={`p-3 rounded-xl border-2 text-left transition-all min-h-[60px]
                            ${showerType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          <p className="text-xs opacity-60">{s}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Унитаз</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['standard', 'Напольный', 'Классика'], ['installation', 'Инсталляция', '+15 000 ₽']] as [ToiletType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setToiletType(v)}
                          className={`p-3 rounded-xl border-2 text-left transition-all min-h-[60px]
                            ${toiletType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          <p className="text-xs opacity-60">{s}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => goToStep(3)}
                    className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                    Далее <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Engineering params */}
              {type === 'engineering' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">Параметры объекта</h2>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-sm font-bold text-slate-600">Площадь</label>
                      <span className="text-2xl font-black text-accent">{engArea} м²</span>
                    </div>
                    <input type="range" min={20} max={200} step={1} value={engArea} onChange={e => setEngArea(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-sm font-bold text-slate-600">Точек электрики</label>
                      <span className="text-2xl font-black text-accent">{electricPoints}</span>
                    </div>
                    <input type="range" min={10} max={150} step={5} value={electricPoints} onChange={e => setElectricPoints(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10</span><span>150 точек</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-2">Разводка труб</label>
                      {([['base', 'Тройниковая', '20 000 ₽'], ['collector', 'Коллекторная', '45 000 ₽']] as [PlumbingType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setPlumbingType(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${plumbingType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          <p className="text-xs opacity-60">{s}</p>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 block mb-2">Стены</label>
                      {([['visual', 'Визуально', '400 ₽/м²'], ['beacons', 'По маякам', '950 ₽/м²']] as [WallType, string, string][]).map(([v, l, s]) => (
                        <button key={v} onClick={() => setWallType(v)}
                          className={`w-full mb-2 p-3 rounded-xl border-2 text-left transition-all min-h-[56px]
                            ${wallType === v ? 'border-accent bg-accent/5 text-accent' : 'border-slate-100 text-slate-600'}`}>
                          <p className="font-bold text-sm">{l}</p>
                          <p className="text-xs opacity-60">{s}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => goToStep(3)}
                    className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                    Далее <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Works + live price ────────────────── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Дополнительно</h2>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Оценка</p>
                  <p className="text-xl font-black text-accent tabular-nums">{fmt(result.total)} ₽</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {currentItems.map(item => {
                  const checked = selectedWorks.has(item.id);
                  const qty = quantities[item.id] ?? item.defaultQty(activeArea);
                  return (
                    <div key={item.id} className={`rounded-2xl border-2 transition-all ${checked ? 'border-accent bg-accent/5' : 'border-slate-100'}`}>
                      <button onClick={() => toggleWork(item.id, item.defaultQty(activeArea))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left min-h-[52px]">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                          ${checked ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`flex-1 text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                        <span className="text-xs text-slate-400 shrink-0">
                          {item.hasQty ? `${item.unitPrice.toLocaleString('ru')} ₽/${item.unit}` : `${item.unitPrice.toLocaleString('ru')} ₽`}
                        </span>
                      </button>
                      {checked && item.hasQty && (
                        <div className="px-4 pb-3">
                          <QtyStepper value={qty} unit={item.unit} onChange={v => setQty(item.id, v)} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Spoiler title="Как мы считаем"><RateRows /></Spoiler>
              {type && <div className="mt-2"><Spoiler title={INFO_INCLUDES[type].title}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INFO_INCLUDES[type].items.map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                      <p className="font-bold text-slate-800 text-xs mb-1">{item.icon} {item.title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Spoiler></div>}

              <button onClick={() => { reachGoal('quiz_step3_done'); goToStep(4); }}
                className="w-full mt-4 bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                Показать итоговую стоимость <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── STEP 4: Result ────────────────────────────── */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div className="text-center mb-6">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Ориентировочная стоимость</p>
                <div className="text-5xl md:text-6xl font-black text-slate-900 tabular-nums">
                  {fmt(result.total)} <span className="text-accent">₽</span>
                </div>
                <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">Смета корректируется ±10–15% после выезда мастера</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-sm space-y-2">
                <div className="flex justify-between text-slate-600"><span>Стоимость работ</span><span className="font-semibold">{fmt(result.work)} ₽</span></div>
                <div className="flex justify-between text-slate-600"><span>Черновые материалы</span><span className="font-semibold">{fmt(result.mat)} ₽</span></div>
                <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-2 text-base">
                  <span>Итого</span><span className="text-accent">{fmt(result.total)} ₽</span>
                </div>
              </div>

              {!submitted ? (
                <div className="bg-slate-900 rounded-3xl p-5 md:p-7 text-white">
                  <h3 className="text-lg font-bold mb-1.5">Зафиксировать цену и забрать бонусы?</h3>
                  <p className="text-white/50 text-xs mb-4 leading-relaxed">
                    Скидка 5%, гарантия 3 года и технический план — бесплатно при заявке.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {BONUSES.map(({ id, Icon, label }) => (
                      <div key={id} className="flex items-center gap-1 bg-accent/20 text-accent px-2.5 py-1 rounded-full text-xs font-bold">
                        <Icon className="w-3 h-3" />{label}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5 mb-3">
                    <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3.5 rounded-xl focus:outline-none focus:border-accent text-sm" />
                    <input type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(fmtPhone(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3.5 rounded-xl focus:outline-none focus:border-accent text-sm" />
                  </div>
                  <button onClick={handleSubmit} disabled={!name || phone.length < 16 || submitting}
                    className="w-full bg-accent text-white py-4 rounded-2xl font-bold hover:bg-accent/90 transition-all disabled:opacity-50 shadow-xl shadow-accent/30">
                    {submitting ? 'Отправляем…' : 'Зафиксировать условия и бонусы'}
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Бонусы зафиксированы!</h3>
                  <p className="text-slate-500 text-sm">Мастер наберёт вас в течение <strong>15 минут</strong>.</p>
                </motion.div>
              )}

              <button onClick={() => { setStep(1); setType(null); setSelectedWorks(new Set()); setSubmitted(false); }}
                className="w-full mt-3 text-slate-400 hover:text-accent text-sm font-medium transition-colors py-2">
                ← Пройти заново
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizCalc;
