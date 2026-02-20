import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Banners from './components/Banners';
import ProductGrid from './components/ProductGrid';
import TNSection from './components/TNSection';
import KidsSection from './components/KidsSection';
import ComboSection from './components/ComboSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SupportChat from './components/SupportChat';
import { CartProvider } from './context/CartContext';
import Admin from './pages/Admin';

const Store: React.FC = () => (
  <CartProvider>
    <div className="min-h-screen bg-white font-['Maven_Pro',sans-serif]">
      <Header />
      <main>
        <Hero />
        <Banners />
        <TNSection />
        <KidsSection />
        <ComboSection />
        <ProductGrid title="MAIS VENDIDOS DO DIA" />
      </main>
      <Footer />
      <CartDrawer />
      <SupportChat />
    </div>
  </CartProvider>
);

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

