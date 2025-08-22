import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowLeft, Plus, Zap, Smartphone, Globe, Sparkles, Code2, Layers3 } from "lucide-react";
import type { Project } from "@/pages/Index";

interface HeaderProps {
  onNewProject: (type?: 'website' | 'mobile' | 'fullstack') => void;
  onBackToDashboard: () => void;
  showBackButton: boolean;
  currentProject?: Project | null;
}

export const Header = ({ 
  onNewProject, 
  onBackToDashboard, 
  showBackButton,
  currentProject 
}: HeaderProps) => {
  return (
    <header className="h-20 border-b border-border/30 glass-dark backdrop-blur-xl relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30 animate-gradient" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary-bright/30 to-transparent animate-pulse delay-500" />
      
      <div className="relative z-10 flex items-center justify-between h-full px-8">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDashboard}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/10 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          )}
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 gradient-cosmic rounded-2xl flex items-center justify-center animate-pulse-glow p-1">
                <img 
                  src="/Untitled_design__7_-removebg-preview.png" 
                  alt="Enigma Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="absolute inset-0 gradient-cosmic rounded-2xl animate-pulse opacity-50 blur-sm" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-neon animate-neon-pulse">
                Enigma Studio
              </h1>
              {currentProject && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{currentProject.name}</p>
                  <Badge 
                    variant={currentProject.status === 'live' ? 'default' : 
                            currentProject.status === 'building' ? 'secondary' : 'outline'}
                    className="animate-pulse"
                  >
                    {currentProject.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Quick Stats */}
          {currentProject && (
            <div className="hidden md:flex items-center gap-4 px-4 py-2 glass rounded-lg">
              <div className="flex items-center gap-1 text-xs">
                <Code2 className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">Live Preview</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1 text-xs">
                <Layers3 className="w-3 h-3 text-secondary-bright" />
                <span className="text-muted-foreground">{currentProject.type}</span>
              </div>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gradient-cosmic hover:shadow-glow transition-all duration-500 hover:scale-105 relative overflow-hidden group">
                <div className="absolute inset-0 gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />
                <div className="relative flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-medium">New Project</span>
                  <ChevronDown className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass-dark border-border/50">
              <DropdownMenuItem 
                onClick={() => onNewProject('website')}
                className="group hover:bg-primary/10 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Website Project</p>
                    <p className="text-xs text-muted-foreground">Responsive web applications</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onNewProject('mobile')}
                className="group hover:bg-secondary-bright/10 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-secondary-bright/20 flex items-center justify-center group-hover:bg-secondary-bright/30 transition-colors">
                    <Smartphone className="w-4 h-4 text-secondary-bright" />
                  </div>
                  <div>
                    <p className="font-medium">Mobile App Project</p>
                    <p className="text-xs text-muted-foreground">Native iOS & Android apps</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onNewProject('fullstack')}
                className="group hover:bg-accent-bright/10 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-accent-bright/20 flex items-center justify-center group-hover:bg-accent-bright/30 transition-colors">
                    <Sparkles className="w-4 h-4 text-accent-bright" />
                  </div>
                  <div>
                    <p className="font-medium">Full Stack Project</p>
                    <p className="text-xs text-muted-foreground">Complete web applications</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};