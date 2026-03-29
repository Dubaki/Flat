import React from 'react';
import { ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '../ui/BeforeAfterSlider';

const Portfolio: React.FC = () => {
  const projects = [
    {
      title: 'Капитальный ремонт санузла',
      type: 'Полный цикл: от демонтажа до установки сантехники',
      price: 'Работа: 225 000 ₽',
      beforeImage: '/assets/projects/real1/before4.jpg',
      afterImage: '/assets/projects/real1/after2.jpg'
    },
    {
      title: 'Инженерные сети и отделка',
      type: 'Разводка коммуникаций и облицовка плиткой',
      price: 'Работа: 150 000 ₽',
      beforeImage: '/assets/projects/real1/before2.jpg',
      afterImage: '/assets/projects/real1/after3.jpg'
    },
    {
      title: 'Теплый пол и керамогранит',
      type: 'Монтаж системы отопления и финишное покрытие',
      price: 'Работа: 120 000 ₽',
      beforeImage: '/assets/projects/real1/before3.jpg',
      afterImage: '/assets/projects/real1/after5.jpg'
    },
    {
      title: 'Подготовка и финишная отделка',
      type: 'Штукатурка и монтаж санфаянса',
      price: 'Работа: 175 000 ₽',
      beforeImage: '/assets/projects/real1/before1.jpg',
      afterImage: '/assets/projects/real1/after4.jpg'
    }
  ];

  return (
    <section id="portfolio" className="section-padding bg-slate-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
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

export default Portfolio;
