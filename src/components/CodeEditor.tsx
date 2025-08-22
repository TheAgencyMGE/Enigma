import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Check,
  Maximize2,
  Download,
  FileText,
  Code,
  FileJson,
  Save,
  X
} from "lucide-react";
import type { ProjectFile } from "@/pages/Index";

interface CodeEditorProps {
  file: ProjectFile | null;
  onClose: () => void;
  onSave?: (fileName: string, content: string) => void;
  isEditable?: boolean;
}

export const CodeEditor = ({ file, onClose, onSave, isEditable = true }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(file?.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setHasChanges(false);
    }
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== file?.content);
  };

  const handleSave = () => {
    if (file && onSave && hasChanges) {
      onSave(file.name, content);
      setHasChanges(false);
    }
  };

  const handleCopy = async () => {
    if (file) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getLanguage = (type: ProjectFile['type']) => {
    switch (type) {
      case 'html': return 'HTML';
      case 'css': return 'CSS';
      case 'js': return 'JavaScript';
      case 'json': return 'JSON';
      default: return 'Text';
    }
  };

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'css':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'js':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const highlightSyntax = (code: string, type: ProjectFile['type']) => {
    // Basic syntax highlighting for demo purposes
    let highlighted = code;
    
    if (type === 'html') {
      highlighted = highlighted
        .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-blue-400">$1</span>')
        .replace(/(class|id|src|href)=/g, '<span class="text-yellow-400">$1</span>=')
        .replace(/(&quot;[^&]*&quot;)/g, '<span class="text-green-400">$1</span>');
    } else if (type === 'css') {
      highlighted = highlighted
        .replace(/([a-zA-Z-]+):/g, '<span class="text-blue-400">$1</span>:')
        .replace(/([{};])/g, '<span class="text-yellow-400">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
    } else if (type === 'js') {
      highlighted = highlighted
        .replace(/(function|const|let|var|if|else|return|for|while|class|import|export)/g, '<span class="text-purple-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
        .replace(/(&quot;[^&]*&quot;|&#x27;[^&#]*&#x27;)/g, '<span class="text-green-400">$1</span>');
    }
    
    return highlighted;
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center glass-dark">
        <div className="text-center space-y-4">
          <Code className="w-16 h-16 mx-auto text-primary/50 animate-pulse-glow" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-enigma">Welcome to Enigma IDE</h3>
            <p className="text-muted-foreground max-w-md">
              Select a file from the explorer to view and edit its contents. 
              Experience premium code editing with syntax highlighting and modern features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col glass-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-black/20">
        <div className="flex items-center gap-3">
          {getFileIcon(file.type)}
          <div>
            <h3 className="text-sm font-semibold text-enigma">{file.name}</h3>
            <p className="text-xs text-muted-foreground">{getLanguage(file.type)} • {file.content.length} characters</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="default" className="text-xs bg-orange-500">
              Unsaved Changes
            </Badge>
          )}
          
          <Badge variant="outline" className="text-xs">
            {getLanguage(file.type)}
          </Badge>
          
          {isEditable && hasChanges && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="hover:bg-primary/80"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="hover:bg-white/10"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 flex flex-col">
        {isEditable ? (
          <div className="flex-1 p-6">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full font-mono text-sm resize-none border-0 bg-black/20 focus:bg-black/30 transition-colors"
              placeholder="Start typing your code..."
              style={{ minHeight: '400px' }}
            />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="glass rounded-xl p-6 font-mono text-sm leading-relaxed">
                {/* Line numbers */}
                <div className="flex">
                  <div className="pr-4 border-r border-border/30 text-muted-foreground text-right min-w-[3rem] select-none">
                    {content.split('\n').map((_, index) => (
                      <div key={index} className="h-6 leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <div className="pl-6 flex-1 overflow-x-auto">
                    <pre className="text-foreground/90 whitespace-pre">
                      <code 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSyntax(
                            content
                              .replace(/</g, '&lt;')
                              .replace(/>/g, '&gt;')
                              .replace(/"/g, '&quot;')
                              .replace(/'/g, '&#x27;'), 
                            file.type
                          )
                        }} 
                      />
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-black/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>UTF-8 • LF • {file.type.toUpperCase()} {isEditable && hasChanges && '• Modified'}</span>
          <span>
            {content.split('\n').length} lines • {content.length} characters
          </span>
        </div>
      </div>
    </div>
  );
};