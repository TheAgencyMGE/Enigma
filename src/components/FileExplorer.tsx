import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Code, 
  FileJson,
  Folder,
  FolderOpen,
  Eye,
  Download,
  Copy
} from "lucide-react";
import type { ProjectFile } from "@/pages/Index";

interface FileExplorerProps {
  files: ProjectFile[];
  activeFile: string | null;
  onFileSelect: (fileName: string) => void;
  onPreview: () => void;
}

export const FileExplorer = ({ files, activeFile, onFileSelect, onPreview }: FileExplorerProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const getFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="h-full flex flex-col glass-dark border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 hover:bg-white/10"
            >
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-primary" />
              ) : (
                <Folder className="w-4 h-4 text-primary" />
              )}
            </Button>
            <span className="text-sm font-medium text-enigma">Project Files</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {files.length}
          </Badge>
        </div>
      </div>

      {/* Files List */}
      {isExpanded && (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {files.map((file) => (
              <div
                key={file.name}
                className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeFile === file.name
                    ? 'bg-primary/20 border border-primary/30'
                    : 'hover:bg-white/5 hover:border hover:border-white/10'
                }`}
                onClick={() => onFileSelect(file.name)}
              >
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${
                      activeFile === file.name ? 'text-primary-neon' : 'text-foreground'
                    }`}>
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {getFileSize(file.content)}
                    </span>
                  </div>
                  
                  {file.type === 'html' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        entry
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-border/50 bg-black/20">
        <div className="space-y-2">
          <Button
            onClick={onPreview}
            className="w-full gradient-primary hover:bg-primary/80 transition-all duration-300"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Website
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 glass hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 glass hover:bg-white/10"
            >
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};