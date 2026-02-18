import React from 'react';

const Header = () => {
  return (
    <header className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black uppercase tracking-tight">
          🐘 White Elephant
        </span>
        <span className="text-[#f39b19] font-bold text-sm uppercase tracking-widest">
          Multimarcas
        </span>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-semibold">
        <a href="#" className="hover:text-[#f39b19] transition-colors">Início</a>
        <a href="#" className="hover:text-[#f39b19] transition-colors">Tênis</a>
        <a href="#" className="hover:text-[#f39b19] transition-colors">Combos</a>
        <a href="#" className="hover:text-[#f39b19] transition-colors">Contato</a>
      </nav>
      <button className="bg-[#f39b19] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d68910] transition-colors">
        🛒 Carrinho
      </button>
    </header>
  );
};

export default Header;
