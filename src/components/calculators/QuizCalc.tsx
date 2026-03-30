import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Check, Gift, Shield, FileText, MapPin, Ruler } from 'lucide-react';
import { reachGoal } from '../../utils/metrica';

type RenovationType = 'bathroom' | 'apartment' | 'secondary' | null;
type Location = 'ekb' | 'suburb';

interface WorkItem {
  id: string;
  label: string;
  price: (area: number) => number;
  priceLabel: (area: number) => string;
}

interface WorkGroup {
  id: string;
  title: string;
  icon: string;
  items: WorkItem[];
}

const WORK_GROUPS: WorkGroup[] = [
  {
    id: 'rough',
    title: 'Черновые работы',
    icon: '/quiz/photo/shtapel.jpg',
    items: [
      { id: 'plaster',    label: 'Штукатурка стен по маякам',    price: a => a * 950,   priceLabel: a => `${(a * 950).toLocaleString('ru')} ₽` },
      { id: 'screed',     label: 'Стяжка пола',                   price: a => a * 1300,  priceLabel: a => `${(a * 1300).toLocaleString('ru')} ₽` },
      { id: 'demolition', label: 'Демонтажные работы',            price: a => a * 500,   priceLabel: a => `${(a * 500).toLocaleString('ru')} ₽` },
      { id: 'partitions', label: 'Возведение перегородок',        price: () => 25000,    priceLabel: () => 'от 25 000 ₽' },
    ],
  },
  {
    id: 'engineering',
    title: 'Инженерия',
    icon: '/quiz/photo/rozetka.avif',
    items: [
      { id: 'electric',   label: 'Электрика (полная разводка)',   price: () => 45000,    priceLabel: () => 'от 45 000 ₽' },
      { id: 'plumbing',   label: 'Сантехника коллекторная',       price: () => 45000,    priceLabel: () => 'от 45 000 ₽' },
      { id: 'warm_floor', label: 'Тёплый пол водяной',            price: a => a * 1500,  priceLabel: a => `${(a * 1500).toLocaleString('ru')} ₽` },
      { id: 'conditioner',label: 'Кондиционирование',             price: () => 18000,    priceLabel: () => 'от 18 000 ₽/точка' },
    ],
  },
  {
    id: 'finish',
    title: 'Чистовая отделка',
    icon: '/quiz/photo/laminat.jfif',
    items: [
      { id: 'tile',       label: 'Укладка плитки / керамогранита', price: a => a * 2500, priceLabel: a => `${(a * 2500).toLocaleString('ru')} ₽` },
      { id: 'laminate',   label: 'Ламинат / кварцвинил',           price: a => a * 1800, priceLabel: a => `${(a * 1800).toLocaleString('ru')} ₽` },
      { id: 'ceilings',   label: 'Натяжные потолки',               price: a => a * 850,  priceLabel: a => `${(a * 850).toLocaleString('ru')} ₽` },
      { id: 'painting',   label: 'Покраска стен',                  price: a => a * 600,  priceLabel: a => `${(a * 600).toLocaleString('ru')} ₽` },
      { id: 'wallpaper',  label: 'Поклейка обоев',                 price: a => a * 500,  priceLabel: a => `${(a * 500).toLocaleString('ru')} ₽` },
    ],
  },
  {
    id: 'extra',
    title: 'Дополнительно',
    icon: '/quiz/photo/gkluch.avif',
    items: [
      { id: 'design',     label: 'Дизайн-проект',                 price: () => 30000,   priceLabel: () => 'от 30 000 ₽' },
      { id: 'supervision',label: 'Авторский надзор',              price: a => a * 500,  priceLabel: a => `${(a * 500).toLocaleString('ru')} ₽` },
      { id: 'acceptance', label: 'Приёмка квартиры у застройщика',price: () => 15000,   priceLabel: () => '15 000 ₽' },
      { id: 'cleaning',   label: 'Финальный клининг',             price: a => a * 200,  priceLabel: a => `${(a * 200).toLocaleString('ru')} ₽` },
    ],
  },
];

