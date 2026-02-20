import React, { useState } from 'react';
import CheckoutModal, { CheckoutProduct } from './CheckoutModal';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

// Imagens autênticas de lojas oficiais (Nike, Vans, Adidas)
import vansOldSkoolKids from '@/assets/kids/popular/vans-old-skool-kids.jpg';
import adidasSuperstar360 from '@/assets/kids/popular/adidas-superstar-360-kids.jpg';
import nikeAf1Preto from '@/assets/kids/popular/nike-af1-preto-kids.jpg';
import nikeRevolution7Roxo from '@/assets/kids/popular/nike-revolution7-roxo.jpg';
import nikeCourtBoroughVerde from '@/assets/kids/popular/nike-court-borough-verde.jpg';
import nikeCourtBoroughAzul2 from '@/assets/kids/popular/nike-court-borough-azul2.jpg';
import nikeCourtBoroughRoxo from '@/assets/kids/popular/nike-court-borough-roxo.jpg';
import nikeTeamHustleAzul from '@/assets/kids/popular/nike-team-hustle-azul.jpg';
import nikeFlexRunnerRoxo from '@/assets/kids/popular/nike-flex-runner-roxo.jpg';
import nikeFlexRunnerBebePreto from '@/assets/kids/popular/nike-flex-runner-bebe-preto.jpg';
import nikeCosmicRunnerRosa from '@/assets/kids/popular/nike-cosmic-runner-rosa.jpg';
import nikeCosmicRunnerAzul from '@/assets/kids/popular/nike-cosmic-runner-azul.jpg';
import nikeCourtBoroughLaranja from '@/assets/kids/popular/nike-court-borough-laranja.jpg';
import nikeFlexRunnerLaranja from '@/assets/kids/popular/nike-flex-runner-laranja.jpg';
import nikeTeamHustleBranco from '@/assets/kids/popular/nike-team-hustle-branco.jpg';
import nikeTeamHustleKidsBranco from '@/assets/kids/popular/nike-team-hustle-kids-branco.jpg';
import nikeCourtBoroughBebeRosa from '@/assets/kids/popular/nike-court-borough-bebe-rosa.jpg';
import nikeCourtBoroughBebeVerde from '@/assets/kids/popular/nike-court-borough-bebe-verde.jpg';
// Reutilizando imagens já disponíveis para Dunk e AF1
import dunkLowPanda from '@/assets/kids/dunk-low-panda.jpg';
import af1LeBranco from '@/assets/kids/af1-le-branco.jpg';

interface KidsProduct extends CheckoutProduct {
  brand: string;
  ageGroup: string;
  category: string;
  sizes: string[];
  badge: string;
  popularity: string;
  feature: string;
}

