import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  RotateCw
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Configure PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string | null;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, className = "" }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    setPageNumber(1);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Erro ao carregar PDF:', error);
    setError('Erro ao carregar o documento PDF');
    setLoading(false);
  }, []);

  const onPageLoadError = useCallback((error: Error) => {
    console.error('Erro ao carregar página:', error);
  }, []);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.2);
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!file) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-96 bg-muted/50 rounded-lg border-2 border-dashed border-muted", className)}>
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg font-medium">Nenhum documento selecionado</p>
        <p className="text-muted-foreground/70 text-sm mt-2">Faça upload de um arquivo PDF para visualizar</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-96 bg-destructive/10 rounded-lg border border-destructive/20", className)}>
        <FileText className="w-16 h-16 text-destructive mb-4" />
        <p className="text-destructive text-lg font-medium">Erro ao carregar documento</p>
        <p className="text-destructive/80 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-background rounded-lg shadow-sm border", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="px-3 py-1 bg-background border rounded-md text-sm font-medium">
            {pageNumber} de {numPages || 0}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 0)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={resetZoom}
          >
            {Math.round(scale * 100)}%
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={rotate}
            title="Girar página"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex justify-center p-4 bg-muted/30 overflow-auto" style={{ maxHeight: '70vh' }}>
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Carregando documento...</span>
          </div>
        )}
        
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="shadow-lg"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            onLoadError={onPageLoadError}
            className="border border-border"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
