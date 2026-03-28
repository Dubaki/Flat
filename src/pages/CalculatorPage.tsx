import React from 'react';
import { Helmet } from 'react-helmet-async';
import CalculatorHub from '../components/sections/CalculatorHub';

const CalculatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Калькулятор стоимости ремонта квартир в Екатеринбурге | Цены 2026</title>
        <meta name="description" content="Рассчитайте точную смету на ремонт квартиры, санузла или черновые работы онлайн. Получите PDF-расчет и зафиксируйте скидку 10% на материалы." />
      </Helmet>
      <div className="pt-20">
        <CalculatorHub />
      </div>
    </>
  );
};

export default CalculatorPage;
