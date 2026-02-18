import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#f39b19] text-white text-center py-2 text-sm font-medium overflow-hidden">
        <div className="flex justify-center gap-8 animate-pulse">
          <span>Loja 100% Segura</span>
          <span className="hidden md:inline">Parcele em até 12x</span>
          <span className="hidden lg:inline">Frete Expresso e Garantido para todo Brasil</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <button className="md:hidden text-2xl">☰</button>
            <a href="/" className="flex items-center">
              <img 
                src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392116568-0.png" 
                alt="White Elephant Logo" 
                className="h-12 md:h-16"
              />
            </a>
            <div className="md:hidden relative">
              <span className="absolute -top-2 -right-2 bg-[#f39b19] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 max-w-xl w-full">
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

          <div className="hidden md:flex items-center gap-6">
            <div className="text-sm">
              <p className="font-bold">Precisa de ajuda?</p>
              <a href="#" className="text-[#f39b19]">(11) 2115-4200</a>
            </div>
            <div className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="text-xs">
                <p>Entre ou</p>
                <p className="font-bold">cadastre-se</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-black text-white hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-8 py-3 text-xs font-bold uppercase tracking-wider">
            <li><a href="#" className="hover:text-[#f39b19]">2 POR R$200 - LANÇAMENTOS</a></li>
            <li><a href="#" className="hover:text-[#f39b19]">NUMERAÇÃO ESPECIAL - 44 E 45</a></li>
            <li><a href="#" className="hover:text-[#f39b19]">Todos os Modelos</a></li>
            <li><a href="#" className="hover:text-[#f39b19]">Mais Vendidos</a></li>
            <li><a href="#" className="hover:text-[#f39b19]">Feminino</a></li>
            <li><a href="#" className="hover:text-[#f39b19]">Masculino</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
