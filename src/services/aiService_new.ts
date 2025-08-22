interface AIResponse {
  message: string;
  files: {
    name: string;
    content: string;
    type: 'html' | 'css' | 'js' | 'json' | 'jsx' | 'tsx' | 'ts';
  }[];
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIGenerationContext {
  projectType: 'website' | 'mobile' | 'fullstack';
  developmentMode?: 'web' | 'mobile';
  existingFiles: { name: string; content: string; type: string }[];
  conversationHistory: ConversationMessage[];
}

const GEMINI_API_KEY = 'AIzaSyC93lyDvWzOlrHUB0mw1Q6g-HOjtF9pKew';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

// DeepSeek fallback configuration
const DEEPSEEK_API_KEY = 'sk-d8993ab128b44b89a191d540d60c6cf1';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const generateWithAI = async (
  prompt: string,
  projectType: 'website' | 'mobile' | 'fullstack',
  existingCode: string = '',
  conversationHistory: ConversationMessage[] = [],
  existingFiles: { name: string; content: string; type: string }[] = [],
  developmentMode: 'web' | 'mobile' = 'web'
): Promise<AIResponse> => {
  // Build conversation context
  const conversationContext = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}\n`
    : '';

  // Build existing files context
  const existingFilesContext = existingFiles.length > 0 
    ? `\nEXISTING FILES:\n${existingFiles.map(file => `FILE: ${file.name}\n${file.content}\n---\n`).join('')}`
    : '';

  const systemPrompt = `You are an expert ${developmentMode === 'mobile' ? 'React Native' : 'web'} developer and designer. You can create complete ${developmentMode === 'mobile' ? 'mobile apps' : 'websites'} with multiple ${developmentMode === 'mobile' ? 'screens' : 'pages'}, modify existing code, and create specific files as requested.

${conversationContext}${existingFilesContext}

${developmentMode === 'mobile' ? `
FRAMEWORK: React Native
REACT NATIVE INSTRUCTIONS:
- Use React Native components (View, Text, ScrollView, TouchableOpacity, etc.)
- Use StyleSheet.create for styling
- Follow React Native best practices
- Use hooks (useState, useEffect) for state management
- Create functional components
- Use proper navigation structure
- Include proper imports from 'react-native'
- Use appropriate React Native layout patterns

COMMON REACT NATIVE COMPONENTS:
- View (instead of div)
- Text (for all text content)
- ScrollView (for scrollable content)
- TouchableOpacity (for buttons/clickable elements)
- Image (for images)
- TextInput (for input fields)
- FlatList (for lists)
- SafeAreaView (for safe areas)

STYLING:
- Use StyleSheet.create() for all styles
- Use flexbox for layouts
- No CSS units - use numbers for dimensions
- Use backgroundColor, not background-color
- Use marginTop, paddingHorizontal, etc.

MULTI-SCREEN GENERATION CAPABILITIES:
- You can create multiple screens (HomeScreen.js, AboutScreen.js, etc.)
- You can create component files (Button.js, Header.js, etc.)
- You can create navigation files (navigation.js)
- You can modify existing screens while preserving what should be kept
- When user asks for specific screens, create exactly what they request
` : `
FRAMEWORK: vanilla
VANILLA HTML/CSS/JS INSTRUCTIONS:
- Use semantic HTML5 elements
- Modern CSS with custom properties and modern layout
- Clean, modular JavaScript with ES6+ features
- No framework dependencies required

MULTI-FILE GENERATION CAPABILITIES:
- You can create multiple HTML pages (about.html, contact.html, etc.)
- You can create separate CSS files for different sections
- You can create multiple JS files for different functionality
- You can modify existing files while preserving what should be kept
- When user asks for specific files, create exactly what they request
`}

REQUIREMENTS:
- Generate complete code according to the selected ${developmentMode === 'mobile' ? 'React Native' : 'web'} platform
- Use modern, responsive design principles
- Include proper semantic structure
- Use modern layout techniques ${developmentMode === 'mobile' ? '(Flexbox for React Native)' : '(CSS Grid/Flexbox for vanilla)'}
- Add smooth transitions and interactive effects
- Ensure accessibility ${developmentMode === 'mobile' ? '(accessibilityLabel, accessibilityHint)' : '(ARIA labels, proper contrast, keyboard navigation)'}
- ${developmentMode === 'mobile' ? 'Include proper React Native meta configuration' : 'Include meta tags and SEO optimization'}
- Make it mobile-responsive
- ${developmentMode === 'mobile' ? 'Use React Native Image components' : 'Include placeholder images using services like Unsplash or Lorem Picsum with proper alt text'}
- Add subtle animations and interactions appropriate for the platform

MODIFICATION INSTRUCTIONS:
- If existing files are provided, build upon them unless user asks to replace completely
- Preserve existing functionality unless explicitly asked to change it
- When adding new features, integrate them seamlessly with existing code
- If user asks for specific changes to existing files, modify only what's requested

DESIGN GUIDELINES:
- Use modern color schemes and typography
- Implement proper spacing and visual hierarchy
- Include interactive buttons with press effects
- Add a navigation structure if appropriate
- ${developmentMode === 'mobile' ? 'Use React Native styling patterns' : 'Use CSS custom properties for theming'}
- Implement smooth animations and transitions

OUTPUT FORMAT:
Return your response in this exact JSON format with a message explaining what you created/modified:
{
  "message": "Explanation of what was created or modified",
  "files": [
    ${developmentMode === 'mobile' ? `
    {
      "name": "App.js",
      "content": "complete React Native App component with imports and export",
      "type": "jsx"
    },
    {
      "name": "styles.js", 
      "content": "StyleSheet.create with all component styles",
      "type": "js"
    }
    ` : `
    {
      "name": "index.html",
      "content": "complete HTML document with DOCTYPE, html, head, and body tags",
      "type": "html"
    },
    {
      "name": "style.css", 
      "content": "complete CSS code with all styles, animations, and responsive design",
      "type": "css"
    },
    {
      "name": "script.js",
      "content": "complete JavaScript code with all interactive functionality", 
      "type": "js"
    }
    `}
  ]
}

IMPORTANT: 
- Always include the "message" field explaining what you did
- Include ALL necessary files ${developmentMode === 'mobile' ? '(App.js, components, styles)' : '(HTML, CSS, JS)'} even if some weren't modified
- ${developmentMode === 'mobile' ? 'When creating multiple screens, name them appropriately (HomeScreen.js, ProfileScreen.js, etc.)' : 'When creating multiple pages, name them appropriately (about.html, contact.html, etc.)'}
- ${developmentMode === 'mobile' ? 'Each screen should be a COMPLETE React Native component that can be imported' : 'Each HTML file should be a COMPLETE document that can run standalone'}
- ${developmentMode === 'mobile' ? 'Use proper React Native import/export patterns' : 'Link CSS and JS files properly in HTML using relative paths'}

USER REQUEST: ${prompt}

${developmentMode === 'mobile' ? `
REACT NATIVE EXAMPLES:
- If user asks for "create a profile screen", create ProfileScreen.js with full React Native component structure
- If user asks for "add a login form", create LoginScreen.js with TextInput and TouchableOpacity components
- If user asks for "create a list view", create ListScreen.js with FlatList component
- If user asks for "separate the styles", create separate style files like styles/ProfileStyles.js
- If user asks for "add navigation", create navigation.js with proper React Navigation setup
- Always ensure all components use proper React Native imports and exports
- Use StyleSheet.create for all styling
` : `
MULTI-FILE EXAMPLES:
- If user asks for "create an about page", create about.html with full HTML structure
- If user asks for "add a contact form", create contact.html with form functionality
- If user asks for "create a portfolio section", create portfolio.html or add to existing pages
- If user asks for "separate the CSS", create additional CSS files like components.css, animations.css
- If user asks for "add JavaScript for", create specific JS files like animations.js, contact.js
- Always ensure all files are properly linked in the HTML files
`}`;

  try {
    console.log(`🤖 Starting AI generation with Gemini for ${developmentMode} mode...`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 32768
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    console.log('✅ AI response received, length:', generatedText.length);

    // Parse response like webscript.js does
    const files: AIResponse['files'] = [];
    let responseMessage = `Generated ${projectType} project based on your request.`;
    
    try {
      // Clean the text first - more aggressive cleaning
      let cleanText = generatedText.trim();
      
      // Remove markdown code block markers if present
      cleanText = cleanText.replace(/^```json\s*|\s*```$/g, '');
      cleanText = cleanText.replace(/^```\s*|\s*```$/g, '');
      
      // Find the JSON object more carefully
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonText = cleanText.substring(jsonStart, jsonEnd + 1);
        
        try {
          const parsed = JSON.parse(jsonText);
          
          // Check for new format (with message and files array)
          if (parsed.files && Array.isArray(parsed.files)) {
            responseMessage = parsed.message || responseMessage;
            for (const file of parsed.files) {
              if (file.name && file.content && file.type) {
                files.push({
                  name: file.name,
                  content: file.content,
                  type: file.type as 'html' | 'css' | 'js' | 'json' | 'jsx' | 'tsx' | 'ts'
                });
              }
            }
            console.log('🎉 Successfully parsed new format JSON response:', files.map(f => f.name));
          }
          // Check for old format (direct html, css, js properties) 
          else if (parsed.html || parsed.css || parsed.js || parsed.jsx) {
            if (parsed.html) {
              files.push({
                name: 'index.html',
                content: parsed.html,
                type: 'html'
              });
            }
            
            if (parsed.jsx) {
              files.push({
                name: 'App.js',
                content: parsed.jsx,
                type: 'jsx'
              });
            }
            
            if (parsed.css) {
              files.push({
                name: 'style.css',
                content: parsed.css,
                type: 'css'
              });
            }
            
            if (parsed.js) {
              files.push({
                name: developmentMode === 'mobile' ? 'styles.js' : 'script.js',
                content: parsed.js,
                type: 'js'
              });
            }
            
            console.log('🎉 Successfully parsed old format JSON response:', files.map(f => f.name));
          }
        } catch (innerJsonError) {
          console.warn('Inner JSON parsing failed:', innerJsonError);
          throw innerJsonError;
        }
      } else {
        throw new Error('No valid JSON object found');
      }
    } catch (jsonError) {
      console.warn('JSON parsing failed, trying code block extraction:', jsonError);
      // Fallback: extract code blocks
      if (developmentMode === 'mobile') {
        // Extract React Native JSX
        const jsxMatch = generatedText.match(/```(?:jsx|javascript)\s*\n([\s\S]*?)```/gi);
        if (jsxMatch && jsxMatch[0]) {
          const jsxContent = jsxMatch[0].replace(/```(?:jsx|javascript)\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
          files.push({ name: 'App.js', content: jsxContent, type: 'jsx' });
        }
        
        // Extract JS styles
        const jsMatch = generatedText.match(/```(?:javascript|js)\s*\n([\s\S]*?)```/gi);
        if (jsMatch && jsMatch.length > 1) {
          const stylesContent = jsMatch[1].replace(/```(?:javascript|js)\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
          files.push({ name: 'styles.js', content: stylesContent, type: 'js' });
        }
      } else {
        // Extract web code blocks (existing logic)
        const result = { html: '', css: '', js: '' };
        
        const htmlMatch = generatedText.match(/```html\s*\n([\s\S]*?)```/gi);
        if (htmlMatch && htmlMatch[0]) {
          result.html = htmlMatch[0].replace(/```html\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
        }
        
        const cssMatch = generatedText.match(/```css\s*\n([\s\S]*?)```/gi);
        if (cssMatch && cssMatch[0]) {
          result.css = cssMatch[0].replace(/```css\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
        }
        
        const jsMatch = generatedText.match(/```(?:javascript|js)\s*\n([\s\S]*?)```/gi);
        if (jsMatch && jsMatch[0]) {
          result.js = jsMatch[0].replace(/```(?:javascript|js)\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
        }
        
        if (result.html) files.push({ name: 'index.html', content: result.html, type: 'html' });
        if (result.css) files.push({ name: 'style.css', content: result.css, type: 'css' });
        if (result.js) files.push({ name: 'script.js', content: result.js, type: 'js' });
      }
    }

    // If still no files, throw error to try fallback
    if (files.length === 0) {
      throw new Error('No valid files generated by Gemini');
    }

    console.log('🎉 Successfully parsed files:', files.map(f => f.name));

    return {
      message: responseMessage,
      files: files
    };

  } catch (error) {
    console.error('❌ Gemini failed:', error.message);
    
    // Try DeepSeek as fallback
    console.log('🤖 Trying DeepSeek as fallback...');
    try {
      const deepseekResult = await generateWithDeepSeek(prompt, projectType, conversationHistory, existingFiles, developmentMode);
      return deepseekResult;
    } catch (deepseekError) {
      console.error('❌ DeepSeek fallback also failed:', deepseekError.message);
      
      // Final fallback to template system
      console.log('🔧 Both AI services failed, using template system');
      const fallbackFiles = generateAdvancedTemplateFiles(prompt, projectType, developmentMode);
      return {
        message: `## 🔧 Generated with Advanced Template

I've created a beautiful ${projectType} project based on your request: "${prompt}"

*Note: Both AI services experienced issues, so I used our advanced template system.*

## 📁 Generated Files
${fallbackFiles.map(f => `- **${f.name}** (${f.content.length} characters)`).join('\n')}

## 🚀 Ready to Customize
Your project is now live! Continue chatting to add more features or modify the design.`,
        files: fallbackFiles
      };
    }
  }
};

