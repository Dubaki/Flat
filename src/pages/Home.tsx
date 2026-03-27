import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Stages from '../components/sections/Stages';
import InteractiveCalculator from '../components/sections/InteractiveCalculator';
import Portfolio from '../components/sections/Portfolio';
import Contact from '../components/sections/Contact';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ремонт квартир в Екатеринбурге под ключ | Цены 2026 | Дядя Фёдор</title>
        <meta name="description" content="Профессиональный ремонт квартир в Екатеринбурге без посредников. Косметический от 4000 ₽/м², капитальный от 9000 ₽/м². Точная смета, договор, гарантия 3 года." />
      </Helmet>
      <Hero />
      <Services />
      <Stages />
      <InteractiveCalculator />
      <Portfolio />
      <Contact />
    </>
  );
};

export default Home;
