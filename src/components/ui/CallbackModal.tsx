import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Send } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('7') || value.startsWith('8')) value = value.substring(1);
    
    let formatted = '+7 ';
    if (value.length > 0) formatted += '(' + value.substring(0, 3);
    if (value.length > 3) formatted += ') ' + value.substring(3, 6);
    if (value.length > 6) formatted += '-' + value.substring(6, 8);
    if (value.length > 8) formatted += '-' + value.substring(8, 10);
    
    if (value.length <= 10) setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 18) {
      setError('Введите полный номер телефона');
      return;
    }

    if (!agreed) {
      setError('Необходимо согласие на обработку данных');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, type: 'callback' }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Ошибка при отправке');
      }
    } catch (err) {
      setError('Не удалось отправить заявку. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-10">
          {submitted ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <Send className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 font-serif">Заявка принята!</h3>
              <p className="text-slate-600 mb-8">Инженер перезвонит вам в течение 30 минут.</p>
              <button 
                onClick={onClose}
                className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif">Заказать звонок</h3>
                <p className="text-slate-500 text-sm mt-2">Оставьте свой номер, и мы проконсультируем вас бесплатно.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Имя</label>
                  <input 
                    type="text" 
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Телефон</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all`}
                  />
                  {error && <p className="text-red-500 text-[10px] mt-1 ml-1">{error}</p>}
                </div>
                
                <button 
                  disabled={loading}
                  className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 mt-4 disabled:opacity-50"
                >
                  {loading ? 'Отправка...' : 'Жду звонка'}
                </button>
                
                <div className="flex items-start gap-3 mt-4">
                  <input 
                    type="checkbox" 
                    id="privacy-modal" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent accent-accent shrink-0"
                  />
                  <label htmlFor="privacy-modal" className="text-[9px] text-slate-400 leading-tight cursor-pointer">
                    Я согласен на обработку персональных данных в соответствии с <a href="/privacy" target="_blank" className="text-accent underline hover:text-accent/80 transition-colors">политикой конфиденциальности</a>
                  </label>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CallbackModal;
