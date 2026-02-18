import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-black uppercase mb-3">🐘 White Elephant</h3>
            <p className="text-gray-400 text-sm">
              Tênis premium das melhores marcas com os melhores preços do Brasil.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase mb-3 text-[#f39b19]">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#f39b19] transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-[#f39b19] transition-colors">Promoções</a></li>
              <li><a href="#" className="hover:text-[#f39b19] transition-colors">Política de Troca</a></li>
              <li><a href="#" className="hover:text-[#f39b19] transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase mb-3 text-[#f39b19]">Pagamentos</h4>
            <p className="text-gray-400 text-sm">
              Aceitamos Pix, cartões de crédito e débito. Parcelamos em até 12x sem juros.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} White Elephant Multimarcas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
