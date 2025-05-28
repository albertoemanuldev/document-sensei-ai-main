import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus, FileText, MessageCircle, LogOut, Menu } from 'lucide-react';
import ConversationList from '../conversation/ConversationList';
import FileUploadArea from '../upload/FileUploadArea';

interface AppSidebarProps {
  conversations: any[];
  currentConversation: any;
  isUploading: boolean;
  onNewConversation: () => void;
  onSelectConversation: (conversation: any) => void;
  onDeleteConversation: (id: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function AppSidebar({
  conversations,
  currentConversation,
  isUploading,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onFileUpload,
  fileInputRef,
}: AppSidebarProps) {
  const { user, signOut } = useAuth();

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

  // Remover lógica de storage/persistência
  // Apenas chama o onSelectConversation normalmente
  const selectConversation = (conversation) => {
    onSelectConversation(conversation);
  };

  // Apenas repassa o evento para o handler principal
  const handleFileUpload = (event) => {
    onFileUpload(event);
  };

  return (
    <Sidebar className="border-r bg-[#FAF8F5] min-h-screen flex flex-col justify-between">
      <SidebarHeader className="p-6 border-b-0 flex flex-col items-start">
        <img src="/sotero-logo.png" alt="Logo Sotero" className="w-40 h-auto mb-2 ml-1" />
        <span className="text-xs font-bold text-[#0A2540] tracking-wide mb-6 ml-1">Analisador de Documentos</span>
        <Button
          onClick={onNewConversation}
          className="w-full flex items-center space-x-2 px-4 py-3 bg-[#0A2540] text-white rounded-full shadow-none font-semibold text-base mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Conversa</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto w-full px-2">
        {!currentConversation && (
          <div className="p-2">
            <FileUploadArea
              fileInputRef={fileInputRef}
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          </div>
        )}
        <div className="px-0 pb-4">
          <ConversationList
            conversations={conversations}
            currentConversation={currentConversation}
            onSelectConversation={selectConversation}
            onDeleteConversation={onDeleteConversation}
          />
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t-0 bg-transparent">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-full shadow-none border border-gray-200/50">
              <div className="w-10 h-10 bg-[#0A2540] rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {getUserName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0A2540] truncate">
                  Olá, {getUserName()}!
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              className="w-full flex items-center space-x-2 py-2.5 border-gray-200 bg-white text-[#0A2540] rounded-full font-semibold shadow-none hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
