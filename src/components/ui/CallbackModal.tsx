import React from 'react';
import { motion } from 'motion/react';
import { X, Phone } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8 lg:p-10">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
            <Phone className="text-accent w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Заказать звонок</h3>
          <p className="text-slate-500 mb-8">Оставьте ваши контакты, и мы перезвоним вам в течение 15 минут.</p>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); alert('Спасибо! Мы скоро свяжемся с вами.'); }}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ваше имя</label>
              <input 
                type="text" 
                required
                placeholder="Иван"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Телефон</label>
              <input 
                type="tel" 
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            </div>
            <button className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 mt-4">
              Жду звонка
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CallbackModal;
