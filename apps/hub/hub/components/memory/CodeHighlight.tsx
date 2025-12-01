'use client';

import { useEffect, useState } from 'react';

interface CodeHighlightProps {
  code: string;
  language?: string;
}

export function CodeHighlight({ code, language = 'javascript' }: CodeHighlightProps) {
  const [highlighted, setHighlighted] = useState(code);

  useEffect(() => {
    // Simple syntax highlighting for common languages
    const highlight = (text: string) => {
      let result = text;
      
      // Keywords
      const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        result = result.replace(regex, `<span class="text-blue-600 font-semibold">${keyword}</span>`);
      });
      
      // Strings
      result = result.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-600">$1$2$1</span>');
      
      // Comments
      result = result.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>');
      result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>');
      
      // Numbers
      result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-purple-600">$1</span>');
      
      return result;
    };

    setHighlighted(highlight(code));
  }, [code, language]);

  return (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
      <code 
        className="block whitespace-pre text-foreground"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}