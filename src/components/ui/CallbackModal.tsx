import React from 'react';
import { motion } from 'motion/react';
import { X, Phone } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [agreed, setAgreed] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('7') || value.startsWith('8')) {
      const numbers = value.substring(1);
      formatPhone(numbers);
    } else if (value.length > 0) {
      formatPhone(value);
    } else {
      setPhone('');
    }
  };

  const formatPhone = (numbers: string) => {
    let formatted = '+7 ';
    if (numbers.length > 0) formatted += '(' + numbers.substring(0, 3);
    if (numbers.length > 3) formatted += ') ' + numbers.substring(3, 6);
    if (numbers.length > 6) formatted += '-' + numbers.substring(6, 8);
    if (numbers.length > 8) formatted += '-' + numbers.substring(8, 10);
    
    if (numbers.length <= 10) setPhone(formatted);
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
      // Используем абсолютный путь для API, чтобы избежать проблем с BASE_URL
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'callback',
          name,
          phone
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setName('');
          setPhone('');
        }, 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при отправке');
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
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
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Спасибо за заявку!</h3>
              <p className="text-slate-500">Мы перезвоним вам в течение 15 минут.</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Заказать звонок</h3>
              <p className="text-slate-500 mb-8">Оставьте ваши контакты, и мы перезвоним вам в течение 15 минут.</p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ваше имя</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Телефон</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (999) 000-00-00"
                    className={`w-full px-5 py-4 rounded-xl bg-slate-50 border ${error && phone.length < 18 ? 'border-red-500' : 'border-slate-200'} focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all`}
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

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
                    Я согласен на обработку персональных данных в соответствии с <a href="/#/privacy" target="_blank" className="text-accent underline hover:text-accent/80 transition-colors">политикой конфиденциальности</a>
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
