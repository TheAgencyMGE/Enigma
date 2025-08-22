import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Zap
} from "lucide-react";

interface BuildTerminalProps {
  isBuilding: boolean;
  onBuildComplete: (success: boolean) => void;
  projectType: 'website' | 'mobile' | 'fullstack';
  prompt: string;
}

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'command';
  message: string;
  timestamp: Date;
}

export const BuildTerminal = ({ isBuilding, onBuildComplete, projectType, prompt }: BuildTerminalProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const buildSteps = [
    { message: "🚀 Initializing AI build system...", delay: 500, type: 'info' as const },
    { message: "📦 Installing dependencies...", delay: 1000, type: 'info' as const },
    { message: "✅ Dependencies installed successfully", delay: 800, type: 'success' as const },
    { message: "🔧 Configuring build environment...", delay: 600, type: 'info' as const },
    { message: "🎨 Processing AI-generated code...", delay: 1200, type: 'info' as const },
    { message: "⚡ Optimizing animations and effects...", delay: 900, type: 'info' as const },
    { message: "📱 Ensuring responsive design...", delay: 700, type: 'info' as const },
    { message: "🧪 Running quality checks...", delay: 800, type: 'info' as const },
    { message: "✨ Build completed successfully!", delay: 500, type: 'success' as const },
  ];

  useEffect(() => {
    if (isBuilding && currentStep === 0) {
      setLogs([]);
      setCurrentStep(1);
      
      // Add initial command
      addLog('command', `$ ai-build generate --type ${projectType} --prompt "${prompt.substring(0, 50)}..."`);
    } else if (!isBuilding && currentStep > 0) {
      // Building stopped, complete the process
      if (currentStep < buildSteps.length) {
        addLog('success', '✨ AI generation completed successfully!');
        addLog('info', '🚀 Project is now live and ready for preview');
      }
      setTimeout(() => {
        onBuildComplete(true);
        setCurrentStep(0);
      }, 500);
    }
  }, [isBuilding]);

  useEffect(() => {
    if (isBuilding && currentStep > 0 && currentStep <= buildSteps.length) {
      const step = buildSteps[currentStep - 1];
      const timer = setTimeout(() => {
        addLog(step.type, step.message);
        
        if (currentStep === buildSteps.length) {
          // All steps shown, but keep building until actual AI completes
          // The build will complete when isBuilding becomes false
        } else {
          setCurrentStep(currentStep + 1);
        }
      }, step.delay);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isBuilding]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'command':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-purple-400" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'command':
        return 'text-blue-400';
      default:
        return 'text-purple-400';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setCurrentStep(0);
  };

  return (
    <div className="h-full flex flex-col glass-dark border border-border/50 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">AI Build Terminal</span>
          </div>
          <Badge variant={isBuilding ? "default" : "outline"} className="text-xs">
            {isBuilding ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Building</>
            ) : (
              <>Ready</>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            disabled={isBuilding}
            className="h-8 px-3 text-xs hover:bg-white/10"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1 p-4 font-mono text-sm">
        <div ref={scrollRef} className="space-y-2">
          {logs.length === 0 && !isBuilding && (
            <div className="text-gray-500 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Terminal ready. Start building to see output...</p>
            </div>
          )}
          
          {logs.map((log, index) => (
            <div
              key={log.id}
              className={`flex items-start gap-3 ${getLogColor(log.type)} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getLogIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="break-words">{log.message}</span>
                {log.type === 'command' && (
                  <div className="mt-1 text-xs text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
              {isBuilding && index === logs.length - 1 && log.type === 'info' && (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400 flex-shrink-0" />
              )}
            </div>
          ))}
          
          {isBuilding && (
            <div className="flex items-center gap-3 text-purple-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Terminal Footer */}
      <div className="px-4 py-2 border-t border-border/50 bg-black/20">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>AI Build System v2.1.0</span>
          <span>{logs.length} lines</span>
        </div>
      </div>
    </div>
  );
};