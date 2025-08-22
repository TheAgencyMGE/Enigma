import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  RotateCcw, 
  RefreshCw, 
  Loader2,
  Zap,
  FileCode,
  Download
} from "lucide-react";
import type { Project } from "@/pages/Index";

interface MobilePreviewProps {
  project: Project | null;
  onUpdateProject?: (updates: Partial<Project>) => void;
}

export const MobilePreview = ({ project, onUpdateProject }: MobilePreviewProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshPreview = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  const handleExportProject = () => {
    if (!project || !project.files || project.files.length === 0) return;
    
    const randomId = Math.random().toString(36).substring(2, 15);
    const folderName = `react-native-project-${randomId}`;
    
    // Create React Native project structure
    const projectStructure = {
      'App.js': getAppJsContent(),
      'package.json': getPackageJsonContent(),
      'app.json': getAppJsonContent(),
      'README.md': getReadmeContent(),
      'babel.config.js': getBabelConfigContent(),
      'metro.config.js': getMetroConfigContent(),
    };

    // Add user's custom files
    project.files.forEach(file => {
      if (file.type === 'jsx' || file.type === 'js') {
        projectStructure[file.name] = file.content;
      }
    });

    // Download all files
    Object.entries(projectStructure).forEach(([fileName, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}/${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const getAppJsContent = () => {
    const mainFile = project?.files.find(f => f.name === 'App.js' || f.name === 'App.jsx');
    return mainFile?.content || `
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to React Native</Text>
        <Text style={styles.subtitle}>Built with Enigma AI</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
`;
  };

  const getPackageJsonContent = () => {
    return JSON.stringify({
      "name": project?.name?.toLowerCase().replace(/\s+/g, '-') || "enigma-mobile-app",
      "version": "1.0.0",
      "main": "node_modules/expo/AppEntry.js",
      "scripts": {
        "start": "expo start",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web"
      },
      "dependencies": {
        "expo": "~49.0.15",
        "react": "18.2.0",
        "react-native": "0.72.6",
        "react-native-web": "~0.19.6"
      },
      "devDependencies": {
        "@babel/core": "^7.20.0"
      },
      "private": true
    }, null, 2);
  };

  const getAppJsonContent = () => {
    return JSON.stringify({
      "expo": {
        "name": project?.name || "Enigma Mobile App",
        "slug": project?.name?.toLowerCase().replace(/\s+/g, '-') || "enigma-mobile-app",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "splash": {
          "image": "./assets/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": [
          "**/*"
        ],
        "ios": {
          "supportsTablet": true
        },
        "android": {
          "adaptiveIcon": {
            "foregroundImage": "./assets/adaptive-icon.png",
            "backgroundColor": "#ffffff"
          }
        },
        "web": {
          "favicon": "./assets/favicon.png"
        }
      }
    }, null, 2);
  };

  const getReadmeContent = () => {
    return `# ${project?.name || 'Enigma Mobile App'}

This is a React Native project created with Enigma AI.

## Get Started

1. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

2. Start the app
   \`\`\`bash
   npx expo start
   \`\`\`

In the output, you'll find options to open the app in a:
- Development build
- Android emulator
- iOS simulator
- Expo Go, a limited sandbox for trying out app development with Expo

## Built with Enigma AI

This project was generated using Enigma AI's mobile development platform.
`;
  };

  const getBabelConfigContent = () => {
    return `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`;
  };

  const getMetroConfigContent = () => {
    return `const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;`;
  };

  const getPreviewContent = () => {
    if (!project?.files || project.files.length === 0) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">
                Enigma Mobile
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Start building your mobile app with Enigma AI to see the preview
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (project.status === 'building') {
      return (
        <div className="h-full flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-4 p-8">
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-gray-800">
                Enigma AI is Building Your Mobile App
              </h4>
              <p className="text-sm text-gray-600">
                Generating React Native code...
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Find main React Native file
    const mainFile = project.files.find(f => f.name === 'App.js' || f.name === 'App.jsx') || project.files[0];
    
    if (!mainFile) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-4 p-8">
            <FileCode className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-gray-600">No React Native file found in project</p>
          </div>
        </div>
      );
    }

    // Create a web-compatible preview of React Native components
    const webPreviewHTML = createReactNativeWebPreview(mainFile.content);
    const blob = new Blob([webPreviewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    return (
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-0"
        title={`${project.name} Mobile Preview`}
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => {
          URL.revokeObjectURL(url);
        }}
      />
    );
  };

  const createReactNativeWebPreview = (reactNativeCode: string): string => {
    // Convert React Native components to web-compatible versions
    const webCode = reactNativeCode
      .replace(/import.*from\s+['"]react-native['"];?/g, '')
      .replace(/View/g, 'div')
      .replace(/Text/g, 'span')
      .replace(/ScrollView/g, 'div')
      .replace(/StyleSheet\.create\(/g, 'const styles = ')
      .replace(/style={styles\.(\w+)}/g, 'className="rn-$1"')
      .replace(/style={\[styles\.(\w+),\s*styles\.(\w+)\]}/g, 'className="rn-$1 rn-$2"');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Native Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background-color: #f5f5f5;
        height: 100vh;
        overflow: auto;
      }
      .rn-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f5f5f5;
      }
      .rn-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        flex: 1;
      }
      .rn-title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      .rn-subtitle {
        font-size: 16px;
        color: #666;
      }
      div {
        display: flex;
        flex-direction: column;
      }
      span {
        display: block;
      }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
      const { useState, useEffect } = React;
      
      function App() {
        return React.createElement('div', {className: 'rn-container'}, 
          React.createElement('div', {className: 'rn-content'},
            React.createElement('span', {className: 'rn-title'}, 'Welcome to React Native'),
            React.createElement('span', {className: 'rn-subtitle'}, 'Built with Enigma AI')
          )
        );
      }
      
      ReactDOM.render(React.createElement(App), document.getElementById('root'));
    </script>
</body>
</html>`;
  };

  const getDeviceFrame = () => {
    if (orientation === 'landscape') {
      return `
        relative w-[844px] h-[390px] mx-auto
        rounded-[3rem] p-1.5
        bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
        shadow-2xl border-4 border-gray-700
        before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 
        before:h-32 before:w-6 before:bg-black before:rounded-full before:z-10
        after:absolute after:left-7 after:top-1/2 after:-translate-y-1/2 
        after:h-3 after:w-3 before:bg-gray-800 after:rounded-full after:z-20
      `.replace(/\s+/g, ' ').trim();
    }
    
    return `
      relative w-[390px] h-[844px] mx-auto
      rounded-[3rem] p-1.5
      bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
      shadow-2xl border-4 border-gray-700
      before:absolute before:top-6 before:left-1/2 before:-translate-x-1/2 
      before:w-32 before:h-6 before:bg-black before:rounded-full before:z-10
      after:absolute after:top-7 after:left-1/2 after:-translate-x-1/2 
      after:w-3 before:h-3 after:bg-gray-800 after:rounded-full after:z-20
    `.replace(/\s+/g, ' ').trim();
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-6 border-b border-orange-500/20 bg-gray-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-white">React Native Preview</h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={project?.status === 'live' ? 'default' : 
                      project?.status === 'building' ? 'secondary' : 
                      project?.status === 'error' ? 'destructive' : 'outline'}
              className="animate-pulse"
            >
              <div className="w-2 h-2 rounded-full bg-current mr-1 animate-pulse" />
              {project?.status || 'draft'}
            </Badge>
            
            {project?.files && project.files.length > 0 && (
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
            onClick={toggleOrientation}
            className="glass hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="glass hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {project?.status === 'live' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportProject}
              className="glass hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export RN
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Preview Area */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className={getDeviceFrame()}>
          <div className="h-full rounded-[2.5rem] overflow-hidden bg-white relative">
            {/* Status Bar */}
            <div className="h-10 bg-black flex items-center justify-between px-6 text-white text-sm font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-6 h-3 border border-white rounded-sm">
                  <div className="w-4 h-1 bg-white rounded-full m-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="h-[calc(100%-40px)] relative">
              {getPreviewContent()}
              
              {/* Loading overlay */}
              {isRefreshing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                    <p className="text-sm text-white">Refreshing preview...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
