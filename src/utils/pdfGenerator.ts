import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { robotoBase64 } from './pdfFonts';

export interface PDFData {
  title: string;
  phone: string;
  parameters: [string, string][];
  costs: [string, string][];
  total: string;
  fileName: string;
  // Расширенные параметры для детальной сметы
  calcType?: 'global' | 'bathroom' | 'rough';
  area?: number;
  repairType?: 'cosmetic' | 'capital' | 'design';
  buildingType?: 'new' | 'old';
  bathrooms?: number;
  bathroomType?: 'combined' | 'separate';
  showerType?: 'standard' | 'tile';
  toiletType?: 'standard' | 'installation';
  electricPoints?: number;
  plumbingType?: 'base' | 'collector';
  wallType?: 'visual' | 'beacons';
  totalWorkCost?: number;
}

interface WorkItem {
  name: string;
  unit: string;
  qty: string;
  price: string;
  total: number;
}

interface WorkStage {
  title: string;
  days: string;
  items: WorkItem[];
}

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' ₽';

function getGlobalStages(data: PDFData): WorkStage[] {
  const area = data.area || 50;
  const wc = data.totalWorkCost || area * 14500;
  const rt = data.repairType || 'capital';
  const bt = data.buildingType || 'new';
  const baths = data.bathrooms || 1;

  const walls = Math.round(area * 2.5);

  if (rt === 'cosmetic') {
    const d = (pct: number) => Math.round(wc * pct);
    return [
      {
        title: 'Этап 1 — Подготовка поверхностей',
        days: '2–4 раб. дня',
        items: [
          { name: 'Снятие старых обоев / смывка краски', unit: 'м²', qty: String(walls), price: fmt(d(0.08) / walls), total: d(0.08) },
          { name: 'Шпаклёвка стен (2 слоя)', unit: 'м²', qty: String(walls), price: fmt(d(0.22) / walls), total: d(0.22) },
          { name: 'Грунтовка стен и потолка', unit: 'м²', qty: String(walls + area), price: fmt(d(0.05) / (walls + area)), total: d(0.05) },
        ]
      },
      {
        title: 'Этап 2 — Отделка стен и потолка',
        days: '5–8 раб. дней',
        items: [
          { name: 'Поклейка обоев / покраска стен', unit: 'м²', qty: String(walls), price: fmt(d(0.32) / walls), total: d(0.32) },
          { name: 'Покраска потолка (2 слоя)', unit: 'м²', qty: String(area), price: fmt(d(0.12) / area), total: d(0.12) },
        ]
      },
      {
        title: 'Этап 3 — Полы',
        days: '2–3 раб. дня',
        items: [
          { name: 'Укладка напольного покрытия', unit: 'м²', qty: String(area), price: fmt(d(0.16) / area), total: d(0.16) },
          { name: 'Монтаж плинтусов', unit: 'п.м', qty: String(Math.round(area ** 0.5 * 4)), price: fmt(d(0.05) / (area ** 0.5 * 4)), total: d(0.05) },
        ]
      },
    ];
  }

  if (rt === 'design') {
    const d = (pct: number) => Math.round(wc * pct);
    return [
      {
        title: 'Этап 1 — Демонтаж и черновая подготовка',
        days: '3–5 раб. дней',
        items: [
          { name: 'Полный демонтаж покрытий и перегородок', unit: 'усл', qty: '1', price: fmt(d(0.06)), total: d(0.06) },
          { name: 'Вывоз строительного мусора', unit: 'рейс', qty: String(Math.ceil(area / 15)), price: fmt(d(0.04) / Math.ceil(area / 15)), total: d(0.04) },
        ]
      },
      {
        title: 'Этап 2 — Перепланировка и конструктив',
        days: '5–10 раб. дней',
        items: [
          { name: 'Возведение перегородок (ГКЛ/газобетон)', unit: 'м²', qty: String(Math.round(area * 0.4)), price: fmt(d(0.08) / Math.round(area * 0.4)), total: d(0.08) },
          { name: 'Стяжка пола (наливной/цементная)', unit: 'м²', qty: String(area), price: fmt(d(0.07) / area), total: d(0.07) },
        ]
      },
      {
        title: 'Этап 3 — Электрика и слаботочка',
        days: '5–8 раб. дней',
        items: [
          { name: 'Разводка кабелей (скрытая)', unit: 'т.п.м', qty: '1', price: fmt(d(0.09)), total: d(0.09) },
          { name: 'Установка точек (розетки/выкл.)', unit: 'шт', qty: String(Math.round(area * 0.9)), price: fmt(d(0.05) / Math.round(area * 0.9)), total: d(0.05) },
          { name: 'Монтаж щита + автоматы', unit: 'шт', qty: '1', price: fmt(d(0.04)), total: d(0.04) },
        ]
      },
      {
        title: 'Этап 4 — Сантехника',
        days: '3–6 раб. дней',
        items: [
          { name: 'Коллекторная разводка водоснабжения', unit: 'к-т', qty: String(baths), price: fmt(d(0.06) / baths), total: d(0.06) },
          { name: 'Разводка канализации', unit: 'к-т', qty: String(baths), price: fmt(d(0.04) / baths), total: d(0.04) },
        ]
      },
      {
        title: 'Этап 5 — Дизайнерская отделка',
        days: '12–20 раб. дней',
        items: [
          { name: 'Штукатурка стен машинная', unit: 'м²', qty: String(walls), price: fmt(d(0.09) / walls), total: d(0.09) },
          { name: 'Декоративная штукатурка / панели', unit: 'м²', qty: String(Math.round(walls * 0.4)), price: fmt(d(0.12) / Math.round(walls * 0.4)), total: d(0.12) },
          { name: 'Укладка напольного покрытия (паркет/керамогранит)', unit: 'м²', qty: String(area), price: fmt(d(0.1) / area), total: d(0.1) },
          { name: 'Многоуровневые / натяжные потолки', unit: 'м²', qty: String(area), price: fmt(d(0.08) / area), total: d(0.08) },
        ]
      },
      {
        title: 'Этап 6 — Финиш',
        days: '3–5 раб. дней',
        items: [
          { name: 'Установка дверей и скрытых коробок', unit: 'шт', qty: String(Math.round(area / 12)), price: fmt(d(0.07) / Math.round(area / 12)), total: d(0.07) },
          { name: 'Финальная уборка', unit: 'усл', qty: '1', price: fmt(d(0.01)), total: d(0.01) },
        ]
      },
    ];
  }

  // capital (default)
  const d = (pct: number) => Math.round(wc * pct);
  const oldExtra = bt === 'old' ? ' (с учётом усиления)' : '';
  return [
    {
      title: 'Этап 1 — Демонтаж и вывоз мусора',
      days: '2–3 раб. дня',
      items: [
        { name: 'Демонтаж старых покрытий пола', unit: 'м²', qty: String(area), price: fmt(d(0.03) / area), total: d(0.03) },
        { name: 'Демонтаж обоев / штукатурки' + oldExtra, unit: 'м²', qty: String(walls), price: fmt(d(0.03) / walls), total: d(0.03) },
        { name: 'Вывоз строительного мусора (контейнер)', unit: 'рейс', qty: String(Math.ceil(area / 18)), price: fmt(d(0.02) / Math.ceil(area / 18)), total: d(0.02) },
      ]
    },
    {
      title: 'Этап 2 — Стены и потолки (черновые)',
      days: '7–12 раб. дней',
      items: [
        { name: 'Штукатурка стен по маякам' + oldExtra, unit: 'м²', qty: String(walls), price: fmt(d(0.16) / walls), total: d(0.16) },
        { name: 'Шпаклёвка стен (финишная, 2 слоя)', unit: 'м²', qty: String(walls), price: fmt(d(0.09) / walls), total: d(0.09) },
        { name: 'Шпаклёвка потолка', unit: 'м²', qty: String(area), price: fmt(d(0.05) / area), total: d(0.05) },
      ]
    },
    {
      title: 'Этап 3 — Стяжка пола',
      days: '3–5 раб. дней (+ 7–10 дней сушки)',
      items: [
        { name: 'Стяжка пола (цементная, 50 мм)', unit: 'м²', qty: String(area), price: fmt(d(0.08) / area), total: d(0.08) },
        { name: 'Грунтовка основания', unit: 'м²', qty: String(area), price: fmt(d(0.01) / area), total: d(0.01) },
      ]
    },
    {
      title: 'Этап 4 — Электрика',
      days: '4–6 раб. дней',
      items: [
        { name: 'Разводка кабеля (скрытая в штробах)', unit: 'т.п.м', qty: '1', price: fmt(d(0.08)), total: d(0.08) },
        { name: 'Установка розеток и выключателей', unit: 'шт', qty: String(Math.round(area * 0.8)), price: fmt(d(0.04) / Math.round(area * 0.8)), total: d(0.04) },
        { name: 'Монтаж электрощита с автоматами', unit: 'шт', qty: '1', price: fmt(d(0.03)), total: d(0.03) },
      ]
    },
    {
      title: 'Этап 5 — Сантехника',
      days: '3–5 раб. дней',
      items: [
        { name: 'Коллекторная разводка водоснабжения', unit: 'к-т', qty: String(baths), price: fmt(d(0.05) / baths), total: d(0.05) },
        { name: 'Разводка канализации', unit: 'к-т', qty: String(baths), price: fmt(d(0.03) / baths), total: d(0.03) },
        { name: 'Подключение сантехнического оборудования', unit: 'т.шт', qty: String(baths), price: fmt(d(0.02) / baths), total: d(0.02) },
      ]
    },
    {
      title: 'Этап 6 — Чистовая отделка',
      days: '8–14 раб. дней',
      items: [
        { name: 'Укладка напольного покрытия (ламинат/плитка)', unit: 'м²', qty: String(area), price: fmt(d(0.1) / area), total: d(0.1) },
        { name: 'Отделка стен (обои / покраска)', unit: 'м²', qty: String(walls), price: fmt(d(0.12) / walls), total: d(0.12) },
        { name: 'Натяжной потолок', unit: 'м²', qty: String(area), price: fmt(d(0.06) / area), total: d(0.06) },
      ]
    },
    {
      title: 'Этап 7 — Финишные работы',
      days: '2–3 раб. дня',
      items: [
        { name: 'Установка межкомнатных дверей', unit: 'шт', qty: String(Math.round(area / 14)), price: fmt(d(0.05) / Math.round(area / 14)), total: d(0.05) },
        { name: 'Монтаж плинтусов и наличников', unit: 'п.м', qty: String(Math.round(area ** 0.5 * 4 * 1.5)), price: fmt(d(0.02) / Math.round(area ** 0.5 * 4 * 1.5)), total: d(0.02) },
        { name: 'Финальная уборка после ремонта', unit: 'усл', qty: '1', price: fmt(d(0.02)), total: d(0.02) },
      ]
    },
  ];
}

