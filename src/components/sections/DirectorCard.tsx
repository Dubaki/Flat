import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const DirectorCard: React.FC = () => {
  return (
    <div className="relative max-w-sm mx-auto lg:ml-auto lg:mr-0 xl:mr-10 mt-10 lg:mt-0">
      {/* Декоративный фон */}
      <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-2xl transform -rotate-3"></div>
      
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[2rem] shadow-2xl">
        <div className="relative overflow-hidden rounded-t-[1.75rem] rounded-b-xl aspect-[4/5] bg-slate-800">
          <img 
            src={`${import.meta.env.BASE_URL}alex.png`}
            alt="Александр - руководитель" 
            className="w-full h-full object-cover object-top"
          />
          {/* Плашка должности снизу поверх фото */}
          <div className="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Основатель
          </div>
        </div>
        
        <div className="p-6 text-white text-left">
          <h4 className="font-bold text-xl mb-1">Александр Олегович</h4>
          <p className="text-accent text-sm font-semibold mb-4">Руководитель компании</p>
          <div className="h-px w-full bg-white/10 mb-4"></div>
          <p className="text-sm text-white/80 leading-relaxed italic">
            «Я лично контролирую каждый объект. Мы работаем прозрачно, не занижаем сметы для заманивания и отвечаем за качество.»
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectorCard;
