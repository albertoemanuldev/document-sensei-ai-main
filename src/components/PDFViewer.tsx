import React, { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  RotateCw,
  FileText as FileTextIcon,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Configure PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string | null;
  className?: string;
  onExtractText?: (text: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, className = "", onExtractText }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const documentRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    pageRefs.current = new Array(numPages).fill(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Erro ao carregar PDF:', error);
    setError('Erro ao carregar o documento PDF');
    setLoading(false);
  }, []);

  const onPageLoadError = useCallback((error: Error) => {
    console.error('Erro ao carregar página:', error);
  }, []);

  const startProgressAnimation = () => {
    setProcessingProgress(0);
    progressInterval.current = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval.current);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
  };

  const stopProgressAnimation = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setProcessingProgress(100);
    setTimeout(() => {
      setProcessingProgress(0);
    }, 1000);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      pageRefs.current[newPage - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < (numPages || 1)) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      pageRefs.current[newPage - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleExtractText = async () => {
    if (!documentRef.current || !onExtractText) return;

    setIsExtracting(true);
    startProgressAnimation();
    
    try {
      const textContent = await documentRef.current.getTextContent();
      const extractedText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      toast.promise(
        Promise.resolve(extractedText),
        {
          loading: 'Extraindo texto do documento...',
          success: 'Texto extraído com sucesso!',
          error: 'Erro ao extrair texto do documento',
        }
      );
      
      onExtractText(extractedText);
    } catch (error) {
      console.error('Erro ao extrair texto:', error);
      toast.error('Erro ao extrair texto do documento');
    } finally {
      stopProgressAnimation();
      setIsExtracting(false);
    }
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
    <div className={cn("bg-background rounded-lg shadow-sm border relative h-full flex flex-col", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="px-3 py-1 bg-background border rounded-md text-sm font-medium">
            {currentPage} de {numPages || 0}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage >= (numPages || 0)}
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

          {onExtractText && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleExtractText}
              disabled={isExtracting}
              title="Extrair texto"
              className={cn(
                "relative",
                isExtracting && "cursor-not-allowed"
              )}
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileTextIcon className="w-4 h-4" />
              )}
              {isExtracting && (
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Extraindo texto...
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto p-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          }
          ref={documentRef}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              ref={el => pageRefs.current[index] = el}
              className="mb-4 last:mb-0"
            >
              <Page
                pageNumber={index + 1}
                scale={scale}
                rotate={rotation}
                onLoadError={onPageLoadError}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
