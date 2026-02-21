import React, { useState } from 'react';
import { Truck, Loader2, MapPin, Package } from 'lucide-react';
import { fetchAddressByCEP, calculateShipping, ShippingOption } from '@/lib/shipping';

interface ShippingCalculatorProps {
  cartTotal: number;
  onSelectOption?: (option: ShippingOption) => void;
  selectedOptionId?: string;
  compact?: boolean;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  cartTotal,
  onSelectOption,
  selectedOptionId,
  compact = false,
}) => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [location, setLocation] = useState('');

  const maskCEP = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);

  const handleCalculate = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }

    setLoading(true);
    setError('');
    setOptions([]);

    const address = await fetchAddressByCEP(cleanCep);
    if (!address) {
      setError('CEP não encontrado');
      setLoading(false);
      return;
    }

    setLocation(`${address.localidade} - ${address.uf}`);
    const shippingOptions = calculateShipping(address.uf, cartTotal);
    setOptions(shippingOptions);
    setLoading(false);

    // Auto-select free shipping if available
    if (onSelectOption && shippingOptions.length > 0) {
      const freeOption = shippingOptions.find(o => o.id === 'free');
      onSelectOption(freeOption || shippingOptions[0]);
    }
  };

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');

  return (
    <div className={compact ? '' : 'border border-gray-200 p-4'}>
      <div className="flex items-center gap-2 mb-3">
        <Truck size={compact ? 14 : 16} className="text-[#f39b19]" />
        <span className={`font-black uppercase tracking-widest ${compact ? 'text-[10px]' : 'text-xs'}`}>
          Calcular Frete
        </span>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(maskCEP(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
          className={`flex-1 border border-gray-300 px-3 focus:outline-none focus:border-[#f39b19] ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'}`}
          maxLength={9}
        />
        <button
          onClick={handleCalculate}
          disabled={loading}
          className={`bg-black text-white font-black uppercase tracking-widest hover:bg-[#f39b19] transition-colors flex items-center gap-1 ${compact ? 'px-3 py-1.5 text-[9px]' : 'px-4 py-2 text-[10px]'}`}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Calcular'}
        </button>
      </div>

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-[#f39b19] underline mb-3 inline-block"
      >
        Não sei meu CEP
      </a>

      {error && <p className="text-red-500 text-[10px] font-bold mb-2">{error}</p>}

      {location && (
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-500">{location}</span>
        </div>
      )}

      {options.length > 0 && (
        <div className="space-y-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => onSelectOption?.(option)}
              className={`flex items-center justify-between p-2.5 border cursor-pointer transition-all ${
                selectedOptionId === option.id
                  ? 'border-[#f39b19] bg-[#f39b19]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {onSelectOption && (
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOptionId === option.id ? 'border-[#f39b19]' : 'border-gray-300'
                  }`}>
                    {selectedOptionId === option.id && (
                      <div className="w-2 h-2 rounded-full bg-[#f39b19]" />
                    )}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Package size={12} className={option.price === 0 ? 'text-green-600' : 'text-gray-500'} />
                    <span className={`font-black uppercase ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                      {option.name}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {option.carrier} · {option.days}
                  </p>
                </div>
              </div>
              <span className={`font-black ${compact ? 'text-xs' : 'text-sm'} ${
                option.price === 0 ? 'text-green-600' : 'text-black'
              }`}>
                {option.price === 0 ? 'GRÁTIS' : `R$ ${fmt(option.price)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
