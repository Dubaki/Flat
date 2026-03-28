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
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name,
          phone,
          address
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setName('');
        setPhone('');
        setAddress('');
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
    <section id="contact" className="section-padding w-full flex justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Свяжитесь с нами</h2>
            <p className="text-slate-600 mb-12 text-lg">
              Готовы начать ремонт вашей мечты? Оставьте заявку, и мы перезвоним вам в течение 15 минут для консультации.
            </p>

            <div className="space-y-8">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Телефон</div>
                  <div className="text-lg sm:text-xl font-bold break-words">8-922-18-00-911</div>
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Send className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Telegram / MAX</div>
                  <a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl font-bold hover:text-accent transition-colors break-words">@Mebabanza</a>
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Email</div>
                  <div className="text-lg sm:text-xl font-bold break-words">3536246@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Заявка отправлена!</h3>
                <p className="text-slate-600 text-lg">Спасибо за доверие. Специалист свяжется с вами в ближайшее время.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-accent font-bold hover:underline"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold mb-6">Оставить заявку на замер</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Ваше имя</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван"
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Телефон</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (___) ___-__-__"
                      className={`w-full px-5 py-4 rounded-xl bg-white border ${error && phone.length < 18 ? 'border-red-500' : 'border-slate-200'} focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Район (ЖК) или адрес</label>
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Например: Академический или ЖК Макаровский"
                    className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

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
                    Я согласен на обработку персональных данных в соответствии с <a href="/Flat/privacy" target="_blank" className="text-accent underline hover:text-accent/80 transition-colors">политикой конфиденциальности</a>
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
