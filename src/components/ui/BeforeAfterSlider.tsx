import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface BeforeAfterSliderProps {
  project: {
    title: string;
    type: string;
    price: string;
    beforeImage: string;
    afterImage: string;
  };
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ project }) => {
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
      className="group relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/10] bg-slate-800 cursor-ew-resize select-none"
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
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4 sm:p-8 flex flex-col justify-end z-30 pointer-events-none">
        <div className="sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="text-white text-base sm:text-2xl font-bold mb-1 sm:mb-2">{project.title}</h4>
          <p className="text-slate-300 text-xs sm:text-sm mb-2 sm:mb-3">{project.type}</p>
          <div className="inline-block whitespace-nowrap bg-accent text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-bold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {project.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterSlider;
