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
    name: 'PUMA SPEEDCAT',
    description: 'Inspirado no automobilismo, camurça leve com sola de borracha. Conforto e estilo urbano.',
    oldPrice: '349,90',
    price: '149,90',
    installments: '13,62',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    discount: '-57%',
    badge: '🔥 Febre 2025',
  },
  {
    id: 102,
    name: 'ADIDAS TAEKWONDO',
    description: 'Design minimalista inspirado nas artes marciais. Couro macio, slip-on, estilo anos 2000.',
    oldPrice: '329,90',
    price: '139,90',
    installments: '12,72',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
    discount: '-58%',
    badge: '⚡ Tendência',
  },
  {
    id: 103,
    name: 'ONITSUKA TIGER MEXICO 66',
    description: 'Ícone mundial em camurça 100%, bico arredondado e solado de borracha. Clássico atemporal.',
    oldPrice: '399,90',
    price: '169,90',
    installments: '15,44',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&q=80',
    discount: '-57%',
    badge: '🌟 Cult',
  },
  {
    id: 104,
    name: 'NIKE AIR MAX 270',
    description: 'Câmara de ar máxima no calcanhar para amortecimento superior. Ideal para o dia a dia.',
    oldPrice: '379,90',
    price: '159,90',
    installments: '14,53',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    discount: '-58%',
    badge: '🏆 Mais Buscado',
  },
  {
    id: 105,
    name: 'NEW BALANCE 574',
    description: 'Retro running com cabedal em camurça e mesh. Conforto premium com visual nostálgico.',
    oldPrice: '359,90',
    price: '154,90',
    installments: '14,08',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    discount: '-57%',
    badge: '🆕 Novo',
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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="group relative border border-transparent hover:border-gray-200 transition-all p-2 flex flex-col"
          >
            {/* Badge */}
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
              <h3 className="text-xs font-black mb-1 uppercase">{product.name}</h3>
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
