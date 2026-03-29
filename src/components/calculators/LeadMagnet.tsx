import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Download } from 'lucide-react';
import { generateCalculatorPDF } from '../../utils/pdfGenerator';
import { reachGoal } from '../../utils/metrica';

interface LeadMagnetProps {
  totalEstimated: number;
  costs: { label: string; value: number }[];
  pdfData: {
    title: string;
    parameters: [string, string][];
    fileName: string;
  };
  onSuccess?: () => void;
}

const LeadMagnet: React.FC<LeadMagnetProps> = ({ totalEstimated, costs, pdfData, onSuccess }) => {
  const [phone, setPhone] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDownloadPDF = async () => {
    reachGoal('pdf_downloaded');
    const success = await generateCalculatorPDF({
      title: pdfData.title,
      phone: phone,
      parameters: pdfData.parameters,
      costs: costs.map(c => [c.label, `${c.value.toLocaleString('ru-RU')} ₽`]),
      total: `${totalEstimated.toLocaleString('ru-RU')} ₽`,
      fileName: pdfData.fileName
    });
    
    if (!success) alert('Ошибка при генерации PDF');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 18) {
      setError('Пожалуйста, введите полный номер телефона');
      return;
    }

    if (!agreed) {
      setError('Необходимо согласие на обработку данных');
      return;
    }

    setLoading(true);
    setError(null);

    const leadData = {
      type: 'calculator',
      phone,
      details: {
        calculatorTitle: pdfData.title,
        ...Object.fromEntries(pdfData.parameters),
        ...Object.fromEntries(costs.map(c => [c.label, `${c.value.toLocaleString('ru-RU')} ₽`])),
        totalEstimated: `${totalEstimated.toLocaleString('ru-RU')} ₽`
      }
    };

    try {
      const response = await fetch('/api/lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        setSubmitted(true);
        reachGoal('lead_captured');
        if (onSuccess) onSuccess();
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
    <div className="bg-primary text-white p-6 md:p-8 flex flex-col relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 flex-grow">
        <h3 className="text-xl font-bold mb-6">Предварительный расчет</h3>
        
        <div className="space-y-4 mb-6">
          {costs.map((cost, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-3 gap-4">
              <span className="text-white/70 text-sm">{cost.label}:</span>
              <span className="font-bold whitespace-nowrap text-sm">{cost.value.toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
          <div className="text-xs text-white/70 mb-1">Итого (работа + материалы):</div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent break-words">
            ~ {totalEstimated.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl">
              <p className="text-xs font-medium leading-relaxed text-center">
                🎁 Получите детальную смету в PDF и зафиксируйте 
                <span className="text-accent font-bold"> скидку 10% </span> на материалы!
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider">WhatsApp / Telegram / MAX</label>
                <input 
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-all text-sm`}
                />
                {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
              </div>

              <div className="flex items-start gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="privacy-calc" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent accent-accent shrink-0"
                />
                <label htmlFor="privacy-calc" className="text-[10px] text-white/50 leading-tight cursor-pointer">
                  Я согласен на обработку персональных данных в соответствии с <a href="/Flat/privacy" target="_blank" className="text-white/70 underline hover:text-accent transition-colors">политикой конфиденциальности</a>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>Отправка... <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Получить смету в PDF <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center animate-in fade-in zoom-in duration-500">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-accent w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold mb-2">Готово!</h4>
            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Смета сформирована. Скачайте её ниже:
            </p>
            <button 
              onClick={handleDownloadPDF}
              className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать смету (PDF)
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-6 text-center text-[9px] text-white/30 relative z-10 leading-tight uppercase tracking-wider">
        Конфиденциальность данных по 152-ФЗ
      </p>
    </div>
  );
};

export default LeadMagnet;
