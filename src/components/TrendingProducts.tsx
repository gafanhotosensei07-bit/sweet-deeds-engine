import React from 'react';

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
    description: 'O mais usado. Combina com qualquer look, muito popular entre adolescentes.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be2e2?w=500&q=80',
    discount: '-57%',
    badge: '🌅 Icônico',
  },
  {
    id: 103,
    name: 'AIR MAX PLUS BLUE GRADIENT',
    description: 'Azul degradê que domina o TikTok e Instagram. Estilo inconfundível nas redes.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    discount: '-57%',
    badge: '📱 TikTok',
  },
  {
    id: 104,
    name: 'AIR MAX PLUS DRIFT',
    description: 'Versão mais nova do TN com visual futurista. Crescendo forte em 2026.',
    oldPrice: '429,90',
    price: '184,90',
    installments: '16,81',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    discount: '-57%',
    badge: '🚀 2026',
  },
  {
    id: 105,
    name: 'AIR MAX PLUS UTILITY',
    description: 'Estilo robusto com pegada "techwear". Para quem busca funcionalidade e atitude.',
    oldPrice: '419,90',
    price: '179,90',
    installments: '16,35',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    discount: '-57%',
    badge: '⚙️ Techwear',
  },
];

const TrendingProducts: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-block bg-[#f39b19] text-white text-xs font-bold px-4 py-1 mb-3 uppercase tracking-widest">
          Tendências 2025
        </span>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          MODELOS MAIS POPULARES AGORA
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Selecionados com base nos lançamentos e buscas mais quentes do momento
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
            <div className="aspect-square overflow-hidden mb-3">
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
