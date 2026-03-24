import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import CosmeticRepair from './pages/CosmeticRepair';
import NewBuildingRepair from './pages/NewBuildingRepair';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { 
  Hammer, 
  Paintbrush, 
  Layout, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ChevronRight, 
  Star, 
  Menu, 
  X,
  ArrowRight,
  Calculator,
  Clock,
  ShieldCheck,
  Ruler,
  Wrench,
  Zap,
  Droplets,
  Sofa,
  Send
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '/#services' },
    { name: 'Этапы', href: '/#stages' },
    { name: 'Портфолио', href: '/#portfolio' },
    { name: 'Калькулятор', href: '/#calculator' },
    { name: 'Блог', href: '/blog' },
    { name: 'Контакты', href: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3 lg:py-4' : 'bg-transparent py-4 lg:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-lg">
            <Hammer className="text-white w-6 h-6" />
          </div>
          <span className={`text-xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
            Дядя <span className="text-accent">Фёдор</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium hover:text-accent transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4">
            <a href="tel:89221800911" className={`hover:text-accent transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} title="Позвонить">
              <Phone className="w-5 h-5" />
            </a>
            <a href="https://t.me/tonmeplz" target="_blank" rel="noopener noreferrer" className={`hover:text-accent transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} title="Написать в Telegram">
              <Send className="w-5 h-5" />
            </a>
          </div>
          <button className="bg-accent text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
            Заказать звонок
          </button>
        </div>

        {/* Mobile Nav Icons */}
        <div className="flex lg:hidden items-center gap-5">
          <a href="tel:89221800911" className={`hover:text-accent transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} title="Позвонить">
            <Phone className="w-6 h-6" />
          </a>
          <a href="https://t.me/tonmeplz" target="_blank" rel="noopener noreferrer" className={`hover:text-accent transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} title="Написать в Telegram">
            <Send className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Mobile Nav Links Row */}
      <div className={`lg:hidden max-w-7xl mx-auto px-6 mt-4 flex overflow-x-auto gap-6 pb-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className={`text-sm font-medium whitespace-nowrap hover:text-accent transition-colors snap-start ${isScrolled ? 'text-primary' : 'text-white/90'}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-12 w-full bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1920" 
          alt="Modern interior" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center lg:text-left">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-5xl md:text-7xl text-white font-bold leading-tight mb-6">
            Ремонт квартир <span className="italic font-serif text-accent">без посредников</span>
          </h1>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Честные цены по рынку Екатеринбурга. От черновой отделки в новостройке до капитального ремонта вторички. Точная смета до начала работ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/#calculator" className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-accent/30">
              Рассчитать стоимость
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/#portfolio" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              Смотреть примеры
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="text-3xl font-bold text-white mb-1">12</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Лет в Екб</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">350+</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Сданных квартир</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">3 года</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Гарантия по договору</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Косметический ремонт',
      description: 'Освежить интерьер: переклейка обоев, замена ламината, покраска потолков, замена розеток.',
      icon: Paintbrush,
      price: 'от 4 000 ₽/м²',
      link: '/kosmeticheskiy-remont'
    },
    {
      title: 'Капитальный ремонт',
      description: 'Полный демонтаж, выравнивание стен по маякам, новая стяжка, замена электрики и труб.',
      icon: Hammer,
      price: 'от 9 000 ₽/м²'
    },
    {
      title: 'Ремонт по дизайн-проекту',
      description: 'Реализация сложных архитектурных решений, теневые профили, крупноформатный керамогранит.',
      icon: Layout,
      price: 'от 14 000 ₽/м²'
    },
    {
      title: 'Черновая отделка (White Box)',
      description: 'Подготовка новостройки к чистовой отделке: возведение перегородок, штукатурка, разводка сетей.',
      icon: Wrench,
      price: 'от 6 000 ₽/м²',
      link: '/remont-novostroek'
    }
  ];

  return (
    <section id="services" className="section-padding bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Цены на ремонт в Екатеринбурге</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Мы регулярно анализируем рынок Екатеринбурга, чтобы предлагать адекватные цены при высоком качестве работ. Стоимость фиксируется в договоре.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-accent font-bold text-lg">{service.price}</span>
                  <div className="text-xs text-slate-400 mt-1">только за работу</div>
                </div>
                {service.link && (
                  <Link to={service.link} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors flex items-center gap-2">
                    Подробнее <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stages = () => {
  const stages = [
    {
      title: 'Демонтаж и перегородки',
      icon: Hammer,
      items: [
        'Снос старых конструкций (от 350 ₽/м²)', 
        'Вывоз мусора (от 4500 ₽/рейс)', 
        'Возведение новых стен (от 900 ₽/м²)'
      ]
    },
    {
      title: 'Инженерные сети',
      icon: Zap,
      items: [
        'Штробление стен (от 300 ₽/п.м.)', 
        'Прокладка электрокабеля (от 100 ₽/п.м.)', 
        'Разводка труб (от 3000 ₽/точка)', 
        'Сборка электрощита (от 5000 ₽)'
      ]
    },
    {
      title: 'Черновая отделка',
      icon: Ruler,
      items: [
        'Штукатурка стен по маякам (от 500 ₽/м²)', 
        'Заливка стяжки пола (от 600 ₽/м²)', 
        'Монтаж теплого пола (от 700 ₽/м²)', 
        'Шумоизоляция (от 800 ₽/м²)'
      ]
    },
    {
      title: 'Предчистовая (White Box)',
      icon: Droplets,
      items: [
        'Шпаклевка стен под обои (от 400 ₽/м²)', 
        'Монтаж гипсокартона (от 800 ₽/м²)', 
        'Установка подоконников (от 1500 ₽/шт)'
      ]
    },
    {
      title: 'Чистовая отделка',
      icon: Paintbrush,
      items: [
        'Укладка керамогранита (от 1200 ₽/м²)', 
        'Настил ламината (от 400 ₽/м²)', 
        'Поклейка обоев (от 300 ₽/м²)', 
        'Натяжные потолки (от 600 ₽/м²)'
      ]
    },
    {
      title: 'Завершение',
      icon: Sofa,
      items: [
        'Установка розеток (от 300 ₽/шт)', 
        'Монтаж санфаянса (от 2000 ₽/шт)', 
        'Установка плинтусов (от 200 ₽/п.м.)', 
        'Финальная уборка (бесплатно)'
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
              <div className="absolute left-[11px] top-10 bottom-[-2rem] w-[2px] bg-slate-100 md:hidden last:hidden"></div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-full relative z-10">
                <div className="absolute -left-4 md:-left-4 top-8 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg md:hidden">
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
                
                <ul className="space-y-3">
                  {stage.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5 shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BeforeAfterSlider: React.FC<{ project: any }> = ({ project }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    let clientX;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = (event as React.MouseEvent).clientX;
    }

    const x = clientX - containerRect.left;
    const width = containerRect.width;
    let newPosition = (x / width) * 100;
    
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      ref={containerRef}
      className="group relative overflow-hidden rounded-3xl aspect-[16/10] bg-slate-800 cursor-ew-resize select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background) */}
      <img 
        src={project.afterImage} 
        alt={`${project.title} - После`} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img 
          src={project.beforeImage} 
          alt={`${project.title} - До`} 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Overlay for "Before" text */}
        <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
          До
        </div>
      </div>

      {/* Overlay for "After" text */}
      <div className="absolute top-6 right-6 bg-accent/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider z-10 pointer-events-none">
        После
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-slate-100">
          <div className="flex gap-1.5">
            <div className="w-0.5 h-4 bg-slate-400 rounded-full"></div>
            <div className="w-0.5 h-4 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Project Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-8 flex flex-col justify-end z-30 pointer-events-none">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="text-white text-2xl font-bold mb-2">{project.title}</h4>
          <p className="text-slate-300 text-sm mb-3">{project.type}</p>
          <div className="inline-block bg-accent text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {project.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: 'ЖК "Клевер Парк"',
      type: 'Новостройка, Капитальный ремонт, 65 м²',
      price: 'Работа: 650 000 ₽',
      beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Академический район',
      type: 'Евротрешка, Ремонт от застройщика -> Комфорт, 80 м²',
      price: 'Работа: 720 000 ₽',
      beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Вторичка на Уралмаше',
      type: 'Хрущевка, Полный демонтаж и капремонт, 45 м²',
      price: 'Работа: 540 000 ₽',
      beforeImage: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'ЖК "Макаровский"',
      type: 'Дизайнерский ремонт, 110 м²',
      price: 'Работа: 1 650 000 ₽',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section id="portfolio" className="section-padding bg-slate-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Реальные объекты в Екб</h2>
            <p className="text-slate-400 max-w-xl">
              Проведите мышкой или пальцем по фотографии, чтобы увидеть разницу до и после ремонта.
            </p>
          </div>
          <button className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Больше проектов <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <BeforeAfterSlider key={idx} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const InteractiveCalculator = () => {
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
          <div className="p-8 lg:p-12 lg:w-3/5 space-y-10">
            
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
          <div className="bg-primary text-white p-8 lg:p-12 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Предварительный расчет</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70">Стоимость работ:</span>
                  <span className="font-bold text-lg">{totalWorkCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70">Черновые материалы:</span>
                  <span className="font-bold text-lg">{roughMaterialsCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center pb-4">
                  <span className="text-white/70 text-sm">Чистовые материалы (обои, плитка, ламинат):</span>
                  <span className="font-medium text-sm text-accent text-right">Покупаются отдельно<br/>под ваш вкус</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-white/70 mb-2">Итого (работа + черновые мат-лы):</div>
                <div className="text-4xl font-bold text-accent">
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

const Contact = () => {
  return (
    <section id="contact" className="section-padding w-full flex justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Свяжитесь с нами</h2>
            <p className="text-slate-600 mb-12 text-lg">
              Готовы начать ремонт вашей мечты? Оставьте заявку, и мы перезвоним вам в течение 15 минут для консультации.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <Phone className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Телефон</div>
                  <div className="text-xl font-bold">8-922-18-00-911</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <Send className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Telegram</div>
                  <a href="https://t.me/tonmeplz" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-accent transition-colors">@tonmeplz</a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <Mail className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Email</div>
                  <div className="text-xl font-bold">3536246@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-2xl font-bold mb-6">Оставить заявку на замер</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ваше имя</label>
                  <input 
                    type="text" 
                    placeholder="Иван"
                    className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Район (ЖК) или адрес</label>
                <input 
                  type="text"
                  placeholder="Например: Академический или ЖК Макаровский"
                  className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
              </div>
              <button className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20">
                Отправить заявку
              </button>
              <p className="text-center text-xs text-slate-400">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-lg">
                <Hammer className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">
                Дядя <span className="text-accent">Фёдор</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Профессиональный ремонт квартир и домов в Екатеринбурге и городах-спутниках. 
              Работаем с 2012 года.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Навигация</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="/#services" className="hover:text-accent transition-colors">Цены</a></li>
              <li><a href="/#stages" className="hover:text-accent transition-colors">Этапы работ</a></li>
              <li><a href="/#portfolio" className="hover:text-accent transition-colors">Портфолио</a></li>
              <li><a href="/#calculator" className="hover:text-accent transition-colors">Калькулятор</a></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Блог о ремонте</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Услуги</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/kosmeticheskiy-remont" className="hover:text-accent transition-colors">Косметический ремонт</Link></li>
              <li><Link to="/remont-novostroek" className="hover:text-accent transition-colors">Ремонт новостроек</Link></li>
              <li>Капитальный ремонт</li>
              <li>Дизайн интерьера</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Контакты</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="tel:89221800911" className="hover:text-white transition-colors">8-922-18-00-911</a></li>
              <li><a href="https://t.me/tonmeplz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram: @tonmeplz</a></li>
              <li><a href="mailto:3536246@gmail.com" className="hover:text-white transition-colors">3536246@gmail.com</a></li>
              <li>Пн-Вс: 09:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Дядя Фёдор. Все права защищены.</p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center">
            <span>ИНН: 660000000000</span>
            <span>ОГРНИП: 300000000000000</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const Home = () => (
  <>
    <Helmet>
      <title>Ремонт квартир в Екатеринбурге под ключ | Цены 2026 | Дядя Фёдор</title>
      <meta name="description" content="Профессиональный ремонт квартир в Екатеринбурге без посредников. Косметический от 4000 ₽/м², капитальный от 9000 ₽/м². Точная смета, договор, гарантия 3 года." />
    </Helmet>
    <Hero />
    <Services />
    <Stages />
    <InteractiveCalculator />
    <Portfolio />
    <Contact />
  </>
);

export default function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <div className="min-h-screen font-sans w-full overflow-x-hidden">
          <Navbar />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kosmeticheskiy-remont" element={<CosmeticRepair />} />
              <Route path="/remont-novostroek" element={<NewBuildingRepair />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </HelmetProvider>
  );
}
