import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { robotoBase64 } from '../../utils/pdfFonts';

type RepairType = 'cosmetic' | 'capital' | 'design';

const InteractiveCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(50);
  const [buildingType, setBuildingType] = useState<'new' | 'old'>('new');
  const [repairType, setRepairType] = useState<RepairType>('capital');
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [replaceScreed, setReplaceScreed] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const rates: Record<RepairType, number> = {
    cosmetic: 4000,
    capital: 9000,
    design: 15000
  };

  const buildingMultiplier = buildingType === 'old' ? 1.2 : 1;
  const screedWorkRate = (replaceScreed && buildingType === 'new') ? 1100 : 0;
  const screedMaterialRate = (replaceScreed && buildingType === 'new') ? 700 : 0;
  const extraBathroomLabor = (bathrooms - 1) * 90000;
  const extraBathroomMaterials = (bathrooms - 1) * 45000;
  
  const baseWorkCost = (area * (rates[repairType] + screedWorkRate)) * buildingMultiplier;
  const totalWorkCost = Math.round(baseWorkCost + extraBathroomLabor);
  const roughMaterialRatio = repairType === 'cosmetic' ? 0.2 : 0.45;
  const baseRoughMaterials = (area * rates[repairType] * buildingMultiplier) * roughMaterialRatio;
  const extraRoughMaterials = (area * screedMaterialRate) + extraBathroomMaterials;
  const roughMaterialsCost = Math.round(baseRoughMaterials + extraRoughMaterials);
  const totalEstimated = totalWorkCost + roughMaterialsCost;

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Добавляем поддержку кириллицы через шрифт Roboto
      doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      
      doc.setFont("Roboto", "normal");
      doc.setFontSize(22);
      doc.text('СМЕТА НА РЕМОНТ - FLAT', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 105, 28, { align: 'center' });
      doc.text(`Телефон клиента: ${phone}`, 105, 34, { align: 'center' });

      const projectData = [
        ['Тип жилья', buildingType === 'new' ? 'Новостройка' : 'Вторичное жилье'],
        ['Вид ремонта', repairType === 'cosmetic' ? 'Косметический' : repairType === 'capital' ? 'Капитальный' : 'Дизайнерский'],
        ['Площадь', `${area} кв.м.`],
        ['Санузлы', bathrooms.toString()],
        ['Замена стяжки', replaceScreed ? 'Да' : 'Нет']
      ];

      autoTable(doc, {
        startY: 45,
        head: [['Параметр объекта', 'Значение']],
        body: projectData,
        styles: { font: 'Roboto' },
        headStyles: { fillColor: [37, 99, 235], font: 'Roboto' },
      });

      const costData = [
        ['Стоимость работ', `${totalWorkCost.toLocaleString('ru-RU')} руб.`],
        ['Черновые материалы', `${roughMaterialsCost.toLocaleString('ru-RU')} руб.`],
        ['Итоговая стоимость (ориентир)', `${totalEstimated.toLocaleString('ru-RU')} руб.`]
      ];

      const lastY = (doc as any).lastAutoTable?.finalY || 100;

      autoTable(doc, {
        startY: lastY + 10,
        head: [['Категория расходов', 'Сумма']],
        body: costData,
        styles: { font: 'Roboto' },
        headStyles: { fillColor: [30, 41, 59], font: 'Roboto' },
        foot: [['ИТОГО', `${totalEstimated.toLocaleString('ru-RU')} руб.`]],
        footStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], font: 'Roboto' }
      });

      const finalY = (doc as any).lastAutoTable?.finalY + 20;
      doc.setFontSize(14);
      doc.text('Свяжитесь с нами для начала работы:', 20, finalY + 10);
      
      doc.setFontSize(11);
      doc.text('Телефон: 8-922-18-00-911', 20, finalY + 20);
      doc.text('Telegram: @Mebabanza', 20, finalY + 28);
      doc.text('Email: 3536246@gmail.com', 20, finalY + 36);
      
      doc.setFontSize(8);
      doc.text('Данный расчет является предварительным и может измениться после осмотра объекта инженером.', 20, finalY + 50);

      doc.save(`smeta_flat_${area}m2.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Произошла ошибка при генерации PDF. Мы уже работаем над исправлением.');
    }
  };

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
      setError('Пожалуйста, введите полный номер телефона');
      return;
    }

    setLoading(true);
    setError(null);

    const leadData = {
      type: 'calculator',
      phone,
      details: {
        area,
        buildingType: buildingType === 'new' ? 'Новостройка' : 'Вторичка',
        repairType: repairType === 'cosmetic' ? 'Косметический' : repairType === 'capital' ? 'Капитальный' : 'Дизайнерский',
        bathrooms,
        replaceScreed: replaceScreed ? 'Да' : 'Нет',
        totalEstimated: `${totalEstimated.toLocaleString('ru-RU')} ₽`
      }
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Ошибка при отправке');
      }
    } catch (err) {
      setError('Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="calculator" className="section-padding bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Калькулятор ремонта</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Рассчитайте ориентировочную стоимость ремонта в Екатеринбурге и получите детальную смету.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="p-6 md:p-8 lg:p-12 lg:w-3/5 space-y-8 lg:space-y-10">
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-lg text-slate-800">Площадь квартиры</label>
                <div className="text-2xl font-bold text-accent">{area} м²</div>
              </div>
              <input 
                type="range" 
                min="20" 
                max="150" 
                step="1"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>20 м²</span>
                <span>150 м²</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="font-bold text-lg text-slate-800 block mb-4">Тип жилья</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setBuildingType('new')}
                    className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${buildingType === 'new' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Новостройка
                  </button>
                  <button 
                    onClick={() => {
                      setBuildingType('old');
                      setReplaceScreed(false);
                    }}
                    className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${buildingType === 'old' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Вторичка
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-lg text-slate-800 block mb-4">Кол-во санузлов</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((num) => (
                    <button 
                      key={num}
                      onClick={() => setBathrooms(num)}
                      className={`py-4 rounded-xl border-2 font-semibold transition-all ${bathrooms === num ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {buildingType === 'new' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block">Меняем стяжку от застройщика?</label>
                    <p className="text-xs text-slate-500 mt-1">Рекомендуется при наличии трещин и пустот</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setReplaceScreed(true)}
                      className={`px-6 py-2 rounded-lg font-bold transition-all ${replaceScreed ? 'bg-accent text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                    >
                      Да
                    </button>
                    <button 
                      onClick={() => setReplaceScreed(false)}
                      className={`px-6 py-2 rounded-lg font-bold transition-all ${!replaceScreed ? 'bg-slate-400 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                    >
                      Нет
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-lg text-slate-800 block mb-4">Вид ремонта</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setRepairType('cosmetic')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'cosmetic' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Косметический ремонт
                </button>
                <button 
                  onClick={() => setRepairType('capital')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'capital' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Капитальный ремонт
                </button>
                <button 
                  onClick={() => setRepairType('design')}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all text-sm ${repairType === 'design' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Дизайнерский ремонт
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white p-6 md:p-8 lg:p-12 lg:w-2/5 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex-grow">
              <h3 className="text-2xl font-bold mb-8">Предварительный расчет</h3>
              
              <div className="space-y-6 mb-8 text-sm sm:text-base">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 gap-4">
                  <span className="text-white/70">Стоимость работ:</span>
                  <span className="font-bold whitespace-nowrap">{totalWorkCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4 gap-4">
                  <span className="text-white/70">Черновые материалы:</span>
                  <span className="font-bold whitespace-nowrap">{roughMaterialsCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-10 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-white/70 mb-2">Итого (работа + материалы):</div>
                <div className="text-3xl sm:text-4xl font-bold text-accent">
                  ~ {totalEstimated.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              {!submitted ? (
                <div className="space-y-6">
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl">
                    <p className="text-sm font-medium leading-relaxed text-center">
                      🎁 Сохраните смету и забронируйте 
                      <span className="text-accent"> скидку 10% </span> на материалы!
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-white/50 uppercase font-bold tracking-wider">Ваш телефон</label>
                      <input 
                        type="tel"
                        required
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={handlePhoneChange}
                        className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                      />
                      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent text-white py-5 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>Отправка... <Loader2 className="w-5 h-5 animate-spin" /></>
                      ) : (
                        <>Получить расчет в Telegram <Send className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-accent w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Готово!</h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Мы подготовили вашу подробную смету на русском языке. Вы можете скачать её прямо сейчас.
                  </p>
                  <button 
                    onClick={generatePDF}
                    className="w-full bg-white text-primary py-4 rounded-xl font-bold text-base hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Скачать смету (PDF)
                  </button>
                </div>
              )}
            </div>
            
            <p className="mt-8 text-center text-[10px] text-white/30 relative z-10 leading-tight">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCalculator;
