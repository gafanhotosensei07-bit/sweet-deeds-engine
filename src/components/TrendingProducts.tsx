import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';
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

interface TrendingProduct {
  id: number;
  name: string;
  description: string;
  oldPrice: string;
  price: string;
  installments: string;
  image: string;
  discount: string;
  badge: string;
}

const trendingProducts: TrendingProduct[] = [
  {
    id: 101,
    name: 'AIR MAX PLUS TRIPLE BLACK',
    description: 'Todo preto, combina com qualquer look. O TN mais usado por adolescentes no streetwear.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnTripleBlack,
    discount: '-57%',
    badge: '🥇 O Mais Usado',
  },
  {
    id: 102,
    name: 'AIR MAX PLUS SUNSET',
    description: 'Degradê laranja/amarelo icônico desde 1998. Um dos TN mais históricos — sempre volta a viralizar.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnSunset,
    discount: '-57%',
    badge: '🌅 Icônico',
  },
  {
    id: 103,
    name: 'AIR MAX PLUS BLUE GRADIENT',
    description: 'Neptune Blue Gradient. Azul degradê que domina o TikTok e Instagram.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnBlueGradient,
    discount: '-57%',
    badge: '📱 TikTok Hit',
  },
  {
    id: 104,
    name: 'AIR MAX PLUS DRIFT "BRED"',
    description: 'Versão futurista do TN clássico. Tuned Air com overlays moldados modernos. Trend de 2026.',
    oldPrice: '449,90',
    price: '189,90',
    installments: '17,26',
    image: tnDrift,
    discount: '-57%',
    badge: '🚀 Futuro 2026',
  },
  {
    id: 105,
    name: 'AIR MAX PLUS UTILITY',
    description: 'Estilo robusto com mudguard em camurça + toggle lacing. Pegada techwear urbano.',
    oldPrice: '419,90',
    price: '179,90',
    installments: '16,35',
    image: tnUtility,
    discount: '-57%',
    badge: '⚙️ Techwear',
  },
  {
    id: 106,
    name: 'AIR MAX PLUS OG "HYPER BLUE"',
    description: 'Degradê azul que vai do claro ao escuro, inspirado no oceano. Re-lançado em 2025 com muito hype.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnHyperBlue,
    discount: '-57%',
    badge: '🌊 Re-launch 2025',
  },
  {
    id: 107,
    name: 'AIR MAX PLUS TN "UNIVERSITY RED"',
    description: 'Vermelho intenso que virou clássico absoluto. Um dos TN mais procurados no Brasil.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnUniversityRed,
    discount: '-57%',
    badge: '🔴 Clássico BR',
  },
  {
    id: 108,
    name: 'AIR MAX PLUS OG "VOLTAGE PURPLE"',
    description: 'Edição comemorativa de 25 anos (2024). Roxo elétrico com swoosh laranja — raro e exclusivo.',
    oldPrice: '449,90',
    price: '189,90',
    installments: '17,26',
    image: tnVoltagePurple,
    discount: '-57%',
    badge: '💜 25 Anos',
  },
  {
    id: 109,
    name: 'AIR MAX PLUS TN "TRIPLE WHITE"',
    description: 'O TN todo branco. Limpo, versátil e indispensável. Combina com qualquer outfit.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: tnTripleWhite,
    discount: '-57%',
    badge: '⚪ All White',
  },
  {
    id: 110,
    name: 'AIR MAX PLUS TN SE "GREEDY"',
    description: 'Sunset + Hyper Blue num único TN. Metade laranja, metade azul. Lenda do streetwear.',
    oldPrice: '499,90',
    price: '209,90',
    installments: '19,08',
    image: tnGreedy,
    discount: '-58%',
    badge: '🏆 Edição Rara',
  },
];

const TrendingProducts: React.FC = () => {
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-block bg-[#f39b19] text-white text-xs font-bold px-4 py-1 mb-3 uppercase tracking-widest">
          Nike Air Max Plus TN
        </span>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          OS 5 TN MAIS POPULARES AGORA
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Pesquisados e selecionados com base nas tendências mais quentes de 2025/2026
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="group relative border border-transparent hover:border-gray-200 transition-all p-2 flex flex-col"
          >
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 block">
                {product.discount}
              </span>
              <span className="bg-[#f39b19] text-white text-[9px] font-bold px-2 py-0.5 block">
                {product.badge}
              </span>
            </div>

            <div className="aspect-square overflow-hidden mb-3 bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="text-center flex flex-col flex-1">
              <h3 className="text-xs font-black mb-1 uppercase leading-tight">{product.name}</h3>
              <p className="text-[10px] text-gray-500 mb-2 leading-relaxed line-clamp-2">
                {product.description}
              </p>
              <div className="mt-auto">
                <p className="text-gray-400 text-[10px] line-through">de R${product.oldPrice}</p>
                <p className="text-lg font-black text-black">por R${product.price}</p>
                <p className="text-[10px] text-gray-600 mb-3">
                  <strong>12x</strong> de <strong>R${product.installments}</strong>
                </p>
                <button
                  onClick={() => setCheckoutProduct(product)}
                  className="w-full bg-black text-white py-2 text-xs font-bold hover:bg-[#f39b19] transition-colors"
                >
                  COMPRAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </section>
  );
};

export default TrendingProducts;
