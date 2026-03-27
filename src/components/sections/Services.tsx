import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Paintbrush, Hammer, Layout, Wrench, ArrowRight } from 'lucide-react';
import HashScrollLinkButton from '../ui/HashScrollLinkButton';

const Services: React.FC = () => {
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
      price: 'от 9 000 ₽/м²',
      link: 'contact'
    },
    {
      title: 'Ремонт по дизайн-проекту',
      description: 'Реализация сложных архитектурных решений, теневые профили, крупноформатный керамогранит.',
      icon: Layout,
      price: 'от 14 000 ₽/м²',
      link: 'contact'
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
              <div className="pt-6 border-t border-slate-50 flex flex-wrap items-center gap-4 mt-auto">
                <div className="flex-grow min-w-0">
                  <span className="text-accent font-bold text-lg whitespace-nowrap">{service.price}</span>
                  <div className="text-xs text-slate-400 mt-1">только за работу</div>
                </div>
                {service.link && (
                  service.link.startsWith('/') ? (
                    <Link to={service.link} className="w-full sm:w-auto bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                      Подробнее <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <HashScrollLinkButton to={service.link} className="w-full sm:w-auto bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                      Подробнее <ArrowRight className="w-4 h-4" />
                    </HashScrollLinkButton>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
