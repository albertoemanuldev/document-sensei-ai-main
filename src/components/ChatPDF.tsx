import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { chatPdfService } from '../services/chatPdfService';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import AppSidebar from './layout/AppSidebar';
import ChatArea from './chat/ChatArea';
import PDFViewerPanel from './pdf/PDFViewerPanel';

const ChatPDF = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const fileInputRef = useRef(null);

  // Load conversations from database
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const generateSuggestedQuestions = (fileName) => {
    const questions = [
      "Qual é o objetivo principal deste documento?",
      "Faça um resumo dos pontos mais importantes",
      "Quais são as principais informações técnicas?",
      "Explique o conteúdo de forma didática"
    ];
    setSuggestedQuestions(questions);
  };

  const handleFileUpload = async (event) => {
    console.log('ChatPDF: handleFileUpload called', event.target.files);
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      console.log('Starting PDF upload process...');

      try {
        const sourceId = await chatPdfService.uploadPdf(file);
        
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        
        const { data: conversation, error } = await supabase
          .from('conversations')
          .insert({
            title: file.name,
            pdf_name: file.name,
            pdf_source_id: sourceId,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;

        const newConversation = {
          ...conversation,
          messages: [],
          pdfUrl: url,
          file: file,
          sourceId: sourceId
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
        setMessages([]);
        
        generateSuggestedQuestions(file.name);
        
        console.log('PDF uploaded and conversation created successfully');
      } catch (error) {
        console.error('Failed to upload PDF:', error);
        alert('Falha ao carregar o PDF. Tente novamente.');
      } finally {
        setIsUploading(false);
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      }
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
    }
  };

  const handleQuickAction = (action) => {
    let prompt = '';
    switch (action) {
      case 'explain':
        prompt = 'Por favor, explique o conteúdo principal deste documento de forma detalhada e didática.';
        break;
      case 'summarize':
        prompt = 'Faça um resumo executivo dos pontos mais importantes deste documento.';
        break;
      case 'rewrite':
        prompt = 'Reescreva o conteúdo principal deste documento de forma mais concisa e clara.';
        break;
    }
    
    if (prompt) {
      handleSendMessage(prompt);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || !currentConversation) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    
    if (suggestedQuestions.length > 0) {
      setSuggestedQuestions([]);
    }

    try {
      console.log('Sending message to ChatPDF API...');
      const response = await chatPdfService.sendMessage(messageText, currentConversation.sourceId || currentConversation.pdf_source_id);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: response.content,
        sender: 'ai',
        timestamp: new Date().toLocaleString(),
        sources: response.sources
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);

      await supabase.from('messages').insert([
        {
          conversation_id: currentConversation.id,
          content: messageText,
          role: 'user'
        },
        {
          conversation_id: currentConversation.id,
          content: response.content,
          role: 'assistant'
        }
      ]);

      console.log('Message sent and response received successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'ai',
        timestamp: new Date().toLocaleString()
      };

      const updatedMessages = [...newMessages, errorResponse];
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setPdfFile(null);
    setPdfUrl(null);
    setMessages([]);
    setSuggestedQuestions([]);
  };

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    setPdfFile(conversation.file);
    setPdfUrl(conversation.pdfUrl);
    setSuggestedQuestions([]);
    
    try {
      const { data: dbMessages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = dbMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.created_at).toLocaleString()
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
    
    if (conversation.pdf_source_id) {
      chatPdfService.setCurrentSourceId(conversation.pdf_source_id);
    }
  };

  const deleteConversation = async (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (conversation?.pdf_source_id) {
      try {
        await chatPdfService.deletePdf(conversation.pdf_source_id);
        console.log('PDF deleted from ChatPDF API');
      } catch (error) {
        console.error('Failed to delete PDF from API:', error);
      }
    }
    
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        startNewConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          isUploading={isUploading}
          onNewConversation={startNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
        />
        
        <SidebarInset className="flex w-full">
          <div className="flex w-full h-screen">
            {/* Header with sidebar trigger for mobile */}
            <div className="absolute top-4 left-4 z-10 md:hidden">
              <SidebarTrigger className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                <Menu className="w-4 h-4" />
              </SidebarTrigger>
            </div>

            {/* PDF Viewer - Hidden on mobile when no conversation */}
            {currentConversation && pdfUrl && (
              <div className="hidden md:flex w-1/2 border-r border-gray-200 h-screen max-h-screen flex-col">
                <PDFViewerPanel
                  currentConversation={currentConversation}
                  pdfUrl={pdfUrl}
                  onQuickAction={handleQuickAction}
                />
              </div>
            )}

            {/* Chat Area */}
            <div className={`${currentConversation && pdfUrl ? 'w-full md:w-1/2' : 'w-full'} flex flex-col h-screen max-h-screen overflow-y-auto`}>
              <ChatArea
                currentConversation={currentConversation}
                messages={messages}
                inputMessage={inputMessage}
                isLoading={isLoading}
                suggestedQuestions={suggestedQuestions}
                fileInputRef={fileInputRef}
                isUploading={isUploading}
                onInputChange={setInputMessage}
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                onSuggestedQuestion={handleSuggestedQuestion}
                onQuickAction={handleQuickAction}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatPDF;