const RENOVATION_TYPES = [
  { id: 'bathroom',  label: 'Санузел',  desc: 'Ванная или туалет под ключ',              photo: '/quiz/photo/k1.png' },
  { id: 'apartment', label: 'Квартира', desc: 'Новостройка или свободная планировка',     photo: '/quiz/photo/k2.png' },
  { id: 'secondary', label: 'Вторичка', desc: 'Со сносом старой отделки и заменой труб', photo: '/quiz/photo/k3.png' },
];

const BONUSES = [
  { id: 'discount',  Icon: Gift,     label: 'Скидка 5%',          desc: 'на весь объём работ',       unlockedAt: 1 },
  { id: 'guarantee', Icon: Shield,   label: 'Гарантия 3 года',    desc: 'прописана в договоре',      unlockedAt: 2 },
  { id: 'plan',      Icon: FileText, label: 'Технический план',   desc: 'раскладки материалов',      unlockedAt: 3 },
];

function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, '');
  let d = digits;
  if (d.startsWith('8') || d.startsWith('7')) d = d.slice(1);
  d = d.slice(0, 10);
  let result = '+7';
  if (d.length > 0) result += ' (' + d.slice(0, 3);
  if (d.length >= 3) result += ') ' + d.slice(3, 6);
  if (d.length >= 6) result += '-' + d.slice(6, 8);
  if (d.length >= 8) result += '-' + d.slice(8, 10);
  return result;
}

