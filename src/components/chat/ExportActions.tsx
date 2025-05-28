
import React from 'react';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportActionsProps {
  conversation: any;
  messages: any[];
}

const ExportActions = ({ conversation, messages }: ExportActionsProps) => {
  const exportToTxt = () => {
    const content = messages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}\n`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}_conversa.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCsv = () => {
    const headers = 'Remetente,Mensagem,Timestamp\n';
    const content = messages
      .map(msg => `"${msg.sender}","${msg.text.replace(/"/g, '""')}","${msg.timestamp}"`)
      .join('\n');
    
    const blob = new Blob([headers + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}_conversa.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToDocx = () => {
    // Simplified DOCX export using HTML structure
    const content = messages
      .map(msg => `<p><strong>${msg.sender.toUpperCase()}:</strong> ${msg.text}</p>`)
      .join('');
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Conversa - ${conversation.title}</title>
        </head>
        <body>
          <h1>Conversa sobre: ${conversation.title}</h1>
          ${content}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}_conversa.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToXlsx = () => {
    // Create simple HTML table for Excel compatibility
    const tableContent = messages
      .map(msg => `<tr><td>${msg.sender}</td><td>${msg.text}</td><td>${msg.timestamp}</td></tr>`)
      .join('');
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <table border="1">
            <tr><th>Remetente</th><th>Mensagem</th><th>Timestamp</th></tr>
            ${tableContent}
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}_conversa.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToTxt}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar como TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCsv}>
          <Table className="w-4 h-4 mr-2" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToXlsx}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar como XLSX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToDocx}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar como DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
