import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ExtractFichaButtonProps {
  onExtract: (prompt: string) => void;
  prompt: string;
}

export default function ExtractFichaButton({ onExtract, prompt }: ExtractFichaButtonProps) {
  return (
    <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Extrair dados da ficha funcional
      </h4>
      <Button
        onClick={() => onExtract(prompt)}
        variant="outline"
        className="w-full text-left p-4 bg-white border border-[#D2B07F] text-[#0A2540] rounded-xl hover:bg-[#FAF8F5] h-auto justify-start flex items-center font-semibold"
      >
        <FileText className="w-5 h-5 mr-2 text-[#D2B07F]" />
        Extrair dados da ficha funcional
      </Button>
    </div>
  );
} 