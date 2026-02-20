import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  oldPrice: string;
  price: string;
  installments: string;
  image: string;
  discount: string;
}

const SIZES = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

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
  const { addItem, openCart } = useCart();
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [pendingSize, setPendingSize] = useState('');

  const handleAddToCart = () => {
    if (!cartProduct || !pendingSize) return;
    addItem(cartProduct as CheckoutProduct, pendingSize, 1);
    setCartProduct(null);
    setPendingSize('');
    openCart();
  };

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
              <div className="flex gap-1">
                <button
                  onClick={() => setCheckoutProduct(product as CheckoutProduct)}
                  className="flex-1 bg-black text-white py-2 text-xs font-bold hover:bg-[#f39b19] transition-colors"
                >
                  COMPRAR
                </button>
                <button
                  onClick={() => { setCartProduct(product); setPendingSize(''); }}
                  className="w-10 bg-gray-100 text-black hover:bg-[#f39b19] hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
                  title="Adicionar ao carrinho"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />

      {cartProduct && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setCartProduct(null)} />
          <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-white w-full md:max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img src={cartProduct.image} alt={cartProduct.name} className="w-14 h-14 object-cover bg-gray-50" />
              <div>
                <p className="font-black text-xs uppercase leading-tight">{cartProduct.name}</p>
                <p className="text-[#f39b19] font-black text-sm mt-0.5">R$ {cartProduct.price}</p>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">Selecione o tamanho (BR)</p>
            <div className="grid grid-cols-6 gap-2 mb-5">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setPendingSize(size)}
                  className={`py-2 text-xs font-bold border transition-all ${pendingSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-[#f39b19] hover:text-[#f39b19]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCartProduct(null)} className="flex-1 border border-gray-300 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!pendingSize}
                className={`flex-[2] py-3 text-xs font-black uppercase tracking-widest transition-colors ${pendingSize ? 'bg-[#f39b19] text-black hover:bg-black hover:text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductGrid;

