import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Hammer, Phone, Menu, X, Send } from 'lucide-react';
import HashScrollLinkButton from '../ui/HashScrollLinkButton';

interface NavbarProps {
  onOpenModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Header should be solid if we are not on the home page or if we have scrolled
  const isSolid = isScrolled || location.pathname !== '/' || isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '/#services' },
    { name: 'Этапы', href: '/#stages' },
    { name: 'Портфолио', href: '/#portfolio' },
    { name: 'Калькулятор', href: '/#calculator' },
    { name: 'Блог', href: '/blog' },
    { name: 'Контакты', href: '/#contact' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md py-3 lg:py-4' : 'bg-transparent py-4 lg:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 z-50 relative min-w-0">
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
            link.href.startsWith('/#') ? (
              <HashScrollLinkButton 
                key={link.name} 
                to={link.href.substring(2)} 
                className={`text-sm font-medium hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}
              >
                {link.name}
              </HashScrollLinkButton>
            ) : (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-medium hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="flex items-center gap-4">
            <a href="tel:89221800911" className={`hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`} title="Позвонить">
              <Phone className="w-5 h-5" />
            </a>
            <a href="https://t.me/Mebabanza" target="_blank" rel="noopener noreferrer" className={`hover:text-accent transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`} title="Написать в Telegram">
              <Send className="w-5 h-5" />
            </a>
          </div>
          <button 
            onClick={onOpenModal}
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
                link.href.startsWith('/#') ? (
                  <HashScrollLinkButton 
                    key={link.name} 
                    to={link.href.substring(2)} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-900 hover:text-accent transition-colors py-2"
                  >
                    {link.name}
                  </HashScrollLinkButton>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-900 hover:text-accent transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                )
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
                <span className="font-medium">Telegram</span>
              </a>
            </div>
            
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModal();
              }}
              className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
            >
              Заказать звонок
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
