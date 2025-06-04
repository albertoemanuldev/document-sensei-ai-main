import React, { useState } from 'react';
import { BookOpen, FileText, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewer from '../PDFViewer';
import { toast } from 'sonner';

interface PDFViewerPanelProps {
  currentConversation: any;
  pdfUrl: string | null;
  onQuickAction: (action: string) => void;
}

const PDFViewerPanel = ({ currentConversation, pdfUrl, onQuickAction }: PDFViewerPanelProps) => {
  const [isExtracting, setIsExtracting] = useState(false);

  if (!currentConversation || !pdfUrl) {
    return null;
  }

  const handleExtractText = () => {
    setIsExtracting(false);
    toast.success('Dados extraídos com sucesso!');
  };

  const handleExtractData = () => {
    setIsExtracting(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* PDF Viewer Header */}
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#F8FAFC] rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#0A2540]" />
          </div>
          <h2 className="text-lg font-semibold text-[#0A2540]">
            {currentConversation?.pdf_name || 'Visualizador de PDF'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('explain')}
            className="text-xs"
          >
            Explicar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('summarize')}
            className="text-xs"
          >
            Resumir
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden h-full">
        <div className="h-full w-full">
          <PDFViewer file={pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPanel;
