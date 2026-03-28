import React from 'react';

interface HashScrollLinkButtonProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const HashScrollLinkButton: React.FC<HashScrollLinkButtonProps> = ({ to, className, children, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    
    const pathname = window.location.pathname;
    const isHomePage = pathname === '/Flat' || pathname === '/Flat/';

    if (!isHomePage) {
      window.location.href = `/Flat/#${to}`;
    } else {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = to;
      }
    }
  };

  return (
    <a href={`/Flat/#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default HashScrollLinkButton;
