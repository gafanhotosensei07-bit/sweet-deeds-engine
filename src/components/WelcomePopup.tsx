import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Truck, CreditCard, Star } from 'lucide-react';

const WelcomePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('welcome_popup_seen');
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('welcome_popup_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header laranja */}
        <div className="bg-[#f39b19] px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392116568-0.png"
            alt="White Elephant Logo"
            className="h-10 sm:h-14 mx-auto mb-2 sm:mb-3 brightness-0 invert"
          />
          <h2 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
            Bem-vindo à<br />White Elephant! 🐘
          </h2>
          <p className="text-white/90 text-sm mt-2 font-medium">
            Os melhores tênis com os melhores preços
          </p>
        </div>

        {/* Onda decorativa */}
        <div className="bg-[#f39b19] h-4 relative">
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[50%]" />
        </div>

        {/* Conteúdo */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6">
          <p className="text-gray-600 text-sm text-center mb-5">
            Aqui você encontra Nike, Adidas, Vans e muito mais com frete expresso para todo o Brasil!
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <CreditCard className="h-5 w-5 text-[#f39b19] shrink-0" />
              <span className="text-xs font-bold text-gray-700">10% de desconto no PIX</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <Truck className="h-5 w-5 text-[#f39b19] shrink-0" />
              <span className="text-xs font-bold text-gray-700">Frete Expresso</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <ShieldCheck className="h-5 w-5 text-[#f39b19] shrink-0" />
              <span className="text-xs font-bold text-gray-700">Compra Segura</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <Star className="h-5 w-5 text-[#f39b19] shrink-0" />
              <span className="text-xs font-bold text-gray-700">Satisfação Garantida</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-[#f39b19] hover:bg-black text-white hover:text-white font-black uppercase tracking-widest text-sm py-3 rounded-xl transition-colors duration-200"
          >
            Quero Aproveitar! 🔥
          </button>

          <p className="text-center text-xs text-gray-400 mt-3 cursor-pointer hover:text-gray-600" onClick={handleClose}>
            Agora não
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
