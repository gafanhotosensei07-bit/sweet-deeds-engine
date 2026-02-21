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
    // Deduplicação: 1 page_view por janela de 30 minutos por navegador
    const key = 'we_pv_ts';
    const TTL = 30 * 60 * 1000; // 30 minutos
    const last = parseInt(localStorage.getItem(key) || '0', 10);
    if (Date.now() - last > TTL) {
      trackEvent('page_view');
      localStorage.setItem(key, String(Date.now()));
    }
  }, []);

  return (
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
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
