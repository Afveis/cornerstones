import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import Papa from 'papaparse';

interface CSVUploaderProps {
  onDataLoad: (data: { category: string; quote: string }[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      complete: (results) => {
        const validRows = results.data.filter((row: any) => 
          Array.isArray(row) && row.length >= 2 && row[0] && row[1]
        );
        
        const processedData: { category: string; quote: string }[] = [];
        
        validRows.forEach((row: any) => {
          const category = row[0].toString().trim();
          const quotesText = row[1].toString();
          
          // Split quotes by dots and filter out empty ones
          const quotes = quotesText
            .split('.')
            .map(quote => quote.trim())
            .filter(quote => quote.length > 0)
            .map(quote => quote.replace(/^\s*[\t\n\r]+\s*/, '').trim()); // Clean up whitespace and tabs
          
          quotes.forEach(quote => {
            if (quote) {
              processedData.push({ category, quote });
            }
          });
        });
        
        onDataLoad(processedData);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });

    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <Button 
        onClick={triggerFileUpload}
        variant="outline"
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload CSV File
      </Button>

      <div className="text-sm text-muted-foreground space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Expected format:</span>
        </div>
        <div className="bg-muted/50 p-3 rounded text-xs font-mono">
          <div>Theme,Quote</div>
          <div>Community Cohesion,"Great community spirit here"</div>
          <div>Heritage & Culture,"Rich cultural traditions"</div>
          <div>Community Cohesion,"Strong neighborhood bonds"</div>
        </div>
      </div>
    </div>
  );
};