function getBathroomStages(data: PDFData): WorkStage[] {
  const wc = data.totalWorkCost || 200000;
  const d = (pct: number) => Math.round(wc * pct);
  const area = data.bathroomArea || 4;
  const hasTile = data.showerType === 'tile';
  const hasInst = data.toiletType === 'installation';

  return [
    {
      title: 'Этап 1 — Демонтаж',
      days: '1–2 раб. дня',
      items: [
        { name: 'Демонтаж старой плитки со стен', unit: 'м²', qty: String(Math.round(area * 2.4)), price: fmt(d(0.05) / Math.round(area * 2.4)), total: d(0.05) },
        { name: 'Демонтаж сантехники и стяжки', unit: 'усл', qty: '1', price: fmt(d(0.04)), total: d(0.04) },
        { name: 'Вывоз строительного мусора', unit: 'рейс', qty: '1', price: fmt(d(0.02)), total: d(0.02) },
      ]
    },
    {
      title: 'Этап 2 — Гидроизоляция и стяжка',
      days: '2–3 раб. дня (+ 3–5 дней сушки)',
      items: [
        { name: 'Обмазочная гидроизоляция (3 слоя)', unit: 'м²', qty: String(area), price: fmt(d(0.08) / area), total: d(0.08) },
        { name: 'Стяжка пола в санузле', unit: 'м²', qty: String(area), price: fmt(d(0.06) / area), total: d(0.06) },
      ]
    },
    {
      title: 'Этап 3 — Инженерные коммуникации',
      days: '2–3 раб. дня',
      items: [
        { name: 'Разводка водоснабжения (полипропилен)', unit: 'к-т', qty: '1', price: fmt(d(0.1)), total: d(0.1) },
        { name: 'Разводка канализации', unit: 'к-т', qty: '1', price: fmt(d(0.07)), total: d(0.07) },
        { name: hasInst ? 'Монтаж инсталляции (скрытый бачок)' : 'Монтаж напольного унитаза', unit: 'шт', qty: '1', price: fmt(d(0.06)), total: d(0.06) },
      ]
    },
    {
      title: 'Этап 4 — Плитка и керамогранит',
      days: '4–7 раб. дней',
      items: [
        { name: 'Укладка плитки на стены', unit: 'м²', qty: String(Math.round(area * 2.4)), price: fmt(d(0.2) / Math.round(area * 2.4)), total: d(0.2) },
        { name: hasTile ? 'Душевая зона из керамогранита' : 'Укладка плитки на пол', unit: 'м²', qty: String(area), price: fmt(d(0.12) / area), total: d(0.12) },
        { name: 'Затирка швов и силикон', unit: 'усл', qty: '1', price: fmt(d(0.03)), total: d(0.03) },
      ]
    },
    {
      title: 'Этап 5 — Электрика и вентиляция',
      days: '1–2 раб. дня',
      items: [
        { name: 'Электроразводка (влагозащищённые линии)', unit: 'к-т', qty: '1', price: fmt(d(0.06)), total: d(0.06) },
        { name: 'Монтаж вентиляционного клапана', unit: 'шт', qty: '1', price: fmt(d(0.03)), total: d(0.03) },
        { name: 'Установка тёплого пола (опция)', unit: 'м²', qty: String(area), price: fmt(d(0.04) / area), total: d(0.04) },
      ]
    },
    {
      title: 'Этап 6 — Финиш',
      days: '1–2 раб. дня',
      items: [
        { name: 'Установка сантехники (смеситель, душ)', unit: 'к-т', qty: '1', price: fmt(d(0.09)), total: d(0.09) },
        { name: 'Потолок (реечный / натяжной)', unit: 'м²', qty: String(area), price: fmt(d(0.04) / area), total: d(0.04) },
        { name: 'Финальная уборка и проверка', unit: 'усл', qty: '1', price: fmt(d(0.01)), total: d(0.01) },
      ]
    },
  ];
}

