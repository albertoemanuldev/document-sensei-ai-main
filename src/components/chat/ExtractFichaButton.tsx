import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface ExtractFichaButtonProps {
  onExtract: (prompt: string) => void;
  prompt: string;
}

const ExtractFichaButton = ({ onExtract, prompt }: ExtractFichaButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = async () => {
    setIsLoading(true);
    try {
      await onExtract(prompt);
      toast.success('Dados extraídos com sucesso!');
    } catch (error) {
      toast.error('Erro ao extrair dados da ficha funcional');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm mb-6 relative">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Extrair dados da ficha funcional
      </h4>
      <Button
        onClick={handleExtract}
        variant="outline"
        className="w-full text-left p-4 bg-white border border-[#D2B07F] text-[#0A2540] rounded-xl hover:bg-[#FAF8F5] h-auto justify-start flex items-center font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 text-[#D2B07F] animate-spin" />
            Extraindo dados...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 mr-2 text-[#D2B07F]" />
            Extrair dados da ficha funcional
          </>
        )}
      </Button>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-xl">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#D2B07F]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#D2B07F] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#D2B07F]" />
              </div>
            </div>
            <p className="text-lg font-medium text-gray-900">Processando ficha funcional...</p>
            <p className="text-sm text-gray-500 mt-2">Extraindo informações do documento</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractFichaButton; 