import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Phone, Menu, X, Send } from 'lucide-react';
import CallbackModal from '../ui/CallbackModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = isScrolled || (pathname !== '/Flat' && pathname !== '/') || isMobileMenuOpen;

  const navLinks = [
    { name: 'Услуги', href: '/#services' },
    { name: 'Этапы', href: '/#stages' },
    { name: 'Портфолио', href: '/#portfolio' },
    { name: 'Квиз-смета', href: '/quiz' },
    { name: 'Блог', href: '/blog' },
    { name: 'Контакты', href: '/#contact' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md py-3 lg:py-4' : 'bg-transparent py-4 lg:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
          <a href="/" className="flex items-center gap-2 z-50 relative min-w-0">
            <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-lg shrink-0">
              <Hammer className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-bold truncate ${isSolid ? 'text-slate-900' : 'text-white'}`}>
              Дядя <span className="text-accent">Фёдор</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4">
              <a href="tel:89221800911" className={`hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`} title="Позвонить">
                <Phone className="w-5 h-5" />
              </a>
              <a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className={`hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`} title="Написать в Telegram / MAX">
                <Send className="w-5 h-5" />
              </a>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
            >
              Заказать звонок
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex lg:hidden items-center gap-4 z-50 relative">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isSolid ? 'text-slate-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl lg:hidden flex flex-col py-4 px-6 border-t border-slate-100"
            >
              <div className="flex flex-col gap-4 mb-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-lg font-medium text-slate-900 hover:text-accent transition-colors py-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              <div className="flex items-center gap-6 mb-6 pt-6 border-t border-slate-100">
                <a href="tel:89221800911" className="flex items-center gap-3 text-slate-900 hover:text-accent transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Позвонить</span>
                </a>
                <a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-900 hover:text-accent transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Telegram / MAX</span>
                </a>
              </div>
              
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                Заказать звонок
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isModalOpen && (
          <CallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
