import React from 'react';
import { MessageCircle, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageList from './MessageList';
import SuggestedQuestions from './SuggestedQuestions';
import ExportActions from './ExportActions';
import ExtractFichaButton from './ExtractFichaButton';

interface ChatAreaProps {
  currentConversation: any;
  messages: any[];
  inputMessage: string;
  isLoading: boolean;
  suggestedQuestions: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (message?: string, isHidden?: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestedQuestion: (question: string) => void;
  onQuickAction: (action: string) => void;
}

const ChatArea = ({
  currentConversation,
  messages,
  inputMessage,
  isLoading,
  suggestedQuestions,
  fileInputRef,
  isUploading,
  onInputChange,
  onSendMessage,
  onFileUpload,
  onSuggestedQuestion,
  onQuickAction,
}: ChatAreaProps) => {
  const handleUploadClick = () => {
    console.log('ChatArea: Upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('ChatArea: fileInputRef is null');
    }
  };

  const promptFichaFuncional = `
Extraia exatamente os seguintes dados, caso existam, da ficha funcional do profissional da saúde apresentada neste documento PDF:

- Nome completo
- Data de nascimento
- Portaria de nomeação
- Data de ingresso/data de posse
- Especialidade
- Períodos de férias
- Licenças/licenças prêmio/afastamentos
- Progressões
- Número de matrícula
- Averbações
- PDV (Plano de Demissão Voluntária)
- Regime de ingresso (estatutário ou celetista)
- Dados de cessão (se foi cedido para outro órgão, quais órgãos, datas e documentos relacionados)
- Órgão de origem
- Dados de exoneração (motivo, datas e documentos)
- Quaisquer outros dados funcionais presentes na ficha

Exemplo de saída esperada:
Nome completo: Luiz Fernando Silva de Barros
Data de nascimento: 19.02.54
Portaria de nomeação: Não especificada no documento.
Data de ingresso/data de posse: 12.02.1985
Especialidade: Não especificada no documento.
Períodos de férias: Não especificados no documento.
Licenças/licenças prêmio/afastamentos: Não especificados no documento.
Progressões: Não especificadas no documento.
Número de matrícula: 43.232
Averbações: Não especificadas no documento.
PDV (Plano de Demissão Voluntária): Não mencionado no documento.
Regime de ingresso (estatutário ou celetista): Estatutário (conforme a transferência para o regime jurídico do Estatuto dos Funcionários Públicos Civis do Estado de Alagoas).
Dados de cessão: Não mencionados no documento.
Órgão de origem: Secretaria de Saúde e Serviço Social do Estado de Alagoas.
Dados de exoneração: Não mencionados no documento.
Quaisquer outros dados funcionais presentes na ficha: O documento menciona que Luiz Fernando Silva de Barros é médico, código NS-421-B, e que ele é casado. Também contém informações sobre sua filiação e dados de identificação, como CPF e número da carteira de identidade.
`;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Chat Header */}
      <div className="p-6 border-b bg-white shadow-md flex items-center space-x-4 sticky top-0 z-10">
        <div className="w-10 h-10 bg-[#F8FAFC] rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-[#0A2540]" />
        </div>
        <h2 className="text-xl font-bold text-[#0A2540] tracking-tight">Selecione um PDF para começar</h2>
      </div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept=".pdf"
        className="hidden"
        disabled={isUploading}
      />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {!currentConversation ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-28 h-28 bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-none">
              <Upload className="w-14 h-14 text-[#0A2540]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A2540] mb-2">Bem-vindo ao Analisador de Documentos</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed px-4 text-lg">
              Carregue um documento PDF para começar a conversar sobre seu conteúdo com nossa IA inteligente
            </p>
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              size="lg"
              className="px-8 py-4 bg-[#0A2540] text-white font-semibold rounded-full shadow-none text-base flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              <span>Carregar PDF</span>
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-6 p-6">
            <ExtractFichaButton onExtract={(prompt) => onSendMessage(prompt, true)} prompt={promptFichaFuncional} />
            <MessageList 
              messages={messages} 
              isLoading={isLoading}
              currentConversation={currentConversation}
            />
          </div>
        )}
      </div>
      {/* Input Area */}
      {currentConversation && (
        <div className="p-4 md:p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3 md:space-x-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
                  placeholder="Faça uma pergunta sobre o documento..."
                  className="w-full pr-12 py-4 md:py-5 text-base rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={() => onSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                size="lg"
                className="px-6 py-4 md:py-5 bg-[#0A2540] text-white rounded-2xl shadow-none font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
