import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X } from 'lucide-react';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const NAV_LINKS = [
  { label: '2 POR R$200 - LANÇAMENTOS', target: 'section-mais-vendidos' },
  { label: 'NIKE TN IMPORTADOS', target: 'section-tn' },
  { label: 'Todos os Modelos', target: 'section-mais-vendidos' },
  { label: 'Mais Vendidos', target: 'section-mais-vendidos' },
  { label: 'Feminino', target: 'section-feminino' },
  { label: 'Masculino', target: 'section-masculino' },
  { label: 'Infantil', target: 'section-kids' },
  { label: 'Monte seu Combo', target: '' },
];

const Header: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (target: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(target), 100);
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#f39b19] text-white text-center py-1.5 md:py-2 text-[10px] md:text-sm font-medium overflow-hidden">
        <div className="flex justify-center gap-4 md:gap-8 px-2">
          <span>Loja 100% Segura</span>
          <span className="hidden md:inline">Parcele em até 12x</span>
          <span className="hidden lg:inline">Frete Expresso e Garantido para todo Brasil</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-4 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(true)} aria-label="Menu">☰</button>
            <a href="/" className="flex items-center">
              <img 
                src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392116568-0.png" 
                alt="White Elephant Logo" 
                className="h-10 md:h-16"
              />
            </a>
          </div>

          <div className="hidden md:block flex-1 max-w-xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Olá, o que você procura?" 
                className="w-full border rounded-full py-2 px-6 focus:outline-none focus:ring-2 focus:ring-[#f39b19]"
              />
              <button className="absolute right-4 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Suporte"]')?.click()}
              className="hidden md:flex items-center gap-2 bg-[#f39b19] text-black px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 1 1 0-2 6 6 0 1 1 12 0 1 1 0 1 1 0 2v4a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H9a1 1 0 0 1 0-2h1v-1H8z"/>
              </svg>
              Suporte
            </button>
            <div className="hidden md:flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="text-xs">
                <p>Entre ou</p>
                <p className="font-bold">cadastre-se</p>
              </div>
            </div>
            {/* Cart button */}
            <button onClick={openCart} className="relative flex items-center gap-2 hover:text-[#f39b19] transition-colors">
              <div className="relative">
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f39b19] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black">{totalItems}</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="hidden md:block text-xs text-left">
                <p className="text-gray-500">Meu</p>
                <p className="font-bold">Carrinho</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-3 pb-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Olá, o que você procura?" 
              className="w-full border rounded-full py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f39b19]"
            />
            <button className="absolute right-4 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-black text-white hidden md:block overflow-x-auto">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-4 lg:gap-8 py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-mais-vendidos'); }} className="hover:text-[#f39b19]">2 POR R$200</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-tn'); }} className="hover:text-[#f39b19]">NIKE TN</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-mais-vendidos'); }} className="hover:text-[#f39b19]">Todos os Modelos</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-mais-vendidos'); }} className="hover:text-[#f39b19]">Mais Vendidos</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-feminino'); }} className="hover:text-[#f39b19]">Feminino</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollTo('section-masculino'); }} className="hover:text-[#f39b19]">Masculino</a></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-[280px] z-[101] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="bg-black px-5 py-4 flex items-center justify-between">
              <img 
                src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392116568-0.png" 
                alt="White Elephant Logo" 
                className="h-8 invert"
              />
              <button onClick={() => setMenuOpen(false)} className="text-white hover:text-[#f39b19]">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.target)}
                  className="w-full text-left px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-gray-800 hover:bg-[#f39b19]/10 hover:text-[#f39b19] transition-colors border-b border-gray-100"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  document.querySelector<HTMLButtonElement>('[aria-label="Suporte"]')?.click();
                }}
                className="w-full bg-[#f39b19] text-black py-3 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Fale com o Suporte
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
