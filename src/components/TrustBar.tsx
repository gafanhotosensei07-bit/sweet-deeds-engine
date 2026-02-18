import React from 'react';

const items = [
  { icon: '🚚', label: 'Frete Grátis', sub: 'Acima de R$299' },
  { icon: '🔒', label: 'Compra Segura', sub: 'Pagamento protegido' },
  { icon: '↩️', label: 'Troca Fácil', sub: '30 dias para trocar' },
  { icon: '⭐', label: '4.9 no Google', sub: '+1.200 avaliações' },
];

const TrustBar = () => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-sm text-black">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
