import React, { useState, useEffect } from 'react';
import PDFViewer from '@/components/PDFViewer';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const DocumentViewer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Arquivo selecionado:", file); // Adicionado para depuração
    if (file && file.type === 'application/pdf') {
      console.log("Arquivo PDF válido:", file.name); // Adicionado para depuração
      setUploadedFile(file);
    } else {
      console.log("Nenhum arquivo selecionado ou não é PDF."); // Adicionado para depuração
      setUploadedFile(null);
      setFileUrl(null); // Limpar URL se o arquivo não for válido ou for removido
    }
    // Resetar o valor do input para que o onChange dispare novamente com o mesmo arquivo, se necessário
    event.target.value = '';
  };

  useEffect(() => {
    if (uploadedFile) {
      console.log("Criando URL para:", uploadedFile.name); // Adicionado para depuração
      const url = URL.createObjectURL(uploadedFile);
      setFileUrl(url);
      return () => {
        console.log("Revogando URL:", url); // Adicionado para depuração
        URL.revokeObjectURL(url);
      };
    } else {
      console.log("Nenhum arquivo uploadedFile para criar URL."); // Adicionado para depuração
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

          {uploadedFile && ( // Mudar para fileUrl se quiser mostrar o nome APENAS quando a URL for criada
            <span className="text-sm text-muted-foreground">
              Arquivo selecionado: {uploadedFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <PDFViewer file={fileUrl} />
      </div>
    </div>
  );
};

export default DocumentViewer;