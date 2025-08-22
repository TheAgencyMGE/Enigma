import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileExplorer } from "@/components/FileExplorer";
import { CodeEditor } from "@/components/CodeEditor";
import { MobilePreview } from "@/components/MobilePreview";
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Code2, 
  Eye,
  ExternalLink, 
  Download,
  Loader2,
  RefreshCw,
  FileCode,
  Zap,
  Globe,
  Phone
} from "lucide-react";
import type { Project } from "@/pages/Index";

interface PreviewProps {
  project: Project | null;
  onUpdateProject?: (updates: Partial<Project>) => void;
  developmentMode?: 'web' | 'mobile';
  onDevelopmentModeChange?: (mode: 'web' | 'mobile') => void;
}

export const Preview = ({ project, onUpdateProject, developmentMode = 'web', onDevelopmentModeChange }: PreviewProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshPreview = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExportProject = () => {
    if (!project || !project.files || project.files.length === 0) return;
    
    // Generate random folder name
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const folderName = `enigma-project-${randomId}`;
    
    // Create zip-like structure using JSZip or simple file downloads
    project.files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}/${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
    
    // Also create a complete HTML file if separate files exist
    const htmlFile = project.files.find(f => f.type === 'html');
    const cssFile = project.files.find(f => f.type === 'css');
    const jsFile = project.files.find(f => f.type === 'js');
    
    if (htmlFile && (cssFile || jsFile)) {
      const fullHTML = createFullHTML(
        htmlFile.content,
        cssFile?.content || '',
        jsFile?.content || ''
      );
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}/complete.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileSave = (fileName: string, content: string) => {
    if (!project || !onUpdateProject) return;
    
    const updatedFiles = project.files.map(file => 
      file.name === fileName ? { ...file, content } : file
    );
    
    onUpdateProject({
      files: updatedFiles,
      lastModified: new Date()
    });
    
    // Refresh preview to show changes
    setTimeout(() => refreshPreview(), 100);
  };

  // Helper function to create full HTML (exactly like webscript.js does)
  const createFullHTML = (htmlContent: string, cssContent: string, jsContent: string): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Landing Page</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent}
    <script>
        ${jsContent}
    </script>
</body>
</html>`;
  };

  const getPreviewContent = () => {
    console.log('🖼️ Enigma Preview rendering:', {
      hasProject: !!project,
      filesCount: project?.files?.length || 0,
      status: project?.status,
      fileNames: project?.files?.map(f => f.name) || []
    });
    
    if (!project?.files || project.files.length === 0) {
      return (
        <div className="h-full flex items-center justify-center glass-dark">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 gradient-primary rounded-lg mx-auto flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Enigma Preview
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start building with Enigma AI to see your creation come to life
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (project.status === 'building') {
      return (
        <div className="h-full flex items-center justify-center glass-dark">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-foreground">
                Enigma AI is Building Your Project
              </h4>
              <p className="text-sm text-muted-foreground">
                Generating code...
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Get all HTML files for multi-page support
    const htmlFiles = project.files.filter(f => f.type === 'html');
    const mainHtmlFile = project.files.find(f => f.name === 'index.html') || htmlFiles[0];
    
    if (!mainHtmlFile) {
      return (
        <div className="h-full flex items-center justify-center glass-dark">
          <div className="text-center space-y-4">
            <FileCode className="w-16 h-16 mx-auto text-accent/50" />
            <p className="text-muted-foreground">No HTML file found in project</p>
            <p className="text-xs text-muted-foreground/70">
              Available files: {project.files.map(f => f.name).join(', ')}
            </p>
          </div>
        </div>
      );
    }

    // Get CSS and JS files
    const cssFile = project.files.find(f => f.name === 'style.css' || f.name === 'styles.css');
    const jsFile = project.files.find(f => f.name === 'script.js');

    // Enhanced HTML with multi-page navigation support
    let enhancedHTML = mainHtmlFile.content;
    
    // Add navigation script for multi-page support
    if (htmlFiles.length > 1) {
      const navScript = `
<script>
// Multi-page navigation system
(function() {
  const pages = ${JSON.stringify(htmlFiles.reduce((acc, file) => {
    acc[file.name] = file.content;
    return acc;
  }, {}))};
  
  const css = ${JSON.stringify(cssFile?.content || '')};
  const js = ${JSON.stringify(jsFile?.content || '')};
  
  function navigateToPage(pageName) {
    if (pages[pageName]) {
      document.open();
      document.write(pages[pageName]);
      document.close();
      
      // Re-inject styles and scripts
      if (css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      }
      if (js) {
        const script = document.createElement('script');
        script.textContent = js;
        document.body.appendChild(script);
      }
      
      // Re-attach navigation listeners
      attachNavigation();
    }
  }
  
  function attachNavigation() {
    document.addEventListener('click', function(e) {
      if (e.target.matches('a[href$=".html"]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const pageName = href.replace(/^.*\//, '');
        navigateToPage(pageName);
      }
    });
  }
  
  // Initial setup
  window.addEventListener('load', attachNavigation);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachNavigation);
  } else {
    attachNavigation();
  }
})();
</script>`;
      
      // Inject before closing body or at the end
      if (enhancedHTML.includes('</body>')) {
        enhancedHTML = enhancedHTML.replace('</body>', navScript + '</body>');
      } else {
        enhancedHTML += navScript;
      }
    }

    // Create complete HTML with embedded CSS and JS
    const fullHTML = createFullHTML(enhancedHTML, cssFile?.content || '', jsFile?.content || '');

    // Create blob URL
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    return (
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-0 rounded-xl overflow-hidden shadow-enigma"
        title={`${project.name} Preview`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-presentation"
        onLoad={() => {
          console.log('🔄 Preview iframe loaded successfully');
          // Clean up the blob URL after loading
          URL.revokeObjectURL(url);
        }}
        onError={(e) => console.error('❌ Preview iframe error:', e)}
      />
    );
  };

  const getDeviceClass = () => {
    switch (deviceView) {
      case 'mobile':
        return 'w-[390px] h-[844px] mx-auto'; // iPhone 14 Pro dimensions for more realistic aspect ratio
      case 'tablet':
        return 'max-w-4xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const getDeviceFrame = () => {
    if (deviceView === 'mobile') {
      return `
        relative
        rounded-[3rem] 
        p-1.5
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
        shadow-2xl 
        border-4 border-gray-700
        before:absolute before:top-6 before:left-1/2 before:-translate-x-1/2 
        before:w-32 before:h-6 before:bg-black before:rounded-full before:z-10
        after:absolute after:top-7 after:left-1/2 after:-translate-x-1/2 
        after:w-3 after:h-3 after:bg-gray-800 after:rounded-full after:z-20
      `.replace(/\s+/g, ' ').trim();
    }
    if (deviceView === 'tablet') {
      return 'rounded-2xl p-4 bg-gradient-to-b from-gray-800 to-gray-900 shadow-gold';
    }
    return '';
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center glass-dark">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 gradient-primary rounded-lg mx-auto flex items-center justify-center">
            <Monitor className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">Enigma Preview</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create a new project to start building with Enigma AI
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-orange-500/20 bg-gray-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          {/* Development Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={developmentMode === 'web' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDevelopmentModeChange?.('web')}
              className={developmentMode === 'web' ? 'bg-orange-600 hover:bg-orange-700' : 'glass hover:bg-white/10'}
            >
              <Globe className="w-4 h-4 mr-2" />
              Web
            </Button>
            <Button
              variant={developmentMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDevelopmentModeChange?.('mobile')}
              className={developmentMode === 'mobile' ? 'bg-orange-600 hover:bg-orange-700' : 'glass hover:bg-white/10'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800/50 border border-orange-500/20">
              <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Code2 className="w-4 h-4" />
                Code Editor
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "preview" && developmentMode === 'web' && (
            <Tabs value={deviceView} onValueChange={setDeviceView}>
              <TabsList className="bg-gray-800/50 border border-orange-500/20">
                <TabsTrigger value="desktop" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <Monitor className="w-4 h-4" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="tablet" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <Tablet className="w-4 h-4" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {developmentMode === 'mobile' ? 'React Native' : 'HTML/CSS/JS'}
            </Badge>
            
            {project.files.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <FileCode className="w-3 h-3 mr-1" />
                {project.files.length} files
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="glass hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {project.status === 'live' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportProject}
              className="glass hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="preview" className="h-full m-0">
            {developmentMode === 'mobile' ? (
              <MobilePreview 
                project={project}
                onUpdateProject={onUpdateProject}
              />
            ) : (
              <div className="h-full p-6">
                <div className={`h-full ${getDeviceClass()}`}>
                  <div className={`h-full ${getDeviceFrame()}`}>
                    <div className="h-full rounded-xl overflow-hidden shadow-glass bg-black relative">
                      {getPreviewContent()}
                      
                      {/* Loading overlay */}
                      {isRefreshing && (
                        <div className="absolute inset-0 glass-dark flex items-center justify-center z-50">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Refreshing preview...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="h-full m-0">
            <div className="h-full flex">
              {/* File Explorer */}
              <div className="w-80 border-r border-border/50">
                <FileExplorer
                  files={project.files}
                  activeFile={activeFile}
                  onFileSelect={setActiveFile}
                  onPreview={() => setActiveTab("preview")}
                />
              </div>
              
              {/* Code Editor */}
              <div className="flex-1">
                <CodeEditor
                  file={activeFile ? project.files.find(f => f.name === activeFile) || null : null}
                  onClose={() => setActiveFile(null)}
                  onSave={handleFileSave}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};