import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Calculator, ListChecks, Phone, Images } from 'lucide-react';

const tabs = [
  { name: 'Домой',      href: '/',           icon: Home        },
  { name: 'Рассчитать', href: '/quiz',        icon: Calculator  },
  { name: 'Этапы',      href: '/#stages',     icon: ListChecks  },
  { name: 'Портфолио',  href: '/#portfolio',  icon: Images      },
  { name: 'Контакты',   href: '/#contact',    icon: Phone       },
];

const MobileTabBar: React.FC = () => {
  const [active, setActive] = useState('');

  useEffect(() => {
    setActive(window.location.pathname);
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(197,160,89,0.18)',
        boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch justify-around px-1 pt-1 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === '/'
              ? active === '/' || active === ''
              : active.startsWith(tab.href.replace('/#', '').split('/')[0] || '');
          return (
            <a
              key={tab.name}
              href={tab.href}
              onClick={() => setActive(tab.href)}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-1.5 relative group select-none"
              style={{ minWidth: 0, textDecoration: 'none' }}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-x-1 top-0 h-0.5 rounded-b-full"
                  style={{ background: '#c5a059' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
                style={{
                  background: isActive ? 'rgba(197,160,89,0.13)' : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? '#c5a059' : '#94a3b8' }}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </motion.div>
              <span
                className="text-[10px] font-semibold leading-none transition-colors"
                style={{ color: isActive ? '#c5a059' : '#94a3b8' }}
              >
                {tab.name}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
