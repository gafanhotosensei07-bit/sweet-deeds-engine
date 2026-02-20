import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Banners from './components/Banners';
import ProductGrid from './components/ProductGrid';
import TNSection from './components/TNSection';
import KidsSection from './components/KidsSection';
import ComboSection from './components/ComboSection';
import FemininoSection from './components/FemininoSection';
import MasculinoSection from './components/MasculinoSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SupportChat from './components/SupportChat';
import WelcomePopup from './components/WelcomePopup';
import { CartProvider } from './context/CartContext';
import Admin from './pages/Admin';
import { trackEvent } from './lib/analytics';

const Store: React.FC = () => {
  useEffect(() => {
    // Deduplicação: só tracka 1 page_view por sessão do navegador
    const key = 'we_pv_tracked';
    if (!sessionStorage.getItem(key)) {
      trackEvent('page_view');
      sessionStorage.setItem(key, '1');
    }
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-white font-['Maven_Pro',sans-serif]">
        <Header />
        <main>
          <Hero />
          <Banners />
          <TNSection />
          <FemininoSection />
          <MasculinoSection />
          <KidsSection />
          <ComboSection />
          <ProductGrid title="MAIS VENDIDOS DO DIA" />
        </main>
        <Footer />
        <CartDrawer />
        <SupportChat />
        <WelcomePopup />
      </div>
    </CartProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
