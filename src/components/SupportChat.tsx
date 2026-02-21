import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

const getTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const autoReplies = [
  'Olá! Obrigado por entrar em contato. Em breve um atendente irá te responder! 😊',
  'Recebemos sua mensagem! Nossa equipe de suporte irá te atender em instantes.',
  'Agradecemos seu contato! Estamos verificando sua solicitação.',
];

const SupportChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! 👋 Bem-vindo ao suporte da White Elephant. Como podemos te ajudar hoje?',
      sender: 'support',
      time: getTime(),
    },
  ]);
  const [replyIndex, setReplyIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user', time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: autoReplies[replyIndex % autoReplies.length],
        sender: 'support',
        time: getTime(),
      };
      setMessages(prev => [...prev, reply]);
      setReplyIndex(i => i + 1);
    }, 1000);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 left-4 md:left-auto md:right-6 md:bottom-24 z-50 md:w-80 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Header */}
          <div className="bg-black px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f39b19] flex items-center justify-center flex-shrink-0">
              <span className="text-black font-black text-sm">WE</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-sm leading-none">White Elephant</p>
              <p className="text-[#f39b19] text-[10px] mt-0.5">● Online agora</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f5]" style={{ maxHeight: '320px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-black text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Digite sua mensagem..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-8 h-8 bg-[#f39b19] rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-black transition-colors flex-shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 bg-[#25d366] text-white p-4 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        aria-label="Suporte"
      >
        {open ? (
          <X size={28} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        )}
      </button>
    </>
  );
};

export default SupportChat;
