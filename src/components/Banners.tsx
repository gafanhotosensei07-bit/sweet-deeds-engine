import React from 'react';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const banners = [
  {
    src: 'https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392122137-6.jpeg',
    alt: 'Mais Vendidos',
    label: 'Mais Vendidos',
    target: 'section-mais-vendidos',
  },
  {
    src: 'https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392122905-7.jpeg',
    alt: 'Modelos Femininos',
    label: 'Feminino',
    target: 'section-feminino',
  },
  {
    src: 'https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392123620-8.jpeg',
    alt: 'Modelos Masculinos',
    label: 'Masculino',
    target: 'section-masculino',
  },
];

const Banners: React.FC = () => {
  return (
    <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {banners.map((b) => (
          <div
            key={b.target + b.label}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => scrollTo(b.target)}
          >
            <img
              src={b.src}
              alt={b.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-6">
              <span className="text-white font-black text-xl uppercase">{b.label}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-[#f39b19] text-black text-xs font-black uppercase tracking-widest px-4 py-2">
                Ver Seção →
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 md:mt-8 cursor-pointer group relative overflow-hidden"
        onClick={() => scrollTo('section-kids')}
      >
        <img
          src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392124477-9.jpeg"
          alt="Linha Infantil"
          className="w-full rounded-lg transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-[#f39b19] text-black text-sm font-black uppercase tracking-widest px-6 py-3">
            Ver Linha Infantil →
          </span>
        </div>
      </div>
    </section>
  );
};

export default Banners;

