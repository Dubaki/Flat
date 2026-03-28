import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'motion/react';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import CookieConsent from './components/ui/CookieConsent';
import CallbackModal from './components/ui/CallbackModal';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CosmeticRepair from './pages/CosmeticRepair';
import NewBuildingRepair from './pages/NewBuildingRepair';
import CalculatorPage from './pages/CalculatorPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <HelmetProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen font-sans w-full overflow-x-hidden break-words">
          <Navbar onOpenModal={() => setIsModalOpen(true)} />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kosmeticheskiy-remont" element={<CosmeticRepair />} />
              <Route path="/remont-novostroek" element={<NewBuildingRepair />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
          <AnimatePresence>
            {isModalOpen && (
              <CallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </HashRouter>
    </HelmetProvider>
  );
}
