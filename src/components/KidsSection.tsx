import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';

import flexRunner4Preto from '@/assets/kids/flex-runner4-preto.jpg';
import flexRunner4Gs from '@/assets/kids/flex-runner4-gs.jpg';
import revolution7Preto from '@/assets/kids/revolution7-preto.jpg';
import revolution7Gs from '@/assets/kids/revolution7-gs.jpg';
import dunkLowPanda from '@/assets/kids/dunk-low-panda.jpg';
import courtBoroughAzul from '@/assets/kids/court-borough-azul.jpg';
import af1LeBranco from '@/assets/kids/af1-le-branco.jpg';
import dunkLowSe from '@/assets/kids/dunk-low-se.jpg';
import flexRunner4Rosa from '@/assets/kids/flex-runner4-rosa.jpg';
import teamHustleD12 from '@/assets/kids/team-hustle-d12.jpg';
import revolution7Multicolor from '@/assets/kids/revolution7-multicolor.jpg';
import teamHustleD12Criancas from '@/assets/kids/team-hustle-d12-criancas.jpg';
import courtBoroughBranco from '@/assets/kids/court-borough-branco.jpg';
import courtBoroughRosa from '@/assets/kids/court-borough-rosa.jpg';
import courtBoroughPreto from '@/assets/kids/court-borough-preto.jpg';
import flexRunner4Bebe from '@/assets/kids/flex-runner4-bebe.jpg';
import courtBoroughBege from '@/assets/kids/court-borough-bege.jpg';
import courtBoroughCinza from '@/assets/kids/court-borough-cinza.jpg';
import varsityCorrida from '@/assets/kids/varsity-corrida.jpg';
import cosmicRunner from '@/assets/kids/cosmic-runner.jpg';

interface KidsProduct extends CheckoutProduct {
  ageGroup: string;
  category: string;
  sizes: string[];
  badge: string;
}

const kidsProducts: KidsProduct[] = [
  {
    id: 301,
    name: 'NIKE FLEX RUNNER 4 INFANTIL',
    oldPrice: '329,99',
    price: '199,90',
    installments: '18,17',
    image: flexRunner4Preto,
    discount: '-39%',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '🏃 Mais Vendido',
  },
  {
    id: 302,
    name: 'NIKE FLEX RUNNER 4 GS',
    oldPrice: '349,99',
    price: '219,90',
    installments: '19,99',
    image: flexRunner4Gs,
    discount: '-37%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '⚡ Top Venda',
  },
  {
    id: 303,
    name: 'NIKE REVOLUTION 7 INFANTIL',
    oldPrice: '369,99',
    price: '189,90',
    installments: '17,26',
    image: revolution7Preto,
    discount: '-49%',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['22', '23', '24', '25', '26', '27', '28', '29'],
    badge: '🔥 Oferta',
  },
  {
    id: 304,
    name: 'NIKE REVOLUTION 7 GS',
    oldPrice: '379,99',
    price: '219,90',
    installments: '19,99',
    image: revolution7Gs,
    discount: '-42%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🚀 Novo',
  },
  {
    id: 305,
    name: 'NIKE DUNK LOW PANDA INFANTIL',
    oldPrice: '699,99',
    price: '449,90',
    installments: '40,90',
    image: dunkLowPanda,
    discount: '-36%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🐼 Panda',
  },
  {
    id: 306,
    name: 'NIKE COURT BOROUGH LOW AZUL',
    oldPrice: '329,99',
    price: '199,90',
    installments: '18,17',
    image: courtBoroughAzul,
    discount: '-39%',
    ageGroup: 'Bebês',
    category: 'Casual',
    sizes: ['16', '17,5', '18,5', '20', '21', '22', '22,5', '23'],
    badge: '💙 Bebê',
  },
  {
    id: 307,
    name: 'NIKE AIR FORCE 1 LE INFANTIL',
    oldPrice: '699,99',
    price: '389,90',
    installments: '35,44',
    image: af1LeBranco,
    discount: '-44%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '⭐ Clássico',
  },
  {
    id: 308,
    name: 'NIKE DUNK LOW SE INFANTIL',
    oldPrice: '799,99',
    price: '419,90',
    installments: '38,17',
    image: dunkLowSe,
    discount: '-48%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🔥 Exclusivo',
  },
  {
    id: 309,
    name: 'NIKE FLEX RUNNER 4 ROSA',
    oldPrice: '349,99',
    price: '209,90',
    installments: '19,08',
    image: flexRunner4Rosa,
    discount: '-40%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🩷 Feminino',
  },
  {
    id: 310,
    name: 'NIKE TEAM HUSTLE D12 GS',
    oldPrice: '499,99',
    price: '279,90',
    installments: '25,44',
    image: teamHustleD12,
    discount: '-44%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Basquete',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🏀 Basquete',
  },
  {
    id: 311,
    name: 'NIKE REVOLUTION 7 MULTICOLOR',
    oldPrice: '379,99',
    price: '219,90',
    installments: '19,99',
    image: revolution7Multicolor,
    discount: '-42%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🌈 Colors',
  },
  {
    id: 312,
    name: 'NIKE TEAM HUSTLE D12 KIDS',
    oldPrice: '449,99',
    price: '249,90',
    installments: '22,71',
    image: teamHustleD12Criancas,
    discount: '-44%',
    ageGroup: 'Crianças',
    category: 'Basquete',
    sizes: ['28', '29', '30', '30,5', '31', '32', '32,5', '33'],
    badge: '🏀 Kids',
  },
  {
    id: 313,
    name: 'NIKE COURT BOROUGH LOW BRANCO',
    oldPrice: '449,99',
    price: '259,90',
    installments: '23,62',
    image: courtBoroughBranco,
    discount: '-42%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '⚪ All White',
  },
  {
    id: 314,
    name: 'NIKE COURT BOROUGH LOW ROSA',
    oldPrice: '449,99',
    price: '259,90',
    installments: '23,62',
    image: courtBoroughRosa,
    discount: '-42%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🩷 Rosa',
  },
  {
    id: 315,
    name: 'NIKE COURT BOROUGH LOW PRETO',
    oldPrice: '399,99',
    price: '229,90',
    installments: '20,89',
    image: courtBoroughPreto,
    discount: '-43%',
    ageGroup: 'Crianças',
    category: 'Casual',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '⚫ Classic',
  },
  {
    id: 316,
    name: 'NIKE FLEX RUNNER 4 BEBÊ',
    oldPrice: '299,99',
    price: '179,90',
    installments: '16,35',
    image: flexRunner4Bebe,
    discount: '-40%',
    ageGroup: 'Bebês',
    category: 'Corrida',
    sizes: ['16', '17,5', '18,5', '20', '21', '22', '22,5', '23'],
    badge: '👶 Bebê',
  },
  {
    id: 317,
    name: 'NIKE COURT BOROUGH LOW BEGE',
    oldPrice: '329,99',
    price: '199,90',
    installments: '18,17',
    image: courtBoroughBege,
    discount: '-39%',
    ageGroup: 'Bebês',
    category: 'Casual',
    sizes: ['16', '17,5', '18,5', '20', '21', '22', '22,5', '23'],
    badge: '🤍 Neutro',
  },
  {
    id: 318,
    name: 'NIKE COURT BOROUGH LOW CINZA',
    oldPrice: '449,99',
    price: '269,90',
    installments: '24,54',
    image: courtBoroughCinza,
    discount: '-40%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🩶 Cinza',
  },
  {
    id: 319,
    name: 'NIKE VARSITY INFANTIL',
    oldPrice: '499,99',
    price: '279,90',
    installments: '25,44',
    image: varsityCorrida,
    discount: '-44%',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35,5', '36', '37', '37,5', '38'],
    badge: '🏆 Varsity',
  },
  {
    id: 320,
    name: 'NIKE COSMIC RUNNER INFANTIL',
    oldPrice: '399,99',
    price: '239,90',
    installments: '21,80',
    image: cosmicRunner,
    discount: '-40%',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '🌙 Cosmic',
  },
];