const QuizCalc: React.FC = () => {
  const [step, setStep]                     = useState(1);
  const [renovationType, setRenovationType] = useState<RenovationType>(null);
  const [area, setArea]                     = useState<number | ''>('');
  const [location, setLocation]             = useState<Location>('ekb');
  const [selectedWorks, setSelectedWorks]   = useState<Set<string>>(new Set());
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['rough']));
  const [name, setName]                     = useState('');
  const [phone, setPhone]                   = useState('');
  const [submitted, setSubmitted]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const containerRef                        = useRef<HTMLDivElement>(null);

  const unlockedCount = step;

  const calcPrice = (): number => {
    const a = Number(area) || 50;
    let base = 0;
    if (renovationType === 'bathroom')  base = 175000 + a * 22000;
    else if (renovationType === 'apartment') base = a * 14500;
    else if (renovationType === 'secondary') base = a * 14500 * 1.2;
    if (location === 'suburb') base *= 1.15;
    for (const workId of selectedWorks) {
      for (const group of WORK_GROUPS) {
        const item = group.items.find(i => i.id === workId);
        if (item) { base += item.price(a); break; }
      }
    }
    return Math.round(base);
  };

  const goToStep = (s: number) => {
    setStep(s);
    setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const toggleWork      = (id: string) => setSelectedWorks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAccordion = (id: string) => setOpenAccordions(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSubmit = async () => {
    if (!name || !phone || phone.length < 16) return;
    setSubmitting(true);
    reachGoal('quiz_lead_captured');

    const worksList = Array.from(selectedWorks)
      .map(id => WORK_GROUPS.flatMap(g => g.items).find(i => i.id === id)?.label ?? id)
      .join(', ');

    const message =
      `🎯 КВИЗ-КАЛЬКУЛЯТОР\n` +
      `Тип: ${RENOVATION_TYPES.find(r => r.id === renovationType)?.label ?? '—'}\n` +
      `Площадь: ${area} м²\n` +
      `Локация: ${location === 'ekb' ? 'Екатеринбург' : 'Пригород'}\n` +
      `Работы: ${worksList || 'не выбраны'}\n` +
      `Итог: ${calcPrice().toLocaleString('ru')} ₽`;

    try {
      await fetch('/lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      });
    } catch {}

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 scroll-mt-8">

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100">
        <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-0 px-6 pt-5 pb-4 border-b border-slate-50">
        {[1, 2, 3, 4].map(s => (
          <React.Fragment key={s}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${step === s ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110' :
                step > s  ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={`h-0.5 w-10 sm:w-20 transition-all duration-300 ${step > s ? 'bg-green-400' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="p-6 md:p-8">

        {/* Bonus panel (Step 2+) */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {BONUSES.map(({ id, Icon, label, unlockedAt }) => {
              const unlocked = unlockedAt <= unlockedCount;
              return (
                <div key={id} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all duration-500
                  ${unlocked ? 'bg-accent/10 text-accent border-accent/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {unlocked && <Check className="w-3 h-3 shrink-0" />}
                </div>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1 ────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.28 }}>

              <div className="bg-accent/5 border-2 border-accent/25 rounded-2xl px-5 py-4 mb-8 text-center">
                <p className="font-bold text-sm md:text-base leading-snug">
                  <span className="text-accent">Рассчитайте стоимость ремонта за 4 шага.</span>{' '}
                  <span className="text-slate-700">Мы покажем итоговую сумму сразу —{' '}
                    <span className="underline decoration-accent decoration-2 underline-offset-2">вводить номер телефона НЕ НУЖНО!</span>
                  </span>
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">Что ремонтируем?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RENOVATION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setRenovationType(type.id as RenovationType);
                      reachGoal('quiz_step1_selected');
                      setTimeout(() => goToStep(2), 280);
                    }}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left min-h-[190px] flex flex-col
                      ${renovationType === type.id
                        ? 'border-accent shadow-lg shadow-accent/20'
                        : 'border-slate-100 hover:border-accent/50 hover:shadow-md'}`}
                  >
                    {/* Photo background */}
                    <div className="absolute inset-0 bg-slate-800">
                      <img
                        src={type.photo}
                        alt={type.label}
                        className="w-full h-full object-cover opacity-55 transition-opacity"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    </div>
                    {/* Content */}
                    <div className="relative mt-auto p-5">
                      <div className="text-3xl mb-1">{type.emoji}</div>
                      <div className="text-white font-bold text-xl">{type.label}</div>
                      <div className="text-white/60 text-xs mt-1 leading-snug">{type.desc}</div>
                    </div>
                    {renovationType === type.id && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 ────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.28 }}>

              <h2 className="text-2xl font-bold text-slate-900 mb-8">Параметры объекта</h2>
              <div className="space-y-8">

                {/* Area */}
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <Ruler className="w-4 h-4 text-accent" />
                    Площадь (м²)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Например: 55"
                    value={area}
                    onChange={e => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-4xl font-black py-5 px-6 rounded-2xl border-2 border-slate-100 focus:border-accent focus:outline-none transition-all text-slate-900 bg-slate-50"
                    min={1} max={999}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-accent" />
                    Расположение
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'ekb',    label: 'Екатеринбург', sub: 'В черте города' },
                      { id: 'suburb', label: 'Пригород',     sub: '+15% к стоимости' },
                    ] as { id: Location; label: string; sub: string }[]).map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setLocation(loc.id);
                          if (area) {
                            reachGoal('quiz_step2_done');
                            setTimeout(() => goToStep(3), 280);
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[64px]
                          ${location === loc.id
                            ? 'border-accent bg-accent/5 text-accent'
                            : 'border-slate-100 text-slate-600 hover:border-accent/50'}`}
                      >
                        <div className="font-bold">{loc.label}</div>
                        <div className="text-xs opacity-70 mt-0.5">{loc.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { if (area) { reachGoal('quiz_step2_done'); goToStep(3); } }}
                  disabled={!area}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  Далее — состав работ <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 ────────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.28 }}>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">Состав работ</h2>
              <p className="text-slate-400 text-sm mb-5">Выберите нужные позиции — цена обновляется в реальном времени.</p>

              {/* Live price */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Текущая оценка:</span>
                <span className="text-2xl font-black text-accent">{calcPrice().toLocaleString('ru')} ₽</span>
              </div>

              {/* Accordions */}
              <div className="space-y-2">
                {WORK_GROUPS.map(group => {
                  const checkedCount = group.items.filter(i => selectedWorks.has(i.id)).length;
                  const isOpen = openAccordions.has(group.id);
                  return (
                    <div key={group.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(group.id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-3 font-bold text-slate-800">
                          <img src={group.icon} alt={group.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          {group.title}
                          {checkedCount > 0 && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">
                              {checkedCount} выбрано
                            </span>
                          )}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-slate-100 divide-y divide-slate-50">
                              {group.items.map(item => {
                                const checked = selectedWorks.has(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => toggleWork(item.id)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors min-h-[56px]
                                      ${checked ? 'bg-accent/5' : 'hover:bg-slate-50'}`}
                                  >
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                                      ${checked ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                                      {checked && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`flex-1 text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>
                                      {item.label}
                                    </span>
                                    <span className="text-xs text-slate-400 shrink-0">
                                      {item.priceLabel(Number(area) || 50)}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => { reachGoal('quiz_step3_done'); goToStep(4); }}
                className="w-full mt-6 bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                Показать итоговую стоимость <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── STEP 4: RESULT ────────────────────────────── */}
          {step === 4 && (
            <motion.div key="s4"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.28 }}>

              {/* Big price */}
              <div className="text-center mb-8">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Ориентировочная стоимость</p>
                <div className="text-5xl md:text-7xl font-black text-slate-900 mb-3 tabular-nums">
                  {calcPrice().toLocaleString('ru')}{' '}
                  <span className="text-accent">₽</span>
                </div>
                <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Смета может корректироваться (±10–15%) после выезда мастера с лазерным уровнем и оценки скрытых дефектов.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-8 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Тип</span>
                  <span className="font-bold text-slate-800">{RENOVATION_TYPES.find(r => r.id === renovationType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Площадь</span>
                  <span className="font-bold text-slate-800">{area} м²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Локация</span>
                  <span className="font-bold text-slate-800">{location === 'ekb' ? 'Екатеринбург' : 'Пригород (+15%)'}</span>
                </div>
                {selectedWorks.size > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Доп. работ</span>
                    <span className="font-bold text-slate-800">{selectedWorks.size} позиций</span>
                  </div>
                )}
              </div>

              {/* Lead magnet */}
              {!submitted ? (
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white">
                  <h3 className="text-xl font-bold mb-2 leading-snug">
                    Хотите зафиксировать эту цену и забрать накопленные бонусы?
                  </h3>
                  <p className="text-white/50 text-sm mb-5 leading-relaxed">
                    Оставьте номер, и за вами закрепятся:{' '}
                    <span className="text-accent font-semibold">Скидка 5%</span>,{' '}
                    <span className="text-accent font-semibold">Гарантия 3 года</span> и{' '}
                    <span className="text-accent font-semibold">Технический план раскладки</span>.
                  </p>

                  {/* Bonus chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {BONUSES.map(({ id, Icon, label }) => (
                      <div key={id} className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-bold">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-4 rounded-xl focus:outline-none focus:border-accent transition-all text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={e => setPhone(formatPhone(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-4 rounded-xl focus:outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!name || phone.length < 16 || submitting}
                    className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all disabled:opacity-50 shadow-xl shadow-accent/30"
                  >
                    {submitting ? 'Отправляем…' : 'Зафиксировать условия и бонусы'}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Бонусы зафиксированы!</h3>
                  <p className="text-slate-500 text-sm">Мастер наберёт вас в течение <strong>15 минут</strong>.</p>
                </motion.div>
              )}

              <button
                onClick={() => { setStep(1); setRenovationType(null); setArea(''); setSelectedWorks(new Set()); setSubmitted(false); }}
                className="w-full mt-4 text-slate-400 hover:text-accent text-sm font-medium transition-colors py-2"
              >
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
