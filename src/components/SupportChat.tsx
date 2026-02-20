import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

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
        <div className="fixed bottom-24 right-6 z-50 w-80 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '480px' }}>
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
        className="fixed bottom-6 right-6 bg-[#f39b19] text-white p-4 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        aria-label="Suporte"
      >
        {open
          ? <X size={28} />
          : <MessageCircle size={28} />
        }
      </button>
    </>
  );
};

export default SupportChat;
