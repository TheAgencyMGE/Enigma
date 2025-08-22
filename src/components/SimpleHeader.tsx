import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Crown
} from "lucide-react";
import type { Project } from "@/pages/Index";

interface SimpleHeaderProps {
  onNewProject: (type: 'website' | 'mobile' | 'fullstack') => void;
  onBackToDashboard: () => void;
  showBackButton: boolean;
  currentProject?: Project | null;
}

export const SimpleHeader = ({ 
  onNewProject, 
  onBackToDashboard, 
  showBackButton,
  currentProject 
}: SimpleHeaderProps) => {
  return (
    <header className="h-16 border-b border-border/50 glass-dark">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left section */}
        <div className="flex items-center gap-6">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDashboard}
              className="hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Enigma Studio</h1>
          </div>
          
          {/* Current Project Info */}
          {currentProject && (
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-border/50">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {currentProject.name}
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNewProject('website')}
            className="gradient-primary"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Website
          </Button>
          
          <Button
            onClick={() => onNewProject('mobile')}
            variant="outline"
            className="glass hover:bg-white/10"
            size="sm"
          >
            Mobile App
          </Button>
          
          <Button
            onClick={() => onNewProject('fullstack')}
            variant="outline"
            className="glass hover:bg-white/10"
            size="sm"
          >
            Full Stack
          </Button>
        </div>
      </div>
    </header>
  );
};