const popularKidsProducts: KidsProduct[] = [
  {
    id: 401,
    name: 'VANS OLD SKOOL INFANTIL',
    oldPrice: '149,90',
    price: '89,90',
    installments: '8,17',
    image: vansOldSkoolKids,
    discount: '-40%',
    brand: 'Vans',
    ageGroup: 'Crianças',
    category: 'Casual / Skate',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32', '33'],
    badge: '🛹 Ícone do Skate',
    popularity: '#1 Vans Infantil',
    feature: 'Sola vulcanizada, lateral Sidestripe clássica, favorito das crianças no Brasil',
  },
  {
    id: 402,
    name: 'ADIDAS SUPERSTAR 360 INFANTIL',
    oldPrice: '159,90',
    price: '99,90',
    installments: '9,08',
    image: adidasSuperstar360,
    discount: '-38%',
    brand: 'Adidas',
    ageGroup: 'Bebês / Crianças',
    category: 'Casual',
    sizes: ['19', '20', '21', '22', '23', '24', '25', '26', '27'],
    badge: '⭐ Clássico Mundial',
    popularity: '#1 Adidas Infantil',
    feature: 'Shell Toe icônico, velcro 360°, sem cadarço — perfeito para os pequenos',
  },
  {
    id: 403,
    name: 'NIKE AIR FORCE 1 LE PRETO',
    oldPrice: '179,90',
    price: '109,90',
    installments: '9,99',
    image: nikeAf1Preto,
    discount: '-39%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual / Streetwear',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🔥 Mais Desejado',
    popularity: '#2 Nike Infantil',
    feature: 'Couro premium, amortecimento Air, o sneaker mais copiado do streetwear nacional',
  },
  {
    id: 404,
    name: 'NIKE DUNK LOW PANDA INFANTIL',
    oldPrice: '189,90',
    price: '119,90',
    installments: '10,90',
    image: dunkLowPanda,
    discount: '-37%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual / Streetwear',
    sizes: ['34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🐼 Trend 2025',
    popularity: '#1 Nike Dunk Kids',
    feature: 'Preto e branco icônico Panda, o colorway mais viral do TikTok e Instagram',
  },
  {
    id: 405,
    name: 'NIKE AIR FORCE 1 LE BRANCO',
    oldPrice: '189,90',
    price: '114,90',
    installments: '10,44',
    image: af1LeBranco,
    discount: '-40%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '⚪ All White',
    popularity: '#3 Nike Infantil',
    feature: 'Todo branco, versátil e clean — combina com qualquer roupa escolar ou passeio',
  },
  {
    id: 406,
    name: 'NIKE REVOLUTION 7 ROXO',
    oldPrice: '109,90',
    price: '69,90',
    installments: '6,35',
    image: nikeRevolution7Roxo,
    discount: '-36%',
    brand: 'Nike',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'],
    badge: '💜 Super Leve',
    popularity: 'Top Corrida Kids',
    feature: 'Leve, respirável e com fivela de ajuste — ideal para escolinhas de esporte',
  },
  {
    id: 407,
    name: 'NIKE COURT BOROUGH LOW VERDE',
    oldPrice: '149,90',
    price: '94,90',
    installments: '8,62',
    image: nikeCourtBoroughVerde,
    discount: '-37%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🌿 Colorido',
    popularity: 'Preferido das Meninas',
    feature: 'Design court clássico renovado, disponível em várias cores vibrantes',
  },
  {
    id: 408,
    name: 'NIKE COURT BOROUGH LOW AZUL',
    oldPrice: '139,90',
    price: '84,90',
    installments: '7,71',
    image: nikeCourtBoroughAzul2,
    discount: '-39%',
    brand: 'Nike',
    ageGroup: 'Crianças',
    category: 'Casual',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '💙 Kids Favorito',
    popularity: 'Top Casual Crianças',
    feature: 'Palmilha acolchoada e cabedal em couro sintético — durável para o dia a dia',
  },
  {
    id: 409,
    name: 'NIKE COURT BOROUGH LOW ROXO',
    oldPrice: '149,90',
    price: '79,90',
    installments: '7,26',
    image: nikeCourtBoroughRoxo,
    discount: '-47%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Casual',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '💜 Roxo Trend',
    popularity: 'Em Alta 2025',
    feature: 'Cor roxo vibrante que virou tendência entre pré-adolescentes brasileiras',
  },
  {
    id: 410,
    name: 'NIKE TEAM HUSTLE D12 AZUL',
    oldPrice: '169,90',
    price: '104,90',
    installments: '9,53',
    image: nikeTeamHustleAzul,
    discount: '-38%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Basquete',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🏀 Basquete #1',
    popularity: '#1 Basquete Kids',
    feature: 'Cano alto, suporte lateral e amortecimento — o tênis de basquete nº1 das escolinhas',
  },
  {
    id: 411,
    name: 'NIKE FLEX RUNNER 4 ROXO',
    oldPrice: '129,90',
    price: '74,90',
    installments: '6,80',
    image: nikeFlexRunnerRoxo,
    discount: '-42%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🌈 Mais Colorido',
    popularity: 'Top Feminino',
    feature: 'Slip-on sem cadarço, elástico de ajuste — a criança calça sozinha com facilidade',
  },
  {
    id: 412,
    name: 'NIKE FLEX RUNNER 4 BEBÊ PRETO',
    oldPrice: '99,90',
    price: '59,90',
    installments: '5,44',
    image: nikeFlexRunnerBebePreto,
    discount: '-40%',
    brand: 'Nike',
    ageGroup: 'Bebês',
    category: 'Corrida / Primeiros Passos',
    sizes: ['16', '17.5', '18.5', '20', '21', '22', '22.5', '23'],
    badge: '👶 Primeiros Passos',
    popularity: '#1 Bebê Nike',
    feature: 'Solado flexível, biqueira reforçada, ideal para os primeiros passos dos bebês',
  },
  {
    id: 413,
    name: 'NIKE COSMIC RUNNER ROSA',
    oldPrice: '139,90',
    price: '87,90',
    installments: '7,99',
    image: nikeCosmicRunnerRosa,
    discount: '-37%',
    brand: 'Nike',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '🌸 Feminino Trend',
    popularity: 'Favorito Meninas',
    feature: 'Rosa vibrante com malha respirável — tendência nas escolinhas e parques em 2025',
  },
  {
    id: 414,
    name: 'NIKE COSMIC RUNNER AZUL',
    oldPrice: '139,90',
    price: '92,90',
    installments: '8,44',
    image: nikeCosmicRunnerAzul,
    discount: '-34%',
    brand: 'Nike',
    ageGroup: 'Crianças',
    category: 'Corrida',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    badge: '💙 Favorito Meninos',
    popularity: 'Top Masculino Kids',
    feature: 'Azul royal com swoosh branco — o modelo mais pedido por meninos de 6 a 10 anos',
  },
  {
    id: 415,
    name: 'NIKE COURT BOROUGH BEBÊ LARANJA',
    oldPrice: '109,90',
    price: '67,90',
    installments: '6,17',
    image: nikeCourtBoroughLaranja,
    discount: '-38%',
    brand: 'Nike',
    ageGroup: 'Bebês',
    category: 'Casual',
    sizes: ['16', '17.5', '18.5', '20', '21', '22', '22.5', '23'],
    badge: '🍊 Bebê Estiloso',
    popularity: 'Top Bebê Casual',
    feature: 'Velcro de ajuste fácil, cores alegres — fácil de calçar e muito estiloso',
  },
  {
    id: 416,
    name: 'NIKE FLEX RUNNER 4 LARANJA',
    oldPrice: '129,90',
    price: '77,90',
    installments: '7,08',
    image: nikeFlexRunnerLaranja,
    discount: '-40%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Corrida',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '🔶 Novo 2025',
    popularity: 'Lançamento',
    feature: 'Colorway laranja 2025, exclusivo para pré-adolescentes que curtem se destacar',
  },
  {
    id: 417,
    name: 'NIKE TEAM HUSTLE D12 BRANCO',
    oldPrice: '169,90',
    price: '112,90',
    installments: '10,26',
    image: nikeTeamHustleBranco,
    discount: '-34%',
    brand: 'Nike',
    ageGroup: 'Pré-Adolescentes',
    category: 'Basquete',
    sizes: ['33', '34', '35', '35.5', '36', '37', '37.5', '38'],
    badge: '⚪ Basquete Clean',
    popularity: 'Escolinhas BR',
    feature: 'Branco e preto limpo — o uniforme oficial das escolinhas de basquete de todo o Brasil',
  },
  {
    id: 418,
    name: 'NIKE TEAM HUSTLE D12 KIDS BRANCO',
    oldPrice: '149,90',
    price: '97,90',
    installments: '8,90',
    image: nikeTeamHustleKidsBranco,
    discount: '-35%',
    brand: 'Nike',
    ageGroup: 'Crianças',
    category: 'Basquete',
    sizes: ['28', '29', '30', '30.5', '31', '32', '32.5', '33'],
    badge: '🏀 Versão Kids',
    popularity: 'Top Basquete Crianças',
    feature: 'Versão menor do Team Hustle, para crianças que começam nas escolinhas de basquete',
  },
  {
    id: 419,
    name: 'NIKE COURT BOROUGH BEBÊ ROSA',
    oldPrice: '109,90',
    price: '62,90',
    installments: '5,71',
    image: nikeCourtBoroughBebeRosa,
    discount: '-43%',
    brand: 'Nike',
    ageGroup: 'Bebês',
    category: 'Casual',
    sizes: ['16', '17.5', '18.5', '20', '21', '22', '22.5', '23'],
    badge: '🩷 Bebê Rosa',
    popularity: '#1 Bebê Feminino',
    feature: 'Rosa pastel delicado para as princesas. Velcro fácil, solado antiderrapante',
  },
  {
    id: 420,
    name: 'NIKE COURT BOROUGH BEBÊ VERDE',
    oldPrice: '109,90',
    price: '71,90',
    installments: '6,53',
    image: nikeCourtBoroughBebeVerde,
    discount: '-35%',
    brand: 'Nike',
    ageGroup: 'Bebês',
    category: 'Casual',
    sizes: ['16', '17.5', '18.5', '20', '21', '22', '22.5', '23'],
    badge: '💚 Bebê Verde',
    popularity: 'Presentear Bebê',
    feature: 'Verde menta refrescante, ideal para presentear recém-nascidos e bebês de até 2 anos',
  },
];

const FILTERS = ['Todos', 'Bebês', 'Crianças', 'Pré-Adolescentes'];
const BRAND_FILTERS = ['Todas Marcas', 'Nike', 'Adidas', 'Vans'];

const brandColors: Record<string, string> = {
  Nike: 'bg-black text-white',
  Adidas: 'bg-[#1a1a1a] text-white',
  Vans: 'bg-[#e01010] text-white',
};

const KidsSection: React.FC = () => {
  const { addItem, openCart } = useCart();
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [cartProduct, setCartProduct] = useState<KidsProduct | null>(null);
  const [pendingSize, setPendingSize] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [activeBrand, setActiveBrand] = useState('Todas Marcas');

  const handleAddToCart = () => {
    if (!cartProduct || !pendingSize) return;
    addItem(cartProduct, pendingSize, 1);
    setCartProduct(null);
    setPendingSize('');
    openCart();
  };

  const filtered = popularKidsProducts.filter(p => {
    const ageOk = activeFilter === 'Todos' || p.ageGroup === activeFilter;
    const brandOk = activeBrand === 'Todas Marcas' || p.brand === activeBrand;
    return ageOk && brandOk;
  });

  return (
    <>
      <section id="section-kids" className="bg-white py-16 border-t-4 border-[#f39b19]">
        {/* Header */}
        <div className="container mx-auto px-4 mb-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f39b19] border border-[#f39b19] px-4 py-1 mb-4">
              Pesquisados em lojas oficiais
            </span>
            <h2 className="font-black uppercase leading-none mb-2 text-black" style={{ fontSize: 'clamp(1.8rem, 7vw, 4.5rem)', letterSpacing: '-0.03em' }}>
              TÊNIS INFANTIL FAMOSOS
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2 max-w-xl">
              Os modelos <strong className="text-black">mais populares e reconhecidos</strong> pelas crianças brasileiras — Nike, Adidas e Vans com fotos reais de lojas oficiais
            </p>

            {/* Marca badges */}
            <div className="flex gap-3 mt-2 mb-6 flex-wrap justify-center">
              {['Nike', 'Adidas', 'Vans', 'Converse'].map(b => (
                <span key={b} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-600">
                  {b}
                </span>
              ))}
            </div>

            {/* Brand Filter */}
            <div className="flex gap-2 flex-wrap justify-center mb-3">
              {BRAND_FILTERS.map(b => (
                <button
                  key={b}
                  onClick={() => setActiveBrand(b)}
                  className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border transition-all ${
                    activeBrand === b
                      ? 'bg-[#f39b19] text-white border-[#f39b19]'
                      : 'border-gray-300 text-gray-600 hover:border-gray-500'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Age Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border transition-all ${
                    activeFilter === f
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count */}
        <div className="container mx-auto px-4 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {filtered.length} modelo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group relative border border-transparent hover:border-gray-200 transition-all p-2 flex flex-col"
              >
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 block">
                    {product.discount}
                  </span>
                  <span className="bg-[#f39b19] text-white text-[9px] font-bold px-2 py-0.5 block leading-tight">
                    {product.badge}
                  </span>
                </div>

                {/* Brand tag */}
                <div className="absolute top-2 right-2 z-10">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 block uppercase tracking-wide ${brandColors[product.brand] || 'bg-gray-200 text-gray-700'}`}>
                    {product.brand}
                  </span>
                </div>

                {/* Image with overlay */}
                <div
                  className="aspect-square overflow-hidden mb-3 bg-gray-50 relative cursor-pointer"
                  onClick={() => setCheckoutProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <span className="bg-[#f39b19] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                      🛒 VER PRODUTO
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center flex flex-col flex-1">
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">{product.category} · {product.ageGroup}</p>
                  <h3 className="text-xs font-black uppercase leading-tight mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-[9px] text-gray-500 mb-1 leading-tight line-clamp-2 italic">{product.feature}</p>

                  {/* Popularity */}
                  <p className="text-[9px] font-black text-[#f39b19] mb-2 uppercase tracking-wide">{product.popularity}</p>

                  {/* Sizes */}
                  <p className="text-[9px] text-gray-400 mb-2">
                    Tam: {product.sizes.slice(0, 4).join(' · ')}{product.sizes.length > 4 ? ' +' : ''}
                  </p>

                  <div className="mt-auto">
                    <p className="text-gray-400 text-[10px] line-through">de R$ {product.oldPrice}</p>
                    <p className="text-lg font-black text-black">R$ {product.price}</p>
                    <p className="text-[10px] text-gray-600 mb-3">
                      <strong>12x</strong> de <strong>R$ {product.installments}</strong>
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCheckoutProduct(product)}
                        className="flex-1 bg-black text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#f39b19] transition-colors"
                      >
                        COMPRAR
                      </button>
                      <button
                        onClick={() => { setCartProduct(product); setPendingSize(''); }}
                        className="w-9 bg-gray-100 text-black hover:bg-[#f39b19] hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
                        title="Adicionar ao carrinho"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm uppercase tracking-widest">Nenhum modelo para este filtro</p>
            </div>
          )}
        </div>
      </section>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />

      {/* Add to Cart Size Modal */}
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
              {cartProduct.sizes.map(size => (
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
    </>
  );
};

export default KidsSection;
