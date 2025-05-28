import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeMessage from './WelcomeMessage';

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  currentConversation?: any;
}

const MessageList = ({ messages, isLoading, currentConversation }: MessageListProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para obter o nome do usuário
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuário';
  };

  if (messages.length === 0) {
    return (
      <div className="space-y-6">
        {/* Mensagem de boas-vindas quando há uma conversa ativa */}
        {currentConversation && (
          <WelcomeMessage 
            userName={getUserName()}
            documentName={currentConversation.pdf_name || currentConversation.title}
          />
        )}
        
        <div className="text-center py-12 md:py-16">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-r from-green-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl md:text-4xl">📄</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Documento processado com sucesso!
          </h3>
          <p className="text-gray-600 text-lg">
            Faça uma pergunta ou use os botões de ação rápida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de boas-vindas no início da conversa */}
      {currentConversation && messages.length > 0 && (
        <WelcomeMessage 
          userName={getUserName()}
          documentName={currentConversation.pdf_name || currentConversation.title}
        />
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div
            className={`max-w-4xl px-6 py-4 rounded-3xl transition-all duration-200 font-sans text-base shadow-none border
              ${message.sender === 'user'
                ? 'bg-[#0A2540] text-white ml-4 md:ml-12 border-[#0A2540]'
                : 'bg-white text-[#0A2540] border-gray-200 mr-4 md:mr-12'}
            `}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-base">{message.text}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500 mb-2">Fontes:</p>
                {message.sources.map((source: any, index: number) => (
                  <p key={index} className="text-xs text-gray-400">
                    {source.name}
                  </p>
                ))}
              </div>
            )}
            <p className={`text-xs mt-3 ${
              message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
            }`}>
              {message.timestamp}
            </p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-lg border border-gray-200/50 backdrop-blur-sm mr-4 md:mr-12">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-700 font-medium">Analisando documento...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
