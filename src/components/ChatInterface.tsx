import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { BuildTerminal } from "@/components/BuildTerminal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Bot, 
  Zap, 
  Wand2, 
  Code, 
  Palette,
  Smartphone,
  Globe,
  Terminal,
  MessageSquare,
  Home
} from "lucide-react";
import { generateWithAI } from "@/services/aiService";
import type { Project } from "@/pages/Index";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  project: Project | null;
  onUpdateProject: (updates: Partial<Project>) => void;
  onBackToDashboard?: () => void;
  developmentMode?: 'web' | 'mobile';
}

const QUICK_PROMPTS = [
  {
    icon: Palette,
    text: "Create a stunning hero section with animations",
    category: "Design",
    mode: 'web' as const
  },
  {
    icon: Code,
    text: "Add interactive contact form with validation",
    category: "Features",
    mode: 'web' as const
  },
  {
    icon: Smartphone,
    text: "Make it fully responsive for all devices",
    category: "Mobile",
    mode: 'web' as const
  },
  {
    icon: Sparkles,
    text: "Add smooth scroll animations and transitions",
    category: "Effects",
    mode: 'web' as const
  },
  {
    icon: Globe,
    text: "Create a modern navigation with dropdown menus",
    category: "Navigation",
    mode: 'web' as const
  },
  {
    icon: Wand2,
    text: "Add dark mode toggle with smooth transitions",
    category: "Theme",
    mode: 'web' as const
  }
];

const MOBILE_PROMPTS = [
  {
    icon: Smartphone,
    text: "Create a welcome screen with animated logo",
    category: "Design",
    mode: 'mobile' as const
  },
  {
    icon: Code,
    text: "Add a login screen with form validation",
    category: "Auth",
    mode: 'mobile' as const
  },
  {
    icon: Palette,
    text: "Create a profile screen with user details",
    category: "Screens",
    mode: 'mobile' as const
  },
  {
    icon: Sparkles,
    text: "Add navigation between screens",
    category: "Navigation",
    mode: 'mobile' as const
  },
  {
    icon: Globe,
    text: "Create a list view with scrollable items",
    category: "Components",
    mode: 'mobile' as const
  },
  {
    icon: Wand2,
    text: "Add touch gestures and animations",
    category: "Interactions",
    mode: 'mobile' as const
  }
];

