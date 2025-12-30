'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface OutputDisplayProps {
  content: string;
}

const renderContent = (content: string) => {
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);

  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return (
        <div key={index} className="my-4 overflow-x-auto p-2 bg-muted rounded-md font-code text-sm">
          {part.slice(2, -2).trim()}
        </div>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return (
        <code key={index} className="font-code bg-muted rounded px-1.5 py-1 mx-0.5 text-sm">
          {part.slice(1, -1).trim()}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export function OutputDisplay({ content }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({ variant: "destructive", title: "Failed to copy text." });
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
            {renderContent(content)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
