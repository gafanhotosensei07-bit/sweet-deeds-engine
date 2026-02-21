import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full">
      <div className="relative w-full">
        <img 
          src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392117854-1.jpeg" 
          alt="Carnaval Promo" 
          className="w-full h-auto"
        />
      </div>
      
      <div className="bg-gray-100 py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col items-center text-center">
            <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392118941-2.png" alt="Frete" className="h-10 mb-2" />
            <p className="text-xs font-bold uppercase">Frete Grátis</p>
            <p className="text-[10px] text-gray-600">Acima de R$299</p>
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