const FILTERS = ['Todos', 'Bebês', 'Crianças', 'Pré-Adolescentes'];

const KidsSection: React.FC = () => {
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filtered = activeFilter === 'Todos'
    ? kidsProducts
    : kidsProducts.filter(p => p.ageGroup === activeFilter);

  return (
    <>
      <section className="bg-white py-16">
        {/* Header */}
        <div className="container mx-auto px-4 mb-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f39b19] border border-[#f39b19] px-4 py-1 mb-4">
              Nova Categoria
            </span>
            <h2 className="font-black uppercase leading-none mb-3 text-black" style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', letterSpacing: '-0.03em' }}>
              TÊNIS INFANTIL
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-[0.25em] mb-6">
              NIKE KIDS · 20 MODELOS SELECIONADOS · FOTOS REAIS
            </p>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap justify-center">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border transition-all ${
                    activeFilter === f
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-600 hover:border-[#f39b19] hover:text-[#f39b19]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="group relative border border-transparent hover:border-gray-200 transition-all p-2 flex flex-col"
              >
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 block">
                    {product.discount}
                  </span>
                  <span className="bg-[#f39b19] text-white text-[9px] font-bold px-2 py-0.5 block">
                    {product.badge}
                  </span>
                </div>

                {/* Age tag */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-1.5 py-0.5 block">
                    {product.ageGroup}
                  </span>
                </div>

                {/* Image */}
                <div className="aspect-square overflow-hidden mb-3 bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="text-center flex flex-col flex-1">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">{product.category}</p>
                  <h3 className="text-xs font-black uppercase leading-tight mb-1 line-clamp-2">{product.name}</h3>

                  {/* Sizes preview */}
                  <p className="text-[9px] text-gray-400 mb-2">
                    Tam: {product.sizes.slice(0, 4).join(' · ')}{product.sizes.length > 4 ? ' +' : ''}
                  </p>

                  <div className="mt-auto">
                    <p className="text-gray-400 text-[10px] line-through">de R$ {product.oldPrice}</p>
                    <p className="text-lg font-black text-black">R$ {product.price}</p>
                    <p className="text-[10px] text-gray-600 mb-3">
                      <strong>12x</strong> de <strong>R$ {product.installments}</strong>
                    </p>
                    <button
                      onClick={() => setCheckoutProduct(product)}
                      className="w-full bg-black text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#f39b19] transition-colors"
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </>
  );
};

export default KidsSection;