function getRoughStages(data: PDFData): WorkStage[] {
  const wc = data.totalWorkCost || 400000;
  const d = (pct: number) => Math.round(wc * pct);
  const area = data.area || 50;
  const pts = data.electricPoints || 40;
  const collector = data.plumbingType === 'collector';
  const beacons = data.wallType === 'beacons';

  return [
    {
      title: 'Этап 1 — Стяжка пола',
      days: '2–4 раб. дня (+ 7 дней сушки)',
      items: [
        { name: 'Черновая стяжка (50 мм)', unit: 'м²', qty: String(area), price: fmt(d(0.18) / area), total: d(0.18) },
        { name: 'Грунтовка, маяки, выравнивание', unit: 'м²', qty: String(area), price: fmt(d(0.05) / area), total: d(0.05) },
      ]
    },
    {
      title: 'Этап 2 — Выравнивание стен',
      days: '5–10 раб. дней',
      items: [
        { name: beacons ? 'Штукатурка стен по маякам (углы 90°)' : 'Штукатурка стен (визуальное выравнивание)', unit: 'м²', qty: String(Math.round(area * 2.5)), price: fmt(d(0.25) / Math.round(area * 2.5)), total: d(0.25) },
        { name: 'Грунтовка стен (2 слоя)', unit: 'м²', qty: String(Math.round(area * 2.5)), price: fmt(d(0.04) / Math.round(area * 2.5)), total: d(0.04) },
      ]
    },
    {
      title: 'Этап 3 — Электрика (по ГОСТ)',
      days: '4–7 раб. дней',
      items: [
        { name: 'Штробление стен под кабели', unit: 'п.м', qty: String(Math.round(pts * 3)), price: fmt(d(0.08) / Math.round(pts * 3)), total: d(0.08) },
        { name: 'Прокладка кабеля ВВГнг-LS', unit: 'т.п.м', qty: '1', price: fmt(d(0.12)), total: d(0.12) },
        { name: 'Установка подрозетников и коробок', unit: 'шт', qty: String(pts), price: fmt(d(0.06) / pts), total: d(0.06) },
        { name: 'Монтаж щита + УЗО + автоматы', unit: 'шт', qty: '1', price: fmt(d(0.05)), total: d(0.05) },
      ]
    },
    {
      title: 'Этап 4 — Сантехника',
      days: '3–5 раб. дней',
      items: [
        { name: collector ? 'Коллекторная разводка водоснабжения (надёжная)' : 'Тройниковая разводка водоснабжения', unit: 'к-т', qty: '1', price: fmt(d(0.15)), total: d(0.15) },
        { name: 'Разводка канализации (ПВХ)', unit: 'к-т', qty: '1', price: fmt(d(0.07)), total: d(0.07) },
      ]
    },
  ];
}

