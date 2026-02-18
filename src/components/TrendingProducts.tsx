import React from 'react';
import tnTripleBlack from '@/assets/tn-triple-black.jpg';
import tnSunset from '@/assets/tn-sunset.jpg';
import tnBlueGradient from '@/assets/tn-blue-gradient.jpg';
import tnDrift from '@/assets/tn-drift.jpg';
import tnUtility from '@/assets/tn-utility.jpg';

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
    description: 'Degradê laranja/amarelo icônico. Um dos TN mais históricos — sempre volta a viralizar.',
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
    name: 'AIR MAX PLUS DRIFT',
    description: 'Versão futurista do TN clássico. Tuned Air + overlays moldados modernos. Trend de 2026.',
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
    description: 'Estilo robusto inspirado na praia para as ruas. Mudguard em camurça + toggle closure.',
    oldPrice: '419,90',
    price: '179,90',
    installments: '16,35',
    image: tnUtility,
    discount: '-57%',
    badge: '⚙️ Techwear',
  },
];

const TrendingProducts: React.FC = () => {
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
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 block">
                {product.discount}
              </span>
              <span className="bg-[#f39b19] text-white text-[9px] font-bold px-2 py-0.5 block">
                {product.badge}
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
                <button className="w-full bg-black text-white py-2 text-xs font-bold hover:bg-[#f39b19] transition-colors">
                  COMPRAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
