import React, { useState } from 'react';
import { X, ShoppingBag, Truck, Shield, QrCode, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface CheckoutProduct {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  installments: string;
  image: string;
  discount: string;
}

interface CheckoutModalProps {
  product: CheckoutProduct | null;
  onClose: () => void;
}

const SIZES = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'product' | 'form' | 'success'>('product');
  const [form, setForm] = useState({
    name: '', cpf: '', phone: '', cep: '', address: '', number: '', city: '', state: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!product) return null;

  const basePrice = parseFloat(product.price.replace(',', '.'));
  const pixPrice = (basePrice * 0.9 * quantity).toFixed(2).replace('.', ',');
  const pixDiscount = ((basePrice * quantity) * 0.1).toFixed(2).replace('.', ',');
  const subtotal = (basePrice * quantity).toFixed(2).replace('.', ',');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedSize) newErrors.size = 'Selecione um tamanho';
    if (step === 'form') {
      if (!form.name.trim()) newErrors.name = 'Nome obrigatório';
      if (!form.cpf.trim()) newErrors.cpf = 'CPF obrigatório';
      if (!form.phone.trim()) newErrors.phone = 'Telefone obrigatório';
      if (!form.cep.trim()) newErrors.cep = 'CEP obrigatório';
      if (!form.address.trim()) newErrors.address = 'Endereço obrigatório';
      if (!form.number.trim()) newErrors.number = 'Número obrigatório';
      if (!form.city.trim()) newErrors.city = 'Cidade obrigatória';
      if (!form.state.trim()) newErrors.state = 'Estado obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      addItem(product, selectedSize, quantity);
      onClose();
    }
  };
  const handleFinish = () => { if (validate()) setStep('success'); };

  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
  const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-xl max-h-[95vh] md:max-h-[90vh] bg-white overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#f39b19]" />
            <span className="font-black uppercase tracking-widest text-sm">
              {step === 'success' ? 'PEDIDO CONFIRMADO' : 'FINALIZAR COMPRA'}
            </span>
          </div>
          <button onClick={onClose} className="hover:text-[#f39b19] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* PIX Badge */}
        {step !== 'success' && (
          <div className="bg-green-600 px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
            <QrCode size={14} className="text-white" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">
              Pagamento exclusivo via PIX · 10% de desconto
            </span>
          </div>
        )}

        {/* Progress */}
        {step !== 'success' && (
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {['product', 'form'].map((s, i) => (
              <div
                key={s}
                className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  (step === 'product' && i === 0) || (step === 'form' && i === 1)
                    ? 'bg-[#f39b19] text-white'
                    : step === 'form' && i === 0
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}. {s === 'product' ? 'Produto' : 'Seus Dados'}
              </div>
            ))}
          </div>
        )}

        <div className="overflow-y-auto flex-1">

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Pedido Recebido!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Envie o comprovante do PIX pelo WhatsApp para confirmar seu pedido.
              </p>

              {/* PIX info box */}
              <div className="w-full bg-green-50 border border-green-200 p-4 mb-5 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-green-700" />
                  <span className="text-green-700 font-black text-xs uppercase tracking-widest">Chave PIX</span>
                </div>
                <p className="text-gray-500 text-[11px] mb-1">Chave aleatória:</p>
                <p className="font-black text-sm text-gray-800 break-all">sua-chave-pix@aqui.com</p>
                <p className="text-gray-500 text-[11px] mt-2">Valor a pagar:</p>
                <p className="font-black text-xl text-green-700">R$ {pixPrice}</p>
              </div>

              <div className="w-full bg-gray-50 border border-gray-200 p-3 mb-5 text-left">
                <div className="flex gap-3">
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover" />
                  <div>
                    <p className="font-black text-xs uppercase">{product.name}</p>
                    <p className="text-gray-500 text-xs">Tam. {selectedSize} · Qtd. {quantity}</p>
                    <p className="text-[#f39b19] font-black mt-0.5">R$ {pixPrice}</p>
                  </div>
                </div>
              </div>

              <a
                href="https://api.whatsapp.com/send?phone=551121154200"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25d366] text-white py-3 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1da851] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Enviar comprovante no WhatsApp
              </a>
              <button onClick={onClose} className="mt-3 text-xs text-gray-400 underline">Fechar</button>
            </div>
          )}

          {/* STEP 1: Produto */}
          {step === 'product' && (
            <div className="p-6">
              {/* Product */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="inline-block bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 mb-1">
                    {product.discount}
                  </span>
                  <h3 className="font-black text-sm uppercase leading-tight mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-xs line-through">de R$ {product.oldPrice}</p>
                  <p className="text-xl font-black">R$ {product.price}</p>
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-black text-xs uppercase tracking-widest">Tamanho (BR)</label>
                  {errors.size && <span className="text-red-500 text-[10px]">{errors.size}</span>}
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setErrors(e => ({ ...e, size: '' })); }}
                      className={`py-2 text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:border-[#f39b19] hover:text-[#f39b19]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="font-black text-xs uppercase tracking-widest block mb-3">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 border border-gray-300 flex items-center justify-center font-bold hover:border-[#f39b19] hover:text-[#f39b19] transition-colors"
                  >−</button>
                  <span className="font-black text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(5, q + 1))}
                    className="w-9 h-9 border border-gray-300 flex items-center justify-center font-bold hover:border-[#f39b19] hover:text-[#f39b19] transition-colors"
                  >+</button>
                </div>
              </div>

              {/* PIX info */}
              <div className="bg-green-50 border border-green-200 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-green-700" />
                  <span className="text-green-700 font-black text-xs uppercase tracking-widest">Pagamento via PIX</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Subtotal ({quantity}x)</span>
                  <span>R$ {subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-green-600 mb-1">
                  <span>Desconto PIX (10%)</span>
                  <span>-R$ {pixDiscount}</span>
                </div>
                <div className="flex justify-between text-xs text-green-600 mb-1">
                  <span>Frete</span>
                  <span className="font-bold">GRÁTIS</span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-black text-sm uppercase">Total PIX</span>
                  <span className="font-black text-xl text-green-700">R$ {pixPrice}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { icon: Shield, text: 'Compra Segura' },
                  { icon: Truck, text: 'Frete Grátis' },
                  { icon: Check, text: 'Garantia 30 dias' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 text-center">
                    <Icon size={16} className="text-[#f39b19]" />
                    <span className="text-[9px] text-gray-500 leading-tight">{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-[#f39b19] text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black transition-colors"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 2: Dados */}
          {step === 'form' && (
            <div className="p-6">
              <div className="flex gap-3 mb-6 bg-gray-50 p-3">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                <div>
                  <p className="font-black text-xs uppercase">{product.name}</p>
                  <p className="text-gray-500 text-xs">Tam. {selectedSize} · Qtd. {quantity}</p>
                  <p className="font-black text-green-700">R$ {pixPrice} <span className="text-[10px] font-normal text-gray-400">(PIX)</span></p>
                </div>
              </div>

              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Dados Pessoais</h4>
              <div className="grid grid-cols-1 gap-3 mb-5">
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
                  onClick={() => setStep('product')}
                  className="flex-1 border border-black text-black py-3.5 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                >← Voltar</button>
                <button
                  onClick={handleFinish}
                  className="flex-[2] bg-black text-white py-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#f39b19] transition-colors"
                >Finalizar Pedido ✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
