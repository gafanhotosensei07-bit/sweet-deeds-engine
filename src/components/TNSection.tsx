import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';
import { useCart } from '@/context/CartContext';

import tnTripleBlack from '@/assets/tn-triple-black-final.jpg';
import tnSunset from '@/assets/tn-sunset-final.jpg';
import tnBlueGradient from '@/assets/tn-blue-gradient-final.png';
import tnDrift from '@/assets/tn-drift-bred-final.jpg';
import tnUtility from '@/assets/tn-utility-final.jpg';
import tnHyperBlue from '@/assets/tn-hyper-blue-real.jpg';
import tnUniversityRed from '@/assets/tn-university-red-real2.jpg';
import tnVoltagePurple from '@/assets/tn-voltage-purple-real.png';
import tnTripleWhite from '@/assets/tn-triple-white-real.jpg';
import tnGreedy from '@/assets/tn-greedy-real.jpg';

const tnProducts: CheckoutProduct[] = [
  { id: 201, name: 'AIR MAX PLUS TRIPLE BLACK', oldPrice: '179,90', price: '99,90', installments: '9,08', image: tnTripleBlack, discount: '-44%' },
  { id: 202, name: 'AIR MAX PLUS SUNSET', oldPrice: '169,90', price: '84,90', installments: '7,71', image: tnSunset, discount: '-50%' },
  { id: 203, name: 'AIR MAX PLUS BLUE GRADIENT', oldPrice: '189,90', price: '109,90', installments: '9,99', image: tnBlueGradient, discount: '-42%' },
  { id: 204, name: 'AIR MAX PLUS DRIFT "BRED"', oldPrice: '199,90', price: '119,90', installments: '10,90', image: tnDrift, discount: '-40%' },
  { id: 205, name: 'AIR MAX PLUS UTILITY', oldPrice: '179,90', price: '94,90', installments: '8,62', image: tnUtility, discount: '-47%' },
  { id: 206, name: 'AIR MAX PLUS "HYPER BLUE"', oldPrice: '169,90', price: '79,90', installments: '7,26', image: tnHyperBlue, discount: '-53%' },
  { id: 207, name: 'AIR MAX PLUS "UNIVERSITY RED"', oldPrice: '189,90', price: '104,90', installments: '9,53', image: tnUniversityRed, discount: '-45%' },
  { id: 208, name: 'AIR MAX PLUS "VOLTAGE PURPLE"', oldPrice: '199,90', price: '114,90', installments: '10,44', image: tnVoltagePurple, discount: '-43%' },
  { id: 209, name: 'AIR MAX PLUS "TRIPLE WHITE"', oldPrice: '169,90', price: '74,90', installments: '6,80', image: tnTripleWhite, discount: '-56%' },
  { id: 210, name: 'AIR MAX PLUS SE "GREEDY"', oldPrice: '199,90', price: '89,90', installments: '8,17', image: tnGreedy, discount: '-55%' },
];

const TNSection: React.FC = () => {
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);

  return (
    <>
      <section className="bg-black py-16">
        {/* Hero Banner */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-[#f39b19] text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-[#f39b19] px-4 py-1">
              Especialistas em
            </span>
            <h2 className="text-white font-black uppercase leading-none mb-3" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-0.03em' }}>
              NIKE TN
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">
              AIR MAX PLUS · TODOS OS MODELOS · A MELHOR SELEÇÃO
            </p>
            <div className="flex items-center gap-6 mt-6">
              {['10 MODELOS', 'FRETE GRÁTIS', 'ATÉ 12X'].map((item, i) => (
                <div key={item} className="flex items-center gap-6">
                  <span className="text-white text-[11px] font-bold uppercase tracking-widest">{item}</span>
                  {i < 2 && <span className="text-[#f39b19] text-lg font-thin">|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Ticker */}
        <div className="border-y border-[#f39b19]/30 py-2 overflow-hidden mb-12">
          <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {Array(3).fill(null).flatMap(() =>
              ['TRIPLE BLACK', 'SUNSET', 'HYPER BLUE', 'UNIVERSITY RED', 'VOLTAGE PURPLE', 'GREEDY SE', 'TRIPLE WHITE', 'UTILITY', 'DRIFT BRED', 'BLUE GRADIENT']
                .map((name, i) => (
                  <span key={`${name}-${i}`} className="text-[#f39b19] text-[10px] font-black uppercase tracking-[0.3em] flex-shrink-0">
                    ★ {name}
                  </span>
                ))
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[#f39b19]/10">
            {tnProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-black relative overflow-hidden"
              >
                {/* Numbering */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[9px] font-black text-[#f39b19] opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-[#f39b19] text-black text-[9px] font-black px-1.5 py-0.5">
                    {product.discount}
                  </span>
                </div>

                {/* Image */}
                <div className="aspect-square overflow-hidden bg-[#111]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Info */}
                <div className="p-3 border-t border-white/5">
                  <h3 className="text-white text-[10px] font-black uppercase leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-[9px] line-through mb-0.5">R$ {product.oldPrice}</p>
                  <p className="text-white font-black text-base leading-none mb-0.5">R$ {product.price}</p>
                  <p className="text-gray-500 text-[9px] mb-3">12x R$ {product.installments}</p>
                  <button
                    onClick={() => setCheckoutProduct(product)}
                    className="w-full bg-[#f39b19] text-black py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="container mx-auto px-4 mt-10 text-center">
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em]">
            Não encontrou o modelo que procurava? Entre em contato conosco.
          </p>
        </div>
      </section>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </>
  );
};

export default TNSection;
