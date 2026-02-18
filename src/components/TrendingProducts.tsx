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
    name: 'NIKE AIR FORCE 1 KIDS',
    description: 'Clássico absoluto viral entre adolescentes. Versatilidade total para o look streetwear.',
    oldPrice: '299,90',
    price: '129,90',
    installments: '11,81',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    discount: '-57%',
    badge: '🔥 Viral',
  },
  {
    id: 102,
    name: 'AIR FORCE 1 TRIPLE WHITE',
    description: 'A versão "Triple White" mais usada em fotos e vídeos de moda no mundo todo.',
    oldPrice: '299,90',
    price: '129,90',
    installments: '11,81',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&q=80',
    discount: '-57%',
    badge: '📸 Foto & Vídeo',
  },
  {
    id: 103,
    name: 'ADIDAS SAMBA OG',
    description: 'Sneaker retro queridinho, muito visto em looks urbanos e TikTok fashion.',
    oldPrice: '319,90',
    price: '139,90',
    installments: '12,72',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
    discount: '-56%',
    badge: '🎵 TikTok Hit',
  },
  {
    id: 104,
    name: 'ADIDAS GAZELLE PERU OG',
    description: 'Clássico Adidas que voltou com força entre jovens por estética vintage única.',
    oldPrice: '309,90',
    price: '134,90',
    installments: '12,26',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    discount: '-56%',
    badge: '🕹️ Vintage',
  },
  {
    id: 105,
    name: 'ADIDAS CAMPUS 00S',
    description: 'Modelo retro dos anos 2000 em alta nos feeds de moda teen do mundo todo.',
    oldPrice: '329,90',
    price: '144,90',
    installments: '13,17',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    discount: '-56%',
    badge: '⚡ Anos 2000',
  },
  {
    id: 106,
    name: 'ADIDAS GAZELLE BOLD FEM.',
    description: 'Variação do Gazelle com visual mais ousado, popular entre meninas na moda.',
    oldPrice: '309,90',
    price: '134,90',
    installments: '12,26',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    discount: '-56%',
    badge: '💜 Feminino',
  },
  {
    id: 107,
    name: 'ADIDAS SAMBAE',
    description: 'Versão moderna do Samba clássico com design atualizado e plataforma elevada.',
    oldPrice: '339,90',
    price: '149,90',
    installments: '13,62',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    discount: '-55%',
    badge: '🆕 Moderno',
  },
  {
    id: 108,
    name: 'AIR FORCE 1 GRADE SCHOOL',
    description: 'Opção GS do Air Force 1, a escolha certa para adolescentes com estilo.',
    oldPrice: '279,90',
    price: '119,90',
    installments: '10,90',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=500&q=80',
    discount: '-57%',
    badge: '👟 Teen',
  },
  {
    id: 109,
    name: 'ADIDAS GAZELLE INDOOR GREY',
    description: '"Grey One" — versão Gazelle tendência muito usada em looks casuais chiques.',
    oldPrice: '309,90',
    price: '134,90',
    installments: '12,26',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80',
    discount: '-56%',
    badge: '🩶 Casual',
  },
  {
    id: 110,
    name: 'AIR FORCE 1 LV8 MAGMA ORANGE',
    description: 'Air Force 1 com toque de laranja. Ótima opção para quem curte estilo ousado.',
    oldPrice: '299,90',
    price: '129,90',
    installments: '11,81',
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be2e2?w=500&q=80',
    discount: '-57%',
    badge: '🍊 Ousado',
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
