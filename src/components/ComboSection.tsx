import React, { useState } from 'react';
import { CheckoutProduct } from './CheckoutModal';
import { useCart } from '@/context/CartContext';
import { Check, ShoppingBag, Tag, Zap } from 'lucide-react';

import tnTripleBlack from '@/assets/tn-triple-black-final.jpg';
import tnSunset from '@/assets/tn-sunset-final.jpg';
import tnBlueGradient from '@/assets/tn-blue-gradient-final.png';
import tnDrift from '@/assets/tn-drift-bred-final.jpg';

const COMBO_PRODUCTS: CheckoutProduct[] = [
  { id: 1, name: 'AIR FORCE NOBOOK PRETO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bcdf477b4/56912e4c305e752e5678b2ceb0c002ad-6851bd732581d_mini.jpg', discount: '-57%' },
  { id: 2, name: 'NIKE DUNK GOLD', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4af4b1b8/74ef23656f61030e29d5b1109abb95c2-6851c5364a28f_mini.jpeg', discount: '-57%' },
  { id: 3, name: 'VANS OLD SKOOL', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4e6418da/6804231c1990a6019f73323a5fcee446-6851c59745fff_mini.jpg', discount: '-57%' },
  { id: 4, name: 'NIKE DUNK CINZA', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4ac5f844/83742df61706350c9c6c487e93a080d2-6851c5233b974_mini.jpg', discount: '-57%' },
  { id: 5, name: 'NIKE DUNK PANDA', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4c55a7be/ef2bb2d9ae948edfae13eda074a77678-6851c5bbaf598_mini.jpeg', discount: '-57%' },
  { id: 6, name: 'NIKE AIR MAX 90 PRETO/BRANCO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c94dcdbd0/193e8b3f9a6ed30dfea1421705623dd4-6851c9a850ee1_mini.jpg', discount: '-57%' },
  { id: 7, name: 'VANS KNU', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851c4d837ffa/49db6d60621fc7a44615dcf3e065e329-6851c5309f6b9_mini.jpg', discount: '-57%' },
  { id: 8, name: 'NIKE AIR FORCE 1 BRANCO', oldPrice: '299,90', price: '129,90', installments: '11,66', image: 'https://cdn.sistemawbuy.com.br/arquivos/0eea9453a8daf929264353354d7552fa/produtos/6851bceb2fe34/7fae9a8b2c8a19aa1f2d0ecfa69baac5-6851bdbdc11a1_mini.jpg', discount: '-57%' },
  { id: 9, name: 'AIR MAX PLUS TRIPLE BLACK', oldPrice: '179,90', price: '99,90', installments: '9,08', image: tnTripleBlack, discount: '-44%' },
  { id: 10, name: 'AIR MAX PLUS SUNSET', oldPrice: '169,90', price: '84,90', installments: '7,71', image: tnSunset, discount: '-50%' },
  { id: 11, name: 'AIR MAX PLUS BLUE GRADIENT', oldPrice: '189,90', price: '109,90', installments: '9,99', image: tnBlueGradient, discount: '-42%' },
  { id: 12, name: 'AIR MAX PLUS DRIFT "BRED"', oldPrice: '199,90', price: '119,90', installments: '10,90', image: tnDrift, discount: '-40%' },
];

const SIZES = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

interface SelectedItem {
  product: CheckoutProduct;
  size: string;
}

const ComboSection: React.FC = () => {
  const { addItem, openCart } = useCart();
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [sizeModalProduct, setSizeModalProduct] = useState<CheckoutProduct | null>(null);
  const [pendingSize, setPendingSize] = useState('');
  const [comboAdded, setComboAdded] = useState(false);

  const isSelected = (id: number) => selected.some(s => s.product.id === id);
  const selectedCount = selected.length;
  const comboComplete = selectedCount === 3;

  const priceOf = (p: CheckoutProduct) => parseFloat(p.price.replace(',', '.'));
  const subtotal = selected.reduce((sum, s) => sum + priceOf(s.product), 0);
  const discount = subtotal * 0.5;
  const total = subtotal * 0.5;

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');

  const handleSelectProduct = (product: CheckoutProduct) => {
    if (isSelected(product.id)) {
      setSelected(prev => prev.filter(s => s.product.id !== product.id));
      return;
    }
    if (selectedCount >= 3) return;
    setSizeModalProduct(product);
    setPendingSize('');
  };

  const handleConfirmSize = () => {
    if (!sizeModalProduct || !pendingSize) return;
    setSelected(prev => [...prev, { product: sizeModalProduct, size: pendingSize }]);
    setSizeModalProduct(null);
    setPendingSize('');
  };

  const handleAddCombo = () => {
    selected.forEach(item => {
      addItem(item.product, item.size, 1);
    });
    setComboAdded(true);
    setSelected([]);
    setTimeout(() => {
      setComboAdded(false);
      openCart();
    }, 1200);
  };

  return (
    <section className="bg-black py-16 border-t-4 border-[#f39b19]">
      {/* Header */}
      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f39b19] border border-[#f39b19] px-4 py-1 mb-4">
            Oferta Exclusiva
          </span>
          <h2 className="text-white font-black uppercase leading-none mb-2" style={{ fontSize: 'clamp(1.8rem, 7vw, 4.5rem)', letterSpacing: '-0.03em' }}>
            MONTE SEU COMBO
          </h2>
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] max-w-xl">
            Escolha <strong className="text-[#f39b19]">3 tênis</strong> de sua preferência e ganhe{' '}
            <strong className="text-[#f39b19]">50% de desconto</strong> automático no total
          </p>

          {/* How it works */}
          <div className="flex gap-6 mt-6 flex-wrap justify-center">
            {[
              { step: '01', text: 'Escolha 3 tênis' },
              { step: '02', text: 'Selecione o tamanho' },
              { step: '03', text: 'Ganhe 50% OFF' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#f39b19] text-black text-[10px] font-black flex items-center justify-center">{step}</span>
                <span className="text-white text-[11px] font-bold uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky progress bar */}
      <div className="sticky top-0 z-30 bg-black border-y border-[#f39b19]/30 py-3 mb-8">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="flex gap-2 flex-1">
            {[0, 1, 2].map(i => {
              const item = selected[i];
              return (
                <div key={i} className={`flex-1 h-14 border-2 transition-all duration-300 flex items-center justify-center overflow-hidden relative ${item ? 'border-[#f39b19]' : 'border-white/10'}`}>
                  {item ? (
                    <>
                      <img src={item.product.image} alt={item.product.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <div className="relative z-10 flex flex-col items-center">
                        <Check size={14} className="text-[#f39b19]" />
                        <span className="text-white text-[9px] font-black uppercase leading-none mt-0.5">TAM {item.size}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{i + 1}º tênis</span>
                  )}
                </div>
              );
            })}
          </div>

          {comboComplete ? (
            <div className="flex-shrink-0 text-right">
              <p className="text-[#f39b19] text-[10px] font-black uppercase">50% OFF Aplicado!</p>
              <p className="text-white text-lg font-black">R$ {fmt(total)}</p>
              <p className="text-gray-500 text-[9px] line-through">R$ {fmt(subtotal)}</p>
            </div>
          ) : (
            <div className="flex-shrink-0 text-right">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest">{selectedCount}/3 selecionados</p>
              <p className="text-white text-sm font-black">{3 - selectedCount} restante{3 - selectedCount !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#f39b19]/10">
          {COMBO_PRODUCTS.map(product => {
            const sel = isSelected(product.id);
            const blocked = !sel && selectedCount >= 3;
            return (
              <div
                key={product.id}
                onClick={() => !blocked && handleSelectProduct(product)}
                className={`relative group bg-black overflow-hidden transition-all duration-200 cursor-pointer ${blocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#111]'} ${sel ? 'ring-2 ring-[#f39b19] ring-inset' : ''}`}
              >
                {/* Selected overlay */}
                {sel && (
                  <div className="absolute inset-0 bg-[#f39b19]/20 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-[#f39b19] rounded-full flex items-center justify-center shadow-lg">
                      <Check size={20} className="text-black" />
                    </div>
                  </div>
                )}

                {/* Discount badge */}
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-[#f39b19] text-black text-[9px] font-black px-1.5 py-0.5 block">-50%</span>
                </div>

                <div className="aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-300 ${!blocked ? 'group-hover:scale-105' : ''}`} />
                </div>

                <div className="p-3">
                  <h3 className="text-white text-[10px] font-black uppercase leading-tight mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-[9px] line-through">R$ {product.price}</p>
                  <p className="text-[#f39b19] font-black text-sm">R$ {fmt(priceOf(product) * 0.5)}</p>
                  <p className="text-gray-500 text-[9px]">no combo</p>
                </div>

                {!sel && !blocked && (
                  <div className="absolute inset-x-0 bottom-0 bg-[#f39b19] py-1.5 text-center text-[10px] font-black uppercase text-black tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    + Adicionar ao Combo
                  </div>
                )}
                {sel && (
                  <div className="absolute inset-x-0 bottom-0 bg-red-600 py-1.5 text-center text-[10px] font-black uppercase text-white tracking-widest">
                    ✕ Remover
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="container mx-auto px-4">
        {comboComplete && (
          <div className="bg-[#111] border border-[#f39b19]/30 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-[#f39b19]" />
                  <span className="text-[#f39b19] font-black text-xs uppercase tracking-widest">Seu Combo de 3 Tênis</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {selected.map(s => (
                    <div key={s.product.id} className="flex items-center gap-2 bg-white/5 px-3 py-1.5">
                      <img src={s.product.image} alt={s.product.name} className="w-8 h-8 object-cover" />
                      <div>
                        <p className="text-white text-[9px] font-black uppercase leading-none line-clamp-1">{s.product.name}</p>
                        <p className="text-gray-400 text-[9px]">TAM {s.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-gray-500 text-xs line-through">De R$ {fmt(subtotal)}</p>
                <p className="text-green-400 text-sm font-bold">-R$ {fmt(discount)} (50% OFF)</p>
                <p className="text-white font-black text-2xl">R$ {fmt(total)}</p>
                <p className="text-gray-500 text-[10px]">12x de R$ {fmt(total / 12)}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={comboComplete ? handleAddCombo : undefined}
          disabled={!comboComplete}
          className={`w-full py-5 font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
            comboAdded
              ? 'bg-green-500 text-white'
              : comboComplete
              ? 'bg-[#f39b19] text-black hover:bg-white cursor-pointer'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          {comboAdded ? (
            <>
              <Check size={20} />
              Combo adicionado ao carrinho!
            </>
          ) : comboComplete ? (
            <>
              <ShoppingBag size={20} />
              Adicionar Combo ao Carrinho — R$ {fmt(total)}
            </>
          ) : (
            <>
              <Zap size={20} />
              Selecione {3 - selectedCount} tênis para desbloquear o 50% OFF
            </>
          )}
        </button>
      </div>

      {/* Size Selection Modal */}
      {sizeModalProduct && (
        <>
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setSizeModalProduct(null)} />
          <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-white w-full md:max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img src={sizeModalProduct.image} alt={sizeModalProduct.name} className="w-14 h-14 object-cover bg-gray-50" />
              <div>
                <p className="font-black text-xs uppercase leading-tight">{sizeModalProduct.name}</p>
                <p className="text-[#f39b19] font-black text-sm mt-0.5">R$ {fmt(priceOf(sizeModalProduct) * 0.5)} <span className="text-gray-400 text-[10px] line-through font-normal">R$ {sizeModalProduct.price}</span></p>
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
              <button
                onClick={() => setSizeModalProduct(null)}
                className="flex-1 border border-gray-300 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSize}
                disabled={!pendingSize}
                className={`flex-[2] py-3 text-xs font-black uppercase tracking-widest transition-colors ${pendingSize ? 'bg-[#f39b19] text-black hover:bg-black hover:text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                Confirmar →
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ComboSection;
