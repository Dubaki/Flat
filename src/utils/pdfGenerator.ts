import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { robotoBase64 } from './pdfFonts';

interface PDFData {
  title: string;
  phone: string;
  parameters: [string, string][];
  costs: [string, string][];
  total: string;
  fileName: string;
}

export const generateCalculatorPDF = async (data: PDFData) => {
  try {
    const doc = new jsPDF();
    
    // Добавляем поддержку кириллицы через шрифт Roboto
    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    
    doc.setFont("Roboto", "normal");
    doc.setFontSize(22);
    doc.text(data.title, 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 105, 28, { align: 'center' });
    doc.text(`Телефон клиента: ${data.phone}`, 105, 34, { align: 'center' });

    autoTable(doc, {
      startY: 45,
      head: [['Параметр объекта', 'Значение']],
      body: data.parameters,
      styles: { font: 'Roboto' },
      headStyles: { fillColor: [37, 99, 235], font: 'Roboto' },
    });

    const lastY = (doc as any).lastAutoTable?.finalY || 100;

    autoTable(doc, {
      startY: lastY + 10,
      head: [['Категория расходов', 'Сумма']],
      body: data.costs,
      styles: { font: 'Roboto' },
      headStyles: { fillColor: [30, 41, 59], font: 'Roboto' },
      foot: [['ИТОГО', data.total]],
      footStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], font: 'Roboto' }
    });

    const finalY = (doc as any).lastAutoTable?.finalY + 20;
    doc.setFontSize(14);
    doc.text('Свяжитесь с нами для начала работы:', 20, finalY + 10);
    
    doc.setFontSize(11);
    doc.text('Телефон: 8-922-18-00-911', 20, finalY + 20);
    doc.text('Telegram / MAX: @Mebabanza', 20, finalY + 28);
    doc.text('Email: 3536246@gmail.com', 20, finalY + 36);
    
    doc.setFontSize(8);
    doc.text('Данный расчет является предварительным и может измениться после осмотра объекта инженером.', 20, finalY + 50);

    doc.save(data.fileName);
    return true;
  } catch (err) {
    console.error('PDF Error:', err);
    return false;
  }
};
