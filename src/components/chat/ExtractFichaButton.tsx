import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const promptFichaFuncional = `
Extraia exatamente os seguintes dados, caso existam, da ficha funcional do profissional da saúde apresentada neste documento PDF:

- Nome completo
- Data de nascimento
- Portaria de nomeação
- Data de ingresso/data de posse
- Especialidade
- Períodos de férias
- Licenças/licenças prêmio/afastamentos
- Progressões
- Número de matrícula
- Averbações
- PDV (Plano de Demissão Voluntária)
- Regime de ingresso (estatutário ou celetista)
- Dados de cessão (se foi cedido para outro órgão, quais órgãos, datas e documentos relacionados)
- Órgão de origem
- Dados de exoneração (motivo, datas e documentos)
- Quaisquer outros dados funcionais presentes na ficha

Exemplo de saída esperada:
Nome completo: Luiz Fernando Silva de Barros
Data de nascimento: 19.02.54
Portaria de nomeação: Não especificada no documento.
Data de ingresso/data de posse: 12.02.1985
Especialidade: Não especificada no documento.
Períodos de férias: Não especificados no documento.
Licenças/licenças prêmio/afastamentos: Não especificados no documento.
Progressões: Não especificadas no documento.
Número de matrícula: 43.232
Averbações: Não especificadas no documento.
PDV (Plano de Demissão Voluntária): Não mencionado no documento.
Regime de ingresso (estatutário ou celetista): Estatutário (conforme a transferência para o regime jurídico do Estatuto dos Funcionários Públicos Civis do Estado de Alagoas).
Dados de cessão: Não mencionados no documento.
Órgão de origem: Secretaria de Saúde e Serviço Social do Estado de Alagoas.
Dados de exoneração: Não mencionados no documento.
Quaisquer outros dados funcionais presentes na ficha: O documento menciona que Luiz Fernando Silva de Barros é médico, código NS-421-B, e que ele é casado. Também contém informações sobre sua filiação e dados de identificação, como CPF e número da carteira de identidade.
`;

export default function ExtractFichaButton({ onExtract }: { onExtract: () => void }) {
  return (
    <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Extrair dados da ficha funcional
      </h4>
      <Button
        onClick={onExtract}
        variant="outline"
        className="w-full text-left p-4 bg-white border border-[#D2B07F] text-[#0A2540] rounded-xl hover:bg-[#FAF8F5] h-auto justify-start flex items-center font-semibold"
      >
        <FileText className="w-5 h-5 mr-2 text-[#D2B07F]" />
        Extrair dados da ficha funcional
      </Button>
    </div>
  );
} 