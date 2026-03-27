import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HashScrollLinkButtonProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const HashScrollLinkButton: React.FC<HashScrollLinkButtonProps> = ({ to, className, children, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    if (location.pathname !== '/') {
      window.scrollTo(0, 0); // Scroll to top before navigating
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(to);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default HashScrollLinkButton;
