import React, { useState, useRef, useEffect } from 'react';
import { generateAgriAdvice } from '../services/geminiService';
import { ChatMessage, UserType } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  userType: UserType;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Bonjour! Je suis l'Assistant Agri-Expert. Comment puis-je vous aider aujourd'hui concernant vos activités de ${userType === 'farmer' ? 'production' : 'consommation/investissement'} ?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await generateAgriAdvice(inputValue, userType);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Quel est le prix de l'oignon aujourd'hui ?",
    "Comment traiter le mildiou de la tomate ?",
    "Meilleure période pour planter l'arachide ?",
    "Rentabilité d'un hectare de mangues"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-agri-dark text-white p-4 flex items-center shadow-sm">
        <div className="p-2 bg-white/10 rounded-full mr-3">
          <Bot size={24} className="text-senegal-yellow" />
        </div>
        <div>
          <h3 className="font-bold">Agri-Expert IA</h3>
          <p className="text-xs text-gray-300 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            En ligne - Propulsé par Gemini
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-agri-primary text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-75">
                {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                <span className="text-xs">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm flex items-center">
              <Loader2 size={16} className="animate-spin text-agri-primary mr-2" />
              <span className="text-sm text-gray-500">Analyse en cours...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInputValue(s)}
                className="whitespace-nowrap px-3 py-1 bg-agri-light text-agri-dark text-xs rounded-full border border-agri-primary/20 hover:bg-agri-primary hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question sur l'agriculture..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-primary focus:border-transparent bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
              inputValue.trim() && !isLoading
                ? 'bg-agri-primary text-white shadow-md hover:bg-agri-dark transform hover:-translate-y-1'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;