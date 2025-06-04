import React, { useState, useEffect } from 'react';
import PDFViewer from '@/components/PDFViewer';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const DocumentViewer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Arquivo selecionado:", file);
    if (file && file.type === 'application/pdf') {
      console.log("Arquivo PDF válido:", file.name);
      setUploadedFile(file);
    } else {
      console.log("Nenhum arquivo selecionado ou não é PDF.");
      setUploadedFile(null);
      setFileUrl(null);
    }
    event.target.value = '';
  };

  const handleExtractText = (text: string) => {
    setExtractedText(text);
    toast.success('Texto extraído com sucesso!');
  };

  useEffect(() => {
    if (uploadedFile) {
      console.log("Criando URL para:", uploadedFile.name);
      const url = URL.createObjectURL(uploadedFile);
      setFileUrl(url);
      return () => {
        console.log("Revogando URL:", url);
        URL.revokeObjectURL(url);
      };
    } else {
      console.log("Nenhum arquivo uploadedFile para criar URL.");
      setFileUrl(null);
    }
  }, [uploadedFile]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Visualizador de PDF</h1>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar PDF
          </Button>

          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploadedFile && (
            <span className="text-sm text-muted-foreground">
              Arquivo selecionado: {uploadedFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <PDFViewer 
          file={fileUrl}
          onExtractText={handleExtractText}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;