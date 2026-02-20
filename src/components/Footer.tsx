import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img 
            src="https://lntdcbtatytixgcnuymw.supabase.co/storage/v1/object/public/cloned-site-images/1771392116568-0.png" 
            alt="White Elephant" 
            className="h-12 mb-6 invert"
          />
          <p className="text-sm text-gray-400">Sua fonte de tênis premium, onde estilo e qualidade se encontram. Enviamos para todo Brasil.</p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase text-sm">Atendimento</h4>
          <ul className="text-sm space-y-3 text-gray-400">
            <li><a href="#" className="hover:text-white">Fale conosco</a></li>
            <li><a href="#" className="hover:text-white">Envie uma Mensagem</a></li>
            <li><a href="#" className="hover:text-white">whiteelephantsp@gmail.com</a></li>
            <li><a href="#" className="hover:text-white">Rastrear Pedido</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-sm">Institucional</h4>
          <ul className="text-sm space-y-3 text-gray-400">
            <li><a href="#" className="hover:text-white">Quem Somos</a></li>
            <li><a href="#" className="hover:text-white">Políticas de Troca</a></li>
            <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-white">Privacidade</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-sm">Newsletter</h4>
          <p className="text-xs text-gray-400 mb-4">Receba ofertas exclusivas em seu e-mail</p>
          <div className="flex flex-col gap-2">
            <input type="email" placeholder="Seu e-mail" className="bg-zinc-900 border-none p-2 text-sm rounded" />
            <button className="bg-[#f39b19] text-white font-bold py-2 rounded text-sm">CADASTRAR</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-center text-[10px] text-gray-500">
        <p>© 2024 White Elephant Multimarcas. Todos os direitos reservados. CNPJ: 00.000.000/0000-00</p>
        <p className="mt-2">Desenvolvido por wBuy</p>
      </div>
    </footer>
  );
};

export default Footer;
