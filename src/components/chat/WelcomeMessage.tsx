import React from 'react';
import { FileText, User } from 'lucide-react';

interface WelcomeMessageProps {
  userName: string;
  documentName: string;
}

const WelcomeMessage = ({ userName, documentName }: WelcomeMessageProps) => {
  const generateWelcomeContent = (docName: string) => {
    const lowerDocName = docName.toLowerCase();
    
    // Detecta diferentes tipos de documentos e gera conteúdo apropriado
    if (lowerDocName.includes('conexão') || lowerDocName.includes('evento') || lowerDocName.includes('cultural')) {
      return {
        title: "Sistema para a Conexão Local",
        description: "Uma plataforma que ajuda a divulgar eventos culturais, educativos e sociais na cidade. Tudo para que moradores e organizadores possam se conectar melhor, curtindo, comentando e se inscrevendo nos eventos.",
        topics: [
          "Criar o banco de dados com tudo que envolve usuários, organizadores, eventos e as interações",
          "Fazer a página principal mostrando eventos, perfil dos organizadores e login",
          "Criar funcionalidades para o usuário logado acompanhar suas inscrições e interações"
        ],
        question: "Vamos trocar uma ideia sobre essa plataforma?"
      };
    } else if (lowerDocName.includes('projeto') || lowerDocName.includes('sistema')) {
      return {
        title: "Análise do Projeto",
        description: "Este documento contém informações importantes sobre o projeto que vamos desenvolver juntos.",
        topics: [
          "Analisar os requisitos do sistema",
          "Definir a arquitetura da aplicação",
          "Implementar as funcionalidades principais"
        ],
        question: "Que tal começarmos a discutir os detalhes do projeto?"
      };
    } else if (lowerDocName.includes('manual') || lowerDocName.includes('guia')) {
      return {
        title: "Manual/Guia de Referência",
        description: "Este documento serve como guia para entender os processos e procedimentos descritos.",
        topics: [
          "Revisar os procedimentos principais",
          "Esclarecer dúvidas sobre os processos",
          "Implementar as melhores práticas"
        ],
        question: "Posso ajudar você a entender melhor este manual?"
      };
    } else {
      return {
        title: "Análise do Documento",
        description: "Vamos analisar este documento juntos para extrair as informações mais importantes e discutir seu conteúdo.",
        topics: [
          "Revisar o conteúdo principal",
          "Identificar pontos importantes",
          "Esclarecer dúvidas sobre o documento"
        ],
        question: "Sobre o que você gostaria de conversar primeiro?"
      };
    }
  };

  const content = generateWelcomeContent(documentName);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-[#0A2540] rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Olá, {userName}! 👋
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Documento: {documentName}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">{content.title}</h4>
              <p className="text-gray-700 leading-relaxed">
                {content.description}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-gray-800 mb-2">Principais pontos a discutir:</h5>
              <ul className="space-y-1">
                {content.topics.map((topic, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <p className="text-gray-800 font-medium">
                {content.question}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
