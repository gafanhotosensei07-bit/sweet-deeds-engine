import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, QrCode, Check, Truck, Shield, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createWbuyOrder } from '@/lib/wbuyApi';

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [form, setForm] = useState({ name: '', cpf: '', phone: '', cep: '', address: '', number: '', city: '', state: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const pixTotal = (totalPrice * 0.9).toFixed(2).replace('.', ',');
  const pixDiscount = (totalPrice * 0.1).toFixed(2).replace('.', ',');
  const subtotalStr = totalPrice.toFixed(2).replace('.', ',');

  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
  const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Obrigatório';
    if (!form.cpf.trim()) e.cpf = 'Obrigatório';
    if (!form.phone.trim()) e.phone = 'Obrigatório';
    if (!form.cep.trim()) e.cep = 'Obrigatório';
    if (!form.address.trim()) e.address = 'Obrigatório';
    if (!form.number.trim()) e.number = 'Obrigatório';
    if (!form.city.trim()) e.city = 'Obrigatório';
    if (!form.state.trim()) e.state = 'Obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFinish = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createWbuyOrder({
        customer: form,
        items: items.map(item => ({
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
          image: item.product.image,
        })),
        totalPrice: parseFloat((totalPrice * 0.9).toFixed(2)),
      });
    } catch (err) {
      console.error('wBuy order error:', err);
    } finally {
      setLoading(false);
      setStep('success');
      clearCart();
    }
  };

  const handleClose = () => {
    closeCart();
    setTimeout(() => { setStep('cart'); setForm({ name: '', cpf: '', phone: '', cep: '', address: '', number: '', city: '', state: '' }); setErrors({}); }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#f39b19]" />
            <span className="font-black uppercase tracking-widest text-sm">
              {step === 'success' ? 'PEDIDO CONFIRMADO' : step === 'form' ? 'SEUS DADOS' : `CARRINHO (${totalItems})`}
            </span>
          </div>
          <button onClick={handleClose} className="hover:text-[#f39b19] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* PIX banner */}
        {step !== 'success' && (
          <div className="bg-green-600 px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
            <QrCode size={13} className="text-white" />
            <span className="text-white text-[10px] font-black uppercase tracking-widest">PIX · 10% de desconto</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Pedido Recebido!</h3>
              <p className="text-gray-500 text-sm mb-6">Envie o comprovante do PIX pelo WhatsApp para confirmar seu pedido.</p>
              <div className="w-full bg-green-50 border border-green-200 p-4 mb-5 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode size={15} className="text-green-700" />
                  <span className="text-green-700 font-black text-xs uppercase">Chave PIX</span>
                </div>
                <p className="text-gray-500 text-[11px] mb-1">Chave aleatória:</p>
                <p className="font-black text-sm text-gray-800 break-all">sua-chave-pix@aqui.com</p>
                <p className="text-gray-500 text-[11px] mt-2">Valor a pagar:</p>
                <p className="font-black text-xl text-green-700">R$ {pixTotal}</p>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=551121154200"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25d366] text-white py-3 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1da851] transition-colors"
              >
                Enviar comprovante no WhatsApp
              </a>
              <button onClick={handleClose} className="mt-3 text-xs text-gray-400 underline">Fechar</button>
            </div>
          )}

          {/* CART */}
          {step === 'cart' && (
            <div className="p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag size={48} className="text-gray-200 mb-4" />
                  <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Carrinho vazio</p>
                  <p className="text-gray-300 text-xs mt-1">Adicione produtos para continuar</p>
                  <button onClick={handleClose} className="mt-6 bg-[#f39b19] text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 mb-6">
                    {items.map((item) => {
                      const price = parseFloat(item.product.price.replace(',', '.'));
                      const itemTotal = (price * item.quantity).toFixed(2).replace('.', ',');
                      return (
                        <div key={`${item.product.id}-${item.size}`} className="flex gap-3 border-b border-gray-100 pb-4">
                          <div className="w-16 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[11px] uppercase leading-tight line-clamp-2 mb-1">{item.product.name}</p>
                            <p className="text-gray-400 text-[10px] mb-2">Tam. {item.size}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                  className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold hover:border-[#f39b19] hover:text-[#f39b19] transition-colors"
                                >−</button>
                                <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                  className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold hover:border-[#f39b19] hover:text-[#f39b19] transition-colors"
                                >+</button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm">R$ {itemTotal}</span>
                                <button
                                  onClick={() => removeItem(item.product.id, item.size)}
                                  className="text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="bg-green-50 border border-green-200 p-4 mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Subtotal</span><span>R$ {subtotalStr}</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-600 mb-1">
                      <span>Desconto PIX (10%)</span><span>-R$ {pixDiscount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-600 mb-1">
                      <span>Frete</span><span className="font-bold">GRÁTIS</span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-black text-sm uppercase">Total PIX</span>
                      <span className="font-black text-xl text-green-700">R$ {pixTotal}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[{ icon: Shield, text: 'Compra Segura' }, { icon: Truck, text: 'Frete Grátis' }, { icon: Check, text: 'Garantia 30d' }].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex flex-col items-center gap-1 text-center">
                        <Icon size={14} className="text-[#f39b19]" />
                        <span className="text-[9px] text-gray-500">{text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep('form')}
                    className="w-full bg-[#f39b19] text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black transition-colors"
                  >
                    Finalizar Compra →
                  </button>
                </>
              )}
            </div>
          )}

          {/* FORM */}
          {step === 'form' && (
            <div className="p-5">
              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Dados Pessoais</h4>
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { key: 'name', label: 'Nome completo', placeholder: 'Seu nome' },
                  { key: 'cpf', label: 'CPF', placeholder: '000.000.000-00', mask: maskCPF },
                  { key: 'phone', label: 'WhatsApp / Telefone', placeholder: '(00) 00000-0000', mask: maskPhone },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => {
                        const val = field.mask ? field.mask(e.target.value) : e.target.value;
                        setForm(f => ({ ...f, [field.key]: val }));
                        setErrors(er => ({ ...er, [field.key]: '' }));
                      }}
                      className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#f39b19] transition-colors ${errors[field.key] ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors[field.key] && <p className="text-red-500 text-[10px] mt-1">{errors[field.key]}</p>}
                  </div>
                ))}
              </div>

              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Endereço de Entrega</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { key: 'cep', label: 'CEP', placeholder: '00000-000', mask: maskCEP, cols: 1 },
                  { key: 'address', label: 'Rua / Avenida', placeholder: 'Nome da rua', cols: 2 },
                  { key: 'number', label: 'Número', placeholder: 'Nº', cols: 1 },
                  { key: 'city', label: 'Cidade', placeholder: 'Sua cidade', cols: 1 },
                  { key: 'state', label: 'Estado', placeholder: 'SP', cols: 1 },
                ].map(field => (
                  <div key={field.key} className={field.cols === 2 ? 'col-span-2' : ''}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => {
                        const val = field.mask ? field.mask(e.target.value) : e.target.value;
                        setForm(f => ({ ...f, [field.key]: val }));
                        setErrors(er => ({ ...er, [field.key]: '' }));
                      }}
                      className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#f39b19] transition-colors ${errors[field.key] ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors[field.key] && <p className="text-red-500 text-[10px] mt-1">{errors[field.key]}</p>}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('cart')}
                  className="flex-1 border border-black text-black py-3.5 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                >← Voltar</button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-[2] bg-black text-white py-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#f39b19] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Processando...</>
                  ) : (
                    'Finalizar Pedido ✓'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
