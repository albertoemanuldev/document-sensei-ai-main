import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadAreaProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const FileUploadArea = ({ fileInputRef, onFileUpload, isUploading }: FileUploadAreaProps) => {
  const handleButtonClick = () => {
    console.log('FileUploadArea: Button clicked, triggering file input');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('FileUploadArea: File input ref is null');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FileUploadArea: File input changed', event.target.files);
    onFileUpload(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      const event = {
        target: { files }
      } as any;
      handleFileChange(event);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
        disabled={isUploading}
      />
      
      <div
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-white transition-all duration-300
          ${isUploading 
            ? 'bg-gray-50 cursor-not-allowed' 
            : 'hover:border-[#0A2540] hover:bg-gray-50'
          }
          group
        `}
      >
        <div className="flex flex-col items-center text-center">
          {isUploading ? (
            <>
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A2540]"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-2">Carregando PDF...</p>
              <p className="text-xs text-gray-500">Processando documento</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-[#0A2540]" />
              </div>
              <p className="text-base font-semibold text-[#0A2540] mb-2">Carregar PDF</p>
              <p className="text-sm text-gray-500 mb-3">Clique ou arraste um arquivo aqui</p>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <FileText className="w-4 h-4" />
                <span>Apenas arquivos PDF</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;