function getStages(data: PDFData): WorkStage[] {
  if (data.calcType === 'bathroom') return getBathroomStages(data);
  if (data.calcType === 'rough') return getRoughStages(data);
  return getGlobalStages(data);
}

function getTotalDays(data: PDFData): string {
  if (data.calcType === 'bathroom') return '14–22 рабочих дня';
  if (data.calcType === 'rough') return '20–35 рабочих дней';
  const rt = data.repairType || 'capital';
  const area = data.area || 50;
  if (rt === 'cosmetic') return `${Math.round(area * 0.3)}–${Math.round(area * 0.4)} рабочих дней`;
  if (rt === 'design') return `${Math.round(area * 0.9)}–${Math.round(area * 1.2)} рабочих дней`;
  return `${Math.round(area * 0.6)}–${Math.round(area * 0.8)} рабочих дней`;
}

const FONT = 'Roboto';
const ACCENT = [197, 160, 89] as [number, number, number];
const DARK = [26, 26, 26] as [number, number, number];
const GRAY = [100, 100, 100] as [number, number, number];

export const generateCalculatorPDF = async (data: PDFData) => {
  try {
    const doc = new jsPDF();

    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', FONT, 'normal');

    const stages = getStages(data);
    const totalDays = getTotalDays(data);

    // ── ШАПКА ──────────────────────────────────────────
    doc.setFillColor(...DARK);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setFont(FONT, 'normal');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('ДЯДЯ ФЁДОР', 15, 12);

    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text('Ремонт квартир в Екатеринбурге', 15, 19);
    doc.text('8-922-18-00-911  •  uf66.ru', 15, 24);

    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 180, 12, { align: 'right' });
    doc.text(`Телефон клиента: ${data.phone || 'не указан'}`, 180, 18, { align: 'right' });

    // ── ЗАГОЛОВОК ──────────────────────────────────────
    doc.setFillColor(...ACCENT);
    doc.rect(0, 28, 210, 1, 'F');

    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text(data.title, 105, 38, { align: 'center' });

    // ── ПАРАМЕТРЫ ОБЪЕКТА ──────────────────────────────
    autoTable(doc, {
      startY: 44,
      head: [['Параметры объекта', '']],
      body: data.parameters,
      styles: { font: FONT, fontStyle: 'normal', fontSize: 9 },
      headStyles: { fillColor: DARK, textColor: [255,255,255], fontStyle: 'normal', fontSize: 9 },
      columnStyles: { 0: { cellWidth: 90, textColor: GRAY }, 1: { fontStyle: 'normal', textColor: DARK } },
      margin: { left: 15, right: 15 },
    });

    // ── ДЕТАЛЬНАЯ СМЕТА ────────────────────────────────
    let curY = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text('ДЕТАЛЬНАЯ СМЕТА ПО ЭТАПАМ', 15, curY);
    doc.setFillColor(...ACCENT);
    doc.rect(15, curY + 2, 180, 0.5, 'F');
    curY += 8;

    for (const stage of stages) {
      if (curY > 255) { doc.addPage(); curY = 15; }

      autoTable(doc, {
        startY: curY,
        head: [[
          { content: stage.title, colSpan: 4, styles: { halign: 'left' } },
          { content: `Срок: ${stage.days}`, styles: { halign: 'right', textColor: ACCENT } }
        ]],
        body: stage.items.map(i => [i.name, i.unit, i.qty, i.price, fmt(i.total)]),
        columns: [
          { header: 'Наименование работы', dataKey: 'name' },
          { header: 'Ед.', dataKey: 'unit' },
          { header: 'Кол-во', dataKey: 'qty' },
          { header: 'Цена/ед.', dataKey: 'price' },
          { header: 'Итого', dataKey: 'total' },
        ],
        styles: { font: FONT, fontStyle: 'normal', fontSize: 8 },
        headStyles: { fillColor: [45, 45, 45], textColor: [255,255,255], fontStyle: 'normal', fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 15, halign: 'center' },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 30, halign: 'right', textColor: DARK },
        },
        margin: { left: 15, right: 15 },
      });

      curY = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── ИТОГОВАЯ ТАБЛИЦА ───────────────────────────────
    if (curY > 230) { doc.addPage(); curY = 15; }
    curY += 4;

    autoTable(doc, {
      startY: curY,
      head: [['Статья расходов', 'Сумма']],
      body: data.costs,
      foot: [['ИТОГО (работы + черновые материалы)', data.total]],
      styles: { font: FONT, fontStyle: 'normal', fontSize: 9 },
      headStyles: { fillColor: DARK, textColor: [255,255,255], fontStyle: 'normal' },
      footStyles: { fillColor: ACCENT, textColor: [255,255,255], fontStyle: 'normal', fontSize: 10 },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 15, right: 15 },
    });

    curY = (doc as any).lastAutoTable.finalY + 8;

    // ── СРОКИ ──────────────────────────────────────────
    if (curY > 245) { doc.addPage(); curY = 15; }

    doc.setFillColor(248, 248, 248);
    doc.roundedRect(15, curY, 180, 16, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Ориентировочный срок выполнения:', 20, curY + 7);
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(totalDays, 20, curY + 13);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('* Сроки считаются от дня подписания договора, без учёта праздников', 105, curY + 7);
    doc.text('и времени ожидания материалов от поставщика', 105, curY + 12);

    curY += 24;

    // ── УСЛОВИЯ И ГАРАНТИИ ─────────────────────────────
    if (curY > 240) { doc.addPage(); curY = 15; }

    const guarantees = [
      ['Договор', 'Фиксированная смета, штрафные санкции за просрочку'],
      ['Гарантия', 'На все виды работ — 2 года, на гидроизоляцию — 5 лет'],
      ['Материалы', 'Только от проверенных поставщиков, чеки передаём заказчику'],
      ['Контроль', 'Фото каждого скрытого этапа в WhatsApp/Telegram'],
      ['Оплата', 'Поэтапно: аванс 30% → по готовности каждого этапа'],
    ];

    autoTable(doc, {
      startY: curY,
      head: [['Наши условия работы', '']],
      body: guarantees,
      styles: { font: FONT, fontStyle: 'normal', fontSize: 8 },
      headStyles: { fillColor: ACCENT, textColor: [255,255,255], fontStyle: 'normal' },
      columnStyles: { 0: { cellWidth: 40, textColor: DARK }, 1: { textColor: GRAY } },
      margin: { left: 15, right: 15 },
    });

    curY = (doc as any).lastAutoTable.finalY + 8;

    // ── СЛЕДУЮЩИЙ ШАГ ──────────────────────────────────
    if (curY > 255) { doc.addPage(); curY = 15; }

    doc.setFillColor(...DARK);
    doc.roundedRect(15, curY, 180, 22, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...ACCENT);
    doc.text('СЛЕДУЮЩИЙ ШАГ — бесплатный выезд инженера на замер', 105, curY + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Позвоните или напишите — приедем, уточним детали и подготовим точную смету', 105, curY + 14, { align: 'center' });
    doc.setTextColor(...ACCENT);
    doc.text('8-922-18-00-911  •  Telegram: @Mebabanza  •  uf66.ru', 105, curY + 19, { align: 'center' });

    // ── ПОДВАЛ ─────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text(
        'Данный расчёт является предварительным и может быть скорректирован после осмотра объекта инженером.',
        105, 292, { align: 'center' }
      );
      doc.text(`Страница ${i} из ${pageCount}`, 195, 292, { align: 'right' });
    }

    doc.save(data.fileName);
    return true;
  } catch (err) {
    console.error('PDF Error:', err);
    return false;
  }
};
