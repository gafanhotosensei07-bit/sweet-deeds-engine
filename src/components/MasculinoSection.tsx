import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

const SIZES_M = ['38', '39', '40', '41', '42', '43', '44', '45'];

const masculinoProducts: CheckoutProduct[] = [
  {
    id: 701,
    name: 'NIKE AIR FORCE 1 \'07 MASCULINO BRANCO',
    oldPrice: '249,90',
    price: '99,90',
    installments: '9,08',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bceb2fe34/7fae9a8b2c8a19aa1f2d0ecfa69baac5-6851bdbdc11a1_mini.jpg',
    discount: '-60%',
  },
  {
    id: 702,
    name: 'NIKE DUNK LOW MASCULINO PANDA',
    oldPrice: '269,90',
    price: '109,90',
    installments: '9,99',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4c55a7be/ef2bb2d9ae948edfae13eda074a77678-6851c5bbaf598_mini.jpeg',
    discount: '-59%',
  },
  {
    id: 703,
    name: 'VANS OLD SKOOL MASCULINO PRETO',
    oldPrice: '219,90',
    price: '84,90',
    installments: '7,71',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4e6418da/6804231c1990a6019f73323a5fcee446-6851c59745fff_mini.jpg',
    discount: '-61%',
  },
  {
    id: 704,
    name: 'NIKE DUNK LOW MASCULINO CINZA',
    oldPrice: '249,90',
    price: '94,90',
    installments: '8,62',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4ac5f844/83742df61706350c9c6c487e93a080d2-6851c5233b974_mini.jpg',
    discount: '-62%',
  },
  {
    id: 705,
    name: 'NIKE AIR MAX 90 MASCULINO PRETO/BRANCO',
    oldPrice: '259,90',
    price: '104,90',
    installments: '9,53',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c94dcdbd0/193e8b3f9a6ed30dfea1421705623dd4-6851c9a850ee1_mini.jpg',
    discount: '-60%',
  },
  {
    id: 706,
    name: 'NIKE AIR FORCE NOBOOK PRETO MASCULINO',
    oldPrice: '229,90',
    price: '89,90',
    installments: '8,17',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bcdf477b4/56912e4c305e752e5678b2ceb0c002ad-6851bd732581d_mini.jpg',
    discount: '-61%',
  },
  {
    id: 707,
    name: 'NIKE DUNK GOLD MASCULINO',
    oldPrice: '269,90',
    price: '109,90',
    installments: '9,99',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4af4b1b8/74ef23656f61030e29d5b1109abb95c2-6851c5364a28f_mini.jpeg',
    discount: '-59%',
  },
  {
    id: 708,
    name: 'VANS KNU-SKOOL MASCULINO',
    oldPrice: '219,90',
    price: '79,90',
    installments: '7,26',
    image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4d837ffa/49db6d60621fc7a44615dcf3e065e329-6851c5309f6b9_mini.jpg',
    discount: '-64%',
  },
];

const MasculinoSection: React.FC = () => {
  const { addItem, openCart } = useCart();
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [cartProduct, setCartProduct] = useState<CheckoutProduct | null>(null);
  const [pendingSize, setPendingSize] = useState('');

  const handleAddToCart = () => {
    if (!cartProduct || !pendingSize) return;
    addItem(cartProduct, pendingSize, 1);
    setCartProduct(null);
    setPendingSize('');
    openCart();
  };

  return (
    <>
      <section id="section-masculino" className="bg-gray-950 py-16 border-t-4 border-blue-500">
        {/* Header */}
        <div className="container mx-auto px-4 mb-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 border border-blue-500 px-4 py-1 mb-4">
              Modelos Masculinos
            </span>
            <h2 className="font-black uppercase leading-none mb-2 text-white" style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', letterSpacing: '-0.03em' }}>
              TÊNIS MASCULINOS
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] max-w-xl">
              Os modelos mais procurados pelos homens brasileiros em 2025 — Nike, Adidas, Vans, New Balance e muito mais
            </p>
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {['Nike', 'Adidas', 'Vans', 'New Balance', 'Converse'].map(b => (
                <span key={b} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-blue-900/10">
            {masculinoProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-gray-950 overflow-hidden hover:bg-gray-900 transition-all p-3 flex flex-col"
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 block">
                    {product.discount}
                  </span>
                </div>

                <div className="aspect-square overflow-hidden mb-3 bg-gray-900 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/111111/333333?text=Produto';
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-white text-[10px] font-black uppercase leading-tight mb-2 line-clamp-2 flex-1">{product.name}</h3>
                  <p className="text-gray-600 text-[9px] line-through">R$ {product.oldPrice}</p>
                  <p className="text-white font-black text-base leading-none mb-0.5">R$ {product.price}</p>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCheckoutProduct(product)}
                      className="flex-1 bg-blue-500 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      COMPRAR
                    </button>
                    <button
                      onClick={() => { setCartProduct(product); setPendingSize(''); }}
                      className="w-9 bg-white/10 text-white hover:bg-blue-500 transition-colors flex items-center justify-center flex-shrink-0"
                      title="Adicionar ao carrinho"
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />

      {cartProduct && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setCartProduct(null)} />
          <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-white w-full md:max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img src={cartProduct.image} alt={cartProduct.name} className="w-14 h-14 object-cover bg-gray-50" />
              <div>
                <p className="font-black text-xs uppercase leading-tight">{cartProduct.name}</p>
                <p className="text-blue-500 font-black text-sm mt-0.5">R$ {cartProduct.price}</p>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">Selecione o tamanho (BR)</p>
            <div className="grid grid-cols-6 gap-2 mb-5">
              {SIZES_M.map(size => (
                <button
                  key={size}
                  onClick={() => setPendingSize(size)}
                  className={`py-2 text-xs font-bold border transition-all ${pendingSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-blue-400 hover:text-blue-500'}`}
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
                className={`flex-[2] py-3 text-xs font-black uppercase tracking-widest transition-colors ${pendingSize ? 'bg-blue-500 text-white hover:bg-black' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MasculinoSection;
