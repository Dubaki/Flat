import React from 'react';
import { Phone, Send, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      const response = await fetch('/api/lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, type: 'contact' }),
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
    <section id="contact" className="section-padding bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          <div className="lg:w-1/2 bg-primary p-10 md:p-16 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">Готовы обсудить ваш проект?</h2>
              <p className="text-white/60 mb-12 text-lg">
                Оставьте заявку на бесплатный выезд инженера. Мы проведем замер, проконсультируем по материалам и составим предварительную смету.
              </p>
              
              <div className="space-y-8 mt-auto font-sans">
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="text-accent w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Телефон</div>
                    <a href="tel:89221800911" className="text-lg sm:text-xl font-bold hover:text-accent transition-colors">8-922-18-00-911</a>
                  </div>
                </div>
                
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Send className="text-accent w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Telegram / MAX</div>
                    <a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl font-bold hover:text-accent transition-colors break-words">@Mebabanza</a>
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="text-accent w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Email</div>
                    <a href="mailto:3536246@gmail.com" className="text-lg sm:text-xl font-bold hover:text-accent transition-colors break-words">3536246@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900 font-serif">Заявка принята!</h3>
                <p className="text-slate-600 mb-8 text-lg">Инженер перезвонит вам в течение 30 минут для уточнения деталей.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-accent font-bold hover:underline"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Как вас зовут?</label>
                  <input 
                    type="text" 
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Номер телефона</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all text-lg`}
                  />
                  {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Адрес объекта (необязательно)</label>
                  <input 
                    type="text" 
                    placeholder="Район или улица"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all text-lg"
                  />
                </div>
                
                <button 
                  disabled={loading}
                  className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
                >
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </button>
                
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="privacy-contact" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent accent-accent shrink-0"
                  />
                  <label htmlFor="privacy-contact" className="text-[10px] text-slate-400 leading-tight cursor-pointer">
                    Я согласен на обработку персональных данных в соответствии с <a href="/privacy" target="_blank" className="text-accent underline hover:text-accent/80 transition-colors">политикой конфиденциальности</a>
                  </label>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
