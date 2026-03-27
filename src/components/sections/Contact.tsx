import React from 'react';
import { Phone, Send, Mail } from 'lucide-react';

const Contact: React.FC = () => {
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
                  <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Telegram</div>
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

export default Contact;