export const ChatInterface = ({ project, onUpdateProject, onBackToDashboard, developmentMode = 'web' }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'terminal'>('chat');
  const [currentPrompt, setCurrentPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project?.messages) {
      setMessages(project.messages);
    }
  }, [project]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get appropriate prompts based on development mode
  const currentPrompts = developmentMode === 'mobile' ? MOBILE_PROMPTS : QUICK_PROMPTS;

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating || !project) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input.trim();
    setCurrentPrompt(currentInput);
    setInput("");
    setIsGenerating(true);

    // Show terminal and switch to it for build process
    setShowTerminal(true);
    setActiveTab('terminal');
    
    // Update project status to building
    onUpdateProject({
      messages: newMessages,
      status: 'building'
    });

    try {
      console.log('💬 Starting AI generation for chat interface...');
      // Convert chat messages to the format expected by AI service
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Prepare existing files for context
      const existingFiles = project.files.map(f => ({
        name: f.name,
        content: f.content,
        type: f.type
      }));
      
      // Generate with AI - pass conversation history and existing files
      const response = await generateWithAI(
        currentInput, 
        project.type, 
        '', // existingCode parameter (legacy)
        conversationHistory,
        existingFiles,
        developmentMode
      );
      console.log('💬 AI generation complete, response:', {
        messageLength: response.message.length,
        filesCount: response.files.length,
        fileNames: response.files.map(f => f.name)
      });
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Update project with new files and complete the build
      console.log('💬 Updating project with new files...', response.files);
      onUpdateProject({
        messages: finalMessages,
        files: response.files,
        status: 'live'
      });
      
      // Build is complete
      setIsGenerating(false);
      setCurrentPrompt("");
      console.log('💬 Build completed, switching back to chat in 3s...');
      
      // Switch back to chat after a delay
      setTimeout(() => {
        setActiveTab('chat');
      }, 3000);

    } catch (error) {
      console.error('AI generation error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error while generating your code. Let me try a different approach. Could you provide more specific details about what you'd like to build?",
        timestamp: new Date()
      };
      
      setMessages([...newMessages, errorMessage]);
      onUpdateProject({ status: 'error' });
      setIsGenerating(false);
      setCurrentPrompt("");
    }
  };

  const handleBuildComplete = (success: boolean) => {
    // This is called by the terminal when its animation completes
    // The actual build status is handled in handleSendMessage
    console.log('Build terminal animation completed:', success);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-10 animate-gradient" />
        <div className="relative text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-glow" />
          <h3 className="text-xl font-semibold mb-2">Ready to Build</h3>
          <p className="text-muted-foreground">Select a project to start building with AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-black to-red-500/5 animate-gradient" />
      
      {/* Project Info */}
      <div className="relative z-10 p-6 border-b border-orange-500/20 bg-gray-900/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToDashboard}
                className="text-gray-400 hover:text-orange-400 hover:bg-orange-500/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-orange-400">ENIGMA</h3>
              </div>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Tabs for Chat/Terminal */}
        {showTerminal && (
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'terminal')}>
              <TabsList className="glass">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Build Terminal
                  {isGenerating && <Loader2 className="w-3 h-3 animate-spin" />}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative z-10">
        {(!showTerminal || activeTab === 'chat') ? (
          /* Messages */
          <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto animate-ping opacity-20" />
              </div>
              
              <h4 className="text-2xl font-bold text-orange-400 mb-3">
                Enigma {developmentMode === 'mobile' ? 'Mobile' : 'Web'} Development
              </h4>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                Describe what you want to build and Enigma AI will generate beautiful, production-ready {developmentMode === 'mobile' ? 'React Native' : 'HTML/CSS/JS'} code with animations and effects
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {currentPrompts.slice(0, 4).map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="group h-auto p-4 text-left justify-start border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 whitespace-normal"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors flex-shrink-0">
                          <Icon className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors break-words">
                            {prompt.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {prompt.category}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'gradient-cosmic animate-pulse-glow'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[85%] ${
                  message.role === 'user'
                    ? 'glass-dark border border-primary/30 p-4 rounded-2xl'
                    : 'glass p-4 rounded-2xl border border-border/50'
                }`}>
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer 
                      content={message.content}
                      className="prose-sm"
                    />
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {message.role === 'assistant' && (
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-2xl gradient-cosmic flex items-center justify-center animate-pulse-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block glass p-4 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-primary animate-pulse">
                      Generating your code with AI magic...
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        ) : (
          /* Terminal */
          <BuildTerminal 
            isBuilding={isGenerating}
            onBuildComplete={handleBuildComplete}
            projectType={project.type}
            prompt={currentPrompt || "Building project..."}
          />
        )}
      </div>

      {/* Input Area - Only show when on chat tab */}
      {(!showTerminal || activeTab === 'chat') && (
        <div className="relative z-10 p-6 border-t border-border/30 glass-dark">
        {messages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {currentPrompts.slice(4).map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="h-auto p-3 text-xs border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group whitespace-normal text-left"
                >
                  <Icon className="w-3 h-3 mr-2 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0" />
                  <span className="break-words text-white group-hover:text-orange-400">{prompt.text}</span>
                </Button>
              );
            })}
          </div>
        )}
        
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build... (supports markdown)"
            className="pr-14 resize-none glass border-border/50 focus:border-primary/50 transition-all duration-300"
            rows={3}
            disabled={isGenerating}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="absolute bottom-3 right-3 gradient-cosmic hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        </div>
      )}
    </div>
  );
};