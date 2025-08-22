import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { ChatInterface } from "@/components/ChatInterface";
import { Preview } from "@/components/Preview";
import { ProjectDashboard } from "@/components/ProjectDashboard";

export interface ProjectFile {
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'jsx' | 'tsx' | 'ts';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'mobile' | 'fullstack';
  status: 'draft' | 'building' | 'live' | 'error';
  thumbnail: string;
  lastModified: Date;
  files: ProjectFile[];
  messages: any[];
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'builder'>('dashboard');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [developmentMode, setDevelopmentMode] = useState<'web' | 'mobile'>('web');

  const createNewProject = (type: 'website' | 'mobile' | 'fullstack' = 'website') => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `New ${type} Project`,
      description: '',
      type,
      status: 'draft',
      thumbnail: '/placeholder.svg',
      lastModified: new Date(),
      files: [],
      messages: []
    };
    
    // Set development mode based on project type
    setDevelopmentMode(type === 'mobile' ? 'mobile' : 'web');
    
    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
    setCurrentView('builder');
  };

  const openProject = (project: Project) => {
    // Set development mode based on project type
    setDevelopmentMode(project.type === 'mobile' ? 'mobile' : 'web');
    
    setCurrentProject(project);
    setCurrentView('builder');
  };

  const updateProject = (updates: Partial<Project>) => {
    if (!currentProject) return;
    
    const updatedProject = { ...currentProject, ...updates, lastModified: new Date() };
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <ProjectDashboard 
          projects={projects}
          onOpenProject={openProject}
          onNewProject={createNewProject}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Chat Interface - Left Side */}
        <div className="w-2/5 border-r border-orange-500/20">
          <ChatInterface 
            project={currentProject}
            onUpdateProject={updateProject}
            onBackToDashboard={() => setCurrentView('dashboard')}
            developmentMode={developmentMode}
          />
        </div>
        
        {/* Preview Pane - Right Side */}
        <div className="w-3/5">
          <Preview 
            project={currentProject}
            onUpdateProject={updateProject}
            developmentMode={developmentMode}
            onDevelopmentModeChange={setDevelopmentMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;