// DeepSeek API fallback function
async function generateWithDeepSeek(
  prompt: string,
  projectType: 'website' | 'mobile' | 'fullstack',
  conversationHistory: ConversationMessage[] = [],
  existingFiles: { name: string; content: string; type: string }[] = [],
  developmentMode: 'web' | 'mobile' = 'web'
): Promise<AIResponse> {
  console.log('🤖 Starting DeepSeek generation...');
  
  // Build conversation context (same as Gemini)
  const conversationContext = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}\n`
    : '';

  // Build existing files context (same as Gemini)
  const existingFilesContext = existingFiles.length > 0 
    ? `\nEXISTING FILES:\n${existingFiles.map(file => `FILE: ${file.name}\n${file.content}\n---\n`).join('')}`
    : '';

  const systemPrompt = `You are an expert ${developmentMode === 'mobile' ? 'React Native' : 'web'} developer and designer. You can create complete ${developmentMode === 'mobile' ? 'mobile apps' : 'websites'} with multiple ${developmentMode === 'mobile' ? 'screens' : 'pages'}, modify existing code, and create specific files as requested.

${conversationContext}${existingFilesContext}

${developmentMode === 'mobile' ? 'FRAMEWORK: React Native' : 'FRAMEWORK: vanilla'}

RESPONSE FORMAT:
You must respond ONLY with valid JSON in this exact format:
{
  "message": "Brief description of what you created/modified",
  "files": [
    {
      "name": "${developmentMode === 'mobile' ? 'App.js' : 'index.html'}",
      "content": "complete code",
      "type": "${developmentMode === 'mobile' ? 'jsx' : 'html'}"
    }
  ]
}

