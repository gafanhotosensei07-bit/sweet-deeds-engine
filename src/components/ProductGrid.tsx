import React from 'react';

interface Product {
  id: number;
  name: string;
  oldPrice: string;
  price: string;
  installments: string;
  image: string;
  discount: string;
}

const products: Product[] = [
  { id: 1, name: 'AIR FORCE NOBOOK PRETO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bcdf477b4/56912e4c305e752e5678b2ceb0c002ad-6851bd732581d_mini.jpg', discount: '-57%' },
  { id: 2, name: 'NIKE DUNK GOLD', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4af4b1b8/74ef23656f61030e29d5b1109abb95c2-6851c5364a28f_mini.jpeg', discount: '-57%' },
  { id: 3, name: 'VANS OLD SKOOL', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4e6418da/6804231c1990a6019f73323a5fcee446-6851c59745fff_mini.jpg', discount: '-57%' },
  { id: 4, name: 'NIKE DUNK CINZA', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4ac5f844/83742df61706350c9c6c487e93a080d2-6851c5233b974_mini.jpg', discount: '-57%' },
  { id: 5, name: 'NIKE DUNK PANDA', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4c55a7be/ef2bb2d9ae948edfae13eda074a77678-6851c5bbaf598_mini.jpeg', discount: '-57%' },
  { id: 6, name: 'NIKE AIR MAX 90 PRETO/BRANCO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c94dcdbd0/193e8b3f9a6ed30dfea1421705623dd4-6851c9a850ee1_mini.jpg', discount: '-57%' },
  { id: 7, name: 'VANS KNU', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4d837ffa/49db6d60621fc7a44615dcf3e065e329-6851c5309f6b9_mini.jpg', discount: '-57%' },
  { id: 8, name: 'NIKE AIR FORCE 1 BRANCO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bceb2fe34/7fae9a8b2c8a19aa1f2d0ecfa69baac5-6851bdbdc11a1_mini.jpg', discount: '-57%' },
];

const ProductGrid: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative border border-transparent hover:border-gray-200 transition-all p-2">
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 z-10">
              {product.discount}
            </div>
            <div className="aspect-square overflow-hidden mb-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xs font-bold mb-2 h-8 overflow-hidden">{product.name}</h3>
              <p className="text-gray-400 text-[10px] line-through">de R${product.oldPrice}</p>
              <p className="text-lg font-black text-black">por R${product.price}</p>
              <p className="text-[10px] text-gray-600 mb-4">
                <strong>12x</strong> de <strong>R${product.installments}</strong>
              </p>
              <button className="w-full bg-black text-white py-2 text-xs font-bold hover:bg-[#f39b19] transition-colors">
                COMPRAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
