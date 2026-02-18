import React from 'react';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import TrustBar from './components/TrustBar';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-['Maven_Pro',sans-serif]">
      <TopBanner />
      <Header />
      <main>
        <TrustBar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-black text-white p-8 rounded-xl text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase italic">
              Promoção de Lançamento
            </h1>
            <p className="text-lg md:text-xl font-bold text-[#f39b19]">
              Tênis Premium com até 60% de Desconto
            </p>
          </div>
        </div>
        <ProductGrid title="MONTE SEU COMBO COM DESCONTO AUTOMÁTICO" />
        <ProductGrid title="MAIS VENDIDOS DO DIA" />
      </main>
      <Footer />
    </div>
  );
}

export default App;