IMPORTANT: 
- Always include the "message" field explaining what you did
- Include ALL necessary files even if some weren't modified
- ${developmentMode === 'mobile' ? 'Use React Native components and StyleSheet.create' : 'Each HTML file should be a COMPLETE document that can run standalone'}

USER REQUEST: ${prompt}`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content || '';

  if (!generatedText || generatedText.trim().length === 0) {
    throw new Error('DeepSeek returned empty response');
  }

  console.log('✅ DeepSeek response received, length:', generatedText.length);

  // Parse JSON response (same logic as Gemini)
  const files: AIResponse['files'] = [];
  let responseMessage = `Generated ${projectType} project using DeepSeek AI.`;
  
  try {
    // Clean the text first - more aggressive cleaning
    let cleanText = generatedText.trim();
    
    // Remove markdown code block markers if present
    cleanText = cleanText.replace(/^```json\s*|\s*```$/g, '');
    cleanText = cleanText.replace(/^```\s*|\s*```$/g, '');
    
    // Find the JSON object more carefully
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonText = cleanText.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonText);
      
      // Check for new format (with message and files array)
      if (parsed.files && Array.isArray(parsed.files)) {
        responseMessage = parsed.message || responseMessage;
        
        parsed.files.forEach((file: any) => {
          if (file.name && file.content && file.type) {
            files.push({
              name: file.name,
              content: file.content,
              type: file.type as 'html' | 'css' | 'js' | 'json' | 'jsx' | 'tsx' | 'ts'
            });
          }
        });
      }
    }
    
    if (files.length === 0) {
      throw new Error('No valid files found in DeepSeek response');
    }
    
    console.log('✅ DeepSeek files parsed successfully:', files.map(f => f.name));
    
    return {
      message: responseMessage,
      files: files
    };

  } catch (parseError) {
    console.error('❌ Failed to parse DeepSeek response:', parseError);
    throw new Error('Failed to parse DeepSeek AI response');
  }
}

// Advanced template fallback system
function generateAdvancedTemplateFiles(prompt: string, projectType: string, developmentMode: 'web' | 'mobile' = 'web') {
  if (developmentMode === 'mobile') {
    // React Native templates
    return [
      {
        name: 'App.js',
        content: `import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to React Native</Text>
          <Text style={styles.subtitle}>Built with Enigma AI</Text>
          <Text style={styles.description}>
            Template based on: "${prompt}"
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Interactive Counter</Text>
            <Text style={styles.counterText}>{count}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCount(count + 1)}
            >
              <Text style={styles.buttonText}>Tap to Count</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your ${projectType}</Text>
            <Text style={styles.cardText}>
              Continue chatting with AI to customize your mobile app further!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});`,
        type: 'jsx' as const
      }
    ];
  } else {
    // Web templates (existing)
    return [
      {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt} - Template</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <h1>Template Project</h1>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <h2>Welcome to Your ${projectType}</h2>
            <p>This is a template generated based on: "${prompt}"</p>
            <button class="cta-button">Get Started</button>
        </section>
    </main>
    
    <script src="script.js"></script>
</body>
</html>`,
        type: 'html' as const
      },
      {
        name: 'style.css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

header {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

nav h1 {
    color: white;
    text-align: center;
}

main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.hero {
    text-align: center;
    color: white;
    padding: 4rem 2rem;
}

.hero h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

@media (max-width: 768px) {
    .hero h2 {
        font-size: 2rem;
    }
    
    .hero {
        padding: 2rem 1rem;
    }
}`,
        type: 'css' as const
      },
      {
        name: 'script.js',
        content: `// Template JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Template project loaded successfully!');
    
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', function() {
        alert('Welcome to your template project! Continue chatting to customize it further.');
    });
    
    // Add some interactive elements
    ctaButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-2px)';
    });
    
    ctaButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
});`,
        type: 'js' as const
      }
    ];
  }
}
