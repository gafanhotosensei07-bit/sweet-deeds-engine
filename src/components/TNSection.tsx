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
            Não encontrou o modelo que procurava?
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=551121154200"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-[#25d366] text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            Fale com a gente no WhatsApp →
          </a>
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
