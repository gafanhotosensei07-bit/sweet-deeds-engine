import React from 'react';

const Banners: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden group">
          <img 
            src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392122137-6.jpeg" 
            alt="Mais Vendidos" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end p-6">
            <span className="text-white font-black text-xl uppercase">Mais Vendidos</span>
          </div>
        </div>
        <div className="relative overflow-hidden group">
          <img 
            src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392122905-7.jpeg" 
            alt="Feminino" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end p-6">
            <span className="text-white font-black text-xl uppercase">Feminino</span>
          </div>
        </div>
        <div className="relative overflow-hidden group">
          <img 
            src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392123620-8.jpeg" 
            alt="Masculino" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end p-6">
            <span className="text-white font-black text-xl uppercase">Masculino</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392124477-9.jpeg" alt="Promo 1" className="w-full rounded-lg" />
        <img src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392125274-10.jpeg" alt="Promo 2" className="w-full rounded-lg" />
      </div>
    </section>
  );
};

export default Banners;
