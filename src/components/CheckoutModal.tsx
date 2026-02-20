import React, { useState } from 'react';
import { X, ShoppingBag, Truck, Shield, QrCode, Check, Loader2, Copy, CheckCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createZeroOnePayOrder, ZeroOnePayResult } from '@/lib/wbuyApi';

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
  const [step, setStep] = useState<'product' | 'form' | 'pix'>('product');
  const [form, setForm] = useState({
    name: '', cpf: '', phone: '', cep: '', address: '', number: '', city: '', state: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [pixResult, setPixResult] = useState<ZeroOnePayResult | null>(null);
  const [copied, setCopied] = useState(false);

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
      setStep('form');
    }
  };

  const handleFinish = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await createZeroOnePayOrder({
        customer: form,
        items: [{
          name: product.name,
          price: product.price,
          size: selectedSize,
          quantity,
          image: product.image,
        }],
        totalPrice: parseFloat((basePrice * 0.9 * quantity).toFixed(2)),
      });
      setPixResult(result);
      setStep('pix');
    } catch (err) {
      console.error('ZeroOnePay order error:', err);
      setStep('pix');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (pixResult?.pixQrCode) {
      navigator.clipboard.writeText(pixResult.pixQrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

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
              {step === 'pix' ? 'PAGAR VIA PIX' : 'FINALIZAR COMPRA'}
            </span>
          </div>
          <button onClick={onClose} className="hover:text-[#f39b19] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* PIX Badge */}
        {step !== 'pix' && (
          <div className="bg-green-600 px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
            <QrCode size={14} className="text-white" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">
              Pagamento exclusivo via PIX · 10% de desconto
            </span>
          </div>
        )}

        {/* Progress */}
        {step !== 'pix' && (
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

          {/* PIX STEP */}
          {step === 'pix' && (
            <div className="flex flex-col items-center py-8 px-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <QrCode size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase mb-1">PIX Gerado!</h3>
              <p className="text-gray-500 text-xs mb-5">Escaneie o QR Code ou copie o código para pagar</p>

              {/* QR Code Image */}
              {pixResult?.pixQrCodeImage ? (
                <div className="w-48 h-48 mb-5 border-4 border-green-500 p-1 bg-white flex items-center justify-center">
                  <img
                    src={pixResult.pixQrCodeImage.startsWith('data:') ? pixResult.pixQrCodeImage : `data:image/png;base64,${pixResult.pixQrCodeImage}`}
                    alt="QR Code PIX"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 mb-5 border-4 border-green-500 bg-green-50 flex flex-col items-center justify-center gap-2">
                  <QrCode size={64} className="text-green-400" />
                  <span className="text-green-600 text-[10px] font-bold uppercase">QR Code PIX</span>
                </div>
              )}

              {/* Valor */}
              <div className="w-full bg-green-50 border border-green-200 p-3 mb-4 text-center">
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Valor a pagar (PIX com 10% off)</p>
                <p className="font-black text-2xl text-green-700">R$ {pixPrice}</p>
              </div>

              {/* Produto resumo */}
              <div className="w-full bg-gray-50 border border-gray-200 p-3 mb-4 text-left">
                <div className="flex gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                  <div>
                    <p className="font-black text-xs uppercase">{product.name}</p>
                    <p className="text-gray-500 text-xs">Tam. {selectedSize} · Qtd. {quantity}</p>
                  </div>
                </div>
              </div>

              {/* Copia e cola */}
              {pixResult?.pixQrCode ? (
                <div className="w-full mb-4">
                  <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 text-left">Código PIX Copia e Cola</p>
                  <div className="bg-gray-50 border border-gray-200 p-3 text-left mb-2">
                    <p className="text-[10px] text-gray-600 break-all font-mono leading-relaxed">{pixResult.pixQrCode}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`w-full py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                      copied ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-[#f39b19]'
                    }`}
                  >
                    {copied ? <><CheckCheck size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Código PIX</>}
                  </button>
                </div>
              ) : (
                <div className="w-full mb-4">
                  <p className="text-xs text-gray-500 mb-3">Para pagar, acesse o checkout completo:</p>
                  <a
                    href={pixResult?.checkoutUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <QrCode size={14} /> Abrir PIX para Pagar
                  </a>
                </div>
              )}

              <button onClick={onClose} className="text-xs text-gray-400 underline">Fechar</button>
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
                  { key: 'phone', label: 'Telefone', placeholder: '(00) 00000-0000', mask: maskPhone },
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
                  disabled={loading}
                  className="flex-[2] bg-black text-white py-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#f39b19] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Gerando PIX...</>
                  ) : (
                    'Gerar PIX ✓'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
