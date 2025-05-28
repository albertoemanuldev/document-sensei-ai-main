
import React from 'react';
import { FileText, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationListProps {
  conversations: any[];
  currentConversation: any;
  onSelectConversation: (conversation: any) => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationList = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
        <p className="text-xs text-gray-400">Carregue um PDF para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`group relative rounded-lg border transition-all duration-200 ${
            currentConversation?.id === conversation.id
              ? 'bg-purple-50 border-purple-200 shadow-sm'
              : 'bg-white/50 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <button
            onClick={() => onSelectConversation(conversation)}
            className="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                currentConversation?.id === conversation.id
                  ? 'bg-purple-100'
                  : 'bg-gray-100'
              }`}>
                <FileText className={`w-4 h-4 ${
                  currentConversation?.id === conversation.id
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate ${
                  currentConversation?.id === conversation.id
                    ? 'text-purple-900'
                    : 'text-gray-900'
                }`}>
                  {conversation.title || conversation.pdf_name}
                </h3>
                
                <p className={`text-xs mt-1 ${
                  currentConversation?.id === conversation.id
                    ? 'text-purple-600'
                    : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(new Date(conversation.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
            </div>
          </button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
