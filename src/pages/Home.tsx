import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Stages from '../components/sections/Stages';
import CalculatorHub from '../components/sections/CalculatorHub';
import Portfolio from '../components/sections/Portfolio';
import Contact from '../components/sections/Contact';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ремонт квартир в Екатеринбурге под ключ | Цены 2026 | Дядя Фёдор</title>
        <meta name="description" content="Профессиональный ремонт квартир в Екатеринбурге без посредников. Косметический от 7500 ₽/м², капитальный от 14500 ₽/м². Точная смета, договор, гарантия 3 года." />
      </Helmet>
      <Hero />
      <section id="services"><Services /></section>
      <section id="stages"><Stages /></section>
      <CalculatorHub />
      <Portfolio />
      <Contact />
    </>
  );
};

export default Home;
