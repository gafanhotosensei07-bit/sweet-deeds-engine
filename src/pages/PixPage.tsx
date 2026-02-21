import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, CheckCheck, ArrowLeft, Shield, Truck, Package } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface PixPageState {
  pixQrCode?: string;
  pixQrCodeImage?: string;
  pixAmount: number;
  pixPrice: string;
  orderId?: string;
  product: {
    name: string;
    image: string;
    price: string;
  };
  selectedSize: string;
  quantity: number;
  usedGateway?: string;
}

const PixPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PixPageState | null;
  const [copied, setCopied] = useState(false);
  const pixPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling for payment confirmation
  useEffect(() => {
    if (!state?.orderId) return;

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    let attempts = 0;
    const MAX_ATTEMPTS = 40;

    pixPollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(pixPollRef.current!);
        return;
      }
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/check-pix-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
          body: JSON.stringify({ orderId: state.orderId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'paid' || data.status === 'approved' || data.paid === true) {
          clearInterval(pixPollRef.current!);
          trackEvent('pix_paid', {
            productName: state.product.name,
            productPrice: parseFloat(state.product.price.replace(',', '.')),
            orderId: state.orderId,
            amount: state.pixAmount,
          });
          if (data.dbOrderId) {
            navigate(`/pedido/${data.dbOrderId}`, { replace: true });
          }
        }
      } catch {
        // silent
      }
    }, 15_000);

    return () => {
      if (pixPollRef.current) clearInterval(pixPollRef.current);
    };
  }, [state?.orderId, navigate, state?.product.name, state?.product.price, state?.pixAmount]);

  const handleCopy = () => {
    if (state?.pixQrCode) {
      navigator.clipboard.writeText(state.pixQrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Maven_Pro',sans-serif]">
        <div className="text-center">
          <QrCode size={48} className="text-gray-300 mx-auto mb-4" />
          <h1 className="font-black text-xl uppercase mb-2">PIX não encontrado</h1>
          <p className="text-gray-500 text-sm mb-6">Volte à loja e tente novamente.</p>
          <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#f39b19] transition-colors">
            Voltar à Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Maven_Pro',sans-serif]">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#f39b19] transition-colors">
            <ArrowLeft size={16} /> Loja
          </button>
          <span className="font-black text-sm uppercase tracking-widest">Pagar via PIX</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        {/* QR Code Card */}
        <div className="bg-white border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-black uppercase mb-1">PIX Gerado!</h1>
          <p className="text-gray-500 text-xs mb-6">Escaneie o QR Code ou copie o código para pagar</p>

          {/* QR Code */}
          {state.pixQrCodeImage ? (
            <div className="w-52 h-52 mx-auto mb-6 border-4 border-green-500 p-1 bg-white flex items-center justify-center">
              <img
                src={state.pixQrCodeImage.startsWith('data:') ? state.pixQrCodeImage : `data:image/png;base64,${state.pixQrCodeImage}`}
                alt="QR Code PIX"
                className="w-full h-full object-contain"
              />
            </div>
          ) : state.pixQrCode ? (
            <div className="w-52 h-52 mx-auto mb-6 border-4 border-green-500 p-1 bg-white flex items-center justify-center">
              <QRCodeSVG value={state.pixQrCode} size={192} level="M" />
            </div>
          ) : (
            <div className="w-52 h-52 mx-auto mb-6 border-4 border-green-500 bg-green-50 flex flex-col items-center justify-center gap-2">
              <QrCode size={64} className="text-green-400" />
              <span className="text-green-600 text-[10px] font-bold uppercase">QR Code PIX</span>
            </div>
          )}

          {/* Value */}
          <div className="bg-green-50 border border-green-200 p-4 mb-5">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Valor a pagar (PIX com 10% off)</p>
            <p className="font-black text-3xl text-green-700">R$ {state.pixPrice}</p>
          </div>

          {/* Copy code */}
          {state.pixQrCode && (
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Código PIX Copia e Cola</p>
              <div className="bg-gray-50 border border-gray-200 p-3 mb-3">
                <p className="text-[10px] text-gray-600 break-all font-mono leading-relaxed">{state.pixQrCode}</p>
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
          )}
        </div>

        {/* Product Summary */}
        <div className="bg-white border border-gray-200 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Resumo do Pedido</p>
          <div className="flex gap-3">
            <img src={state.product.image} alt={state.product.name} className="w-16 h-16 object-cover bg-gray-50" />
            <div>
              <p className="font-black text-xs uppercase leading-tight">{state.product.name}</p>
              <p className="text-gray-500 text-xs mt-1">Tam. {state.selectedSize} · Qtd. {state.quantity}</p>
              <p className="font-black text-sm text-green-700 mt-1">R$ {state.pixPrice}</p>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Shield size={16} />, text: 'Compra Segura' },
            { icon: <Truck size={16} />, text: 'Entrega Garantida' },
            { icon: <Package size={16} />, text: 'Qualidade Premium' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 p-3 flex flex-col items-center text-center">
              <div className="text-[#f39b19] mb-1">{item.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-black text-white py-4 font-black text-xs uppercase tracking-widest hover:bg-[#f39b19] transition-colors"
        >
          Voltar à Loja
        </button>
      </div>
    </div>
  );
};

export default PixPage;
