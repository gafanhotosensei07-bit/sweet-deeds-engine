import React from 'react';

interface ProductGridProps {
  title: string;
}

const products = [
  { id: 1, name: 'Nike Air Max 270', brand: 'Nike', price: 399.90, oldPrice: 699.90, image: '/placeholder.svg', discount: 43 },
  { id: 2, name: 'Adidas Ultra Boost', brand: 'Adidas', price: 449.90, oldPrice: 899.90, image: '/placeholder.svg', discount: 50 },
  { id: 3, name: 'New Balance 574', brand: 'New Balance', price: 329.90, oldPrice: 599.90, image: '/placeholder.svg', discount: 45 },
  { id: 4, name: 'Puma RS-X', brand: 'Puma', price: 299.90, oldPrice: 549.90, image: '/placeholder.svg', discount: 45 },
];

const ProductGrid = ({ title }: ProductGridProps) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-black uppercase mb-6 border-l-4 border-[#f39b19] pl-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover bg-gray-100"
              />
              <span className="absolute top-2 left-2 bg-[#f39b19] text-black text-xs font-black px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">{product.brand}</p>
              <p className="font-bold text-sm text-black mb-2 line-clamp-2">{product.name}</p>
              <p className="text-xs text-gray-400 line-through">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-lg font-black text-black">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
              <button className="mt-3 w-full bg-black text-white text-sm font-bold py-2 rounded-lg hover:bg-[#f39b19] hover:text-black transition-colors">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
