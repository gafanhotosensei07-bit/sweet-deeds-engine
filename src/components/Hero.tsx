import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full">
      <div className="relative w-full max-h-[280px] sm:max-h-[360px] md:max-h-[450px] overflow-hidden">
        <img 
          src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392117854-1.jpeg" 
          alt="Carnaval Promo" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="bg-gray-100 py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col items-center text-center">
            <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392118941-2.png" alt="Cartão" className="h-10 mb-2" />
            <p className="text-xs font-bold uppercase">Pague parcelado</p>
            <p className="text-[10px] text-gray-600">Até 12x no cartão</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392119649-3.png" alt="Entrega" className="h-10 mb-2" />
            <p className="text-xs font-bold uppercase">Entrega garantida</p>
            <p className="text-[10px] text-gray-600">Com código de rastreio</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392120959-4.png" alt="Seguro" className="h-10 mb-2" />
            <p className="text-xs font-bold uppercase">Compra 100% segura</p>
            <p className="text-[10px] text-gray-600">Dados protegidos</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392121410-5.png" alt="Troca" className="h-10 mb-2" />
            <p className="text-xs font-bold uppercase">Garantia de satisfação</p>
            <p className="text-[10px] text-gray-600">Para compra ou troca</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
