import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewer from '../PDFViewer';

interface PDFViewerPanelProps {
  currentConversation: any;
  pdfUrl: string | null;
  onQuickAction: (action: string) => void;
}

const PDFViewerPanel = ({ currentConversation, pdfUrl, onQuickAction }: PDFViewerPanelProps) => {
  if (!currentConversation || !pdfUrl) {
    return null;
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white/80">
        <h3 className="text-lg font-bold text-gray-900 truncate mb-4">
          {currentConversation.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onQuickAction('explain')}
            variant="outline"
            size="sm"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Explicar
          </Button>
          <Button
            onClick={() => onQuickAction('summarize')}
            variant="outline"
            size="sm"
            className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Resumir
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <PDFViewer 
          file={pdfUrl} 
        />
      </div>
    </div>
  );
};

export default PDFViewerPanel;
