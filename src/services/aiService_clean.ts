interface AIResponse {
  message: string;
  files: {
    name: string;
    content: string;
    type: 'html' | 'css' | 'js' | 'json';
  }[];
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIGenerationContext {
  projectType: 'website' | 'mobile' | 'fullstack';
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
  existingFiles: { name: string; content: string; type: string }[] = []
): Promise<AIResponse> => {
  // Build conversation context
  const conversationContext = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}\n`
    : '';

  // Build existing files context
  const existingFilesContext = existingFiles.length > 0 
    ? `\nEXISTING FILES:\n${existingFiles.map(file => `FILE: ${file.name}\n${file.content}\n---\n`).join('')}`
    : '';

  const systemPrompt = `You are an expert web developer and designer. You can create complete websites with multiple pages, modify existing code, and create specific files as requested.

${conversationContext}${existingFilesContext}

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

REQUIREMENTS:
- Generate complete code according to the selected framework
- Use modern, responsive design principles
- Include proper semantic structure
- Use modern layout techniques (CSS Grid/Flexbox for vanilla, component structure for frameworks)
- Add smooth transitions and hover effects
- Ensure accessibility (ARIA labels, proper contrast, keyboard navigation)
- Include meta tags and SEO optimization
- Make it mobile-responsive
- Include placeholder images using services like Unsplash or Lorem Picsum with proper alt text
- Add subtle animations and interactions appropriate for the framework

MODIFICATION INSTRUCTIONS:
- If existing files are provided, build upon them unless user asks to replace completely
- Preserve existing functionality unless explicitly asked to change it
- When adding new features, integrate them seamlessly with existing code
- If user asks for specific changes to existing files, modify only what's requested

DESIGN GUIDELINES:
- Use modern color schemes and typography
- Implement proper spacing and visual hierarchy
- Include call-to-action buttons with hover effects
- Add a navigation menu if appropriate
- Use CSS custom properties for theming
- Implement smooth scrolling and section transitions

OUTPUT FORMAT:
Return your response in this exact JSON format with a message explaining what you created/modified:
{
  "message": "Explanation of what was created or modified",
  "files": [
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
  ]
}

IMPORTANT: 
- Always include the "message" field explaining what you did
- Include ALL necessary files (HTML, CSS, JS) even if some weren't modified
- When creating multiple pages, name them appropriately (about.html, contact.html, etc.)
- Each HTML file should be a COMPLETE document that can run standalone
- Link CSS and JS files properly in HTML using relative paths

USER REQUEST: ${prompt}

MULTI-FILE EXAMPLES:
- If user asks for "create an about page", create about.html with full HTML structure
- If user asks for "add a contact form", create contact.html with form functionality
- If user asks for "create a portfolio section", create portfolio.html or add to existing pages
- If user asks for "separate the CSS", create additional CSS files like components.css, animations.css
- If user asks for "add JavaScript for", create specific JS files like animations.js, contact.js
- Always ensure all files are properly linked in the HTML files`;

  try {
    console.log('🤖 Starting AI generation with Gemini...');
    
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
      // Clean the text first
      let cleanText = generatedText.trim();
      
      // Remove markdown code block markers if present
      cleanText = cleanText.replace(/^```json\s*|\s*```$/g, '');
      cleanText = cleanText.replace(/^```\s*|\s*```$/g, '');
      
      // Try to find and parse JSON
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Check for new format (with message and files array)
        if (parsed.files && Array.isArray(parsed.files)) {
          responseMessage = parsed.message || responseMessage;
          for (const file of parsed.files) {
            if (file.name && file.content && file.type) {
              files.push({
                name: file.name,
                content: file.content,
                type: file.type as 'html' | 'css' | 'js' | 'json'
              });
            }
          }
          console.log('🎉 Successfully parsed new format JSON response:', files.map(f => f.name));
        }
        // Check for old format (direct html, css, js properties) 
        else if (parsed.html || parsed.css || parsed.js) {
          if (parsed.html) {
            files.push({
              name: 'index.html',
              content: parsed.html,
              type: 'html'
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
              name: 'script.js',
              content: parsed.js,
              type: 'js'
            });
          }
          
          console.log('🎉 Successfully parsed old format JSON response:', files.map(f => f.name));
        }
      }
    } catch (jsonError) {
      console.warn('JSON parsing failed, trying code block extraction:', jsonError);
      // Fallback: extract code blocks like the working version does
      const result = { html: '', css: '', js: '' };
      
      // Extract HTML
      const htmlMatch = generatedText.match(/```html\s*\n([\s\S]*?)```/gi);
      if (htmlMatch && htmlMatch[0]) {
        result.html = htmlMatch[0].replace(/```html\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
      }
      
      // Extract CSS
      const cssMatch = generatedText.match(/```css\s*\n([\s\S]*?)```/gi);
      if (cssMatch && cssMatch[0]) {
        result.css = cssMatch[0].replace(/```css\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
      }
      
      // Extract JS
      const jsMatch = generatedText.match(/```(?:javascript|js)\s*\n([\s\S]*?)```/gi);
      if (jsMatch && jsMatch[0]) {
        result.js = jsMatch[0].replace(/```(?:javascript|js)\s*\n?/gi, '').replace(/```\s*$/gi, '').trim();
      }
      
      // Add fallback files
      if (result.html) files.push({ name: 'index.html', content: result.html, type: 'html' });
      if (result.css) files.push({ name: 'style.css', content: result.css, type: 'css' });
      if (result.js) files.push({ name: 'script.js', content: result.js, type: 'js' });
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
      const deepseekResult = await generateWithDeepSeek(prompt, projectType, conversationHistory, existingFiles);
      return deepseekResult;
    } catch (deepseekError) {
      console.error('❌ DeepSeek fallback also failed:', deepseekError.message);
      
      // Final fallback to template system
      console.log('🔧 Both AI services failed, using template system');
      const fallbackFiles = generateAdvancedTemplateFiles(prompt, projectType);
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
  existingFiles: { name: string; content: string; type: string }[] = []
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

  const systemPrompt = `You are an expert web developer and designer. You can create complete websites with multiple pages, modify existing code, and create specific files as requested.

${conversationContext}${existingFilesContext}

FRAMEWORK: vanilla
VANILLA HTML/CSS/JS INSTRUCTIONS:
- Use semantic HTML5 elements
- Modern CSS with custom properties and modern layout
- Clean, modular JavaScript with ES6+ features

RESPONSE FORMAT:
You must respond ONLY with valid JSON in this exact format:
{
  "message": "Brief description of what you created/modified",
  "files": [
    {
      "name": "index.html",
      "content": "complete HTML code",
      "type": "html"
    },
    {
      "name": "style.css", 
      "content": "complete CSS code",
      "type": "css"
    },
    {
      "name": "script.js",
      "content": "complete JavaScript code with all interactive functionality", 
      "type": "js"
    }
  ]
}

IMPORTANT: 
- Always include the "message" field explaining what you did
- Include ALL necessary files (HTML, CSS, JS) even if some weren't modified
- When creating multiple pages, name them appropriately (about.html, contact.html, etc.)
- Each HTML file should be a COMPLETE document that can run standalone
- Link CSS and JS files properly in HTML using relative paths

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
    // Clean the text first
    let cleanText = generatedText.trim();
    
    // Remove markdown code block markers if present
    cleanText = cleanText.replace(/^```json\s*|\s*```$/g, '');
    cleanText = cleanText.replace(/^```\s*|\s*```$/g, '');
    
    // Try to find and parse JSON
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Check for new format (with message and files array)
      if (parsed.files && Array.isArray(parsed.files)) {
        responseMessage = parsed.message || responseMessage;
        
        parsed.files.forEach((file: any) => {
          if (file.name && file.content && file.type) {
            files.push({
              name: file.name,
              content: file.content,
              type: file.type as 'html' | 'css' | 'js' | 'json'
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
      message: `## 🤖 Generated with DeepSeek AI

${responseMessage}

## 📁 Generated Files
${files.map(f => `- **${f.name}** (${f.content.length} characters)`).join('\n')}`,
      files: files
    };

  } catch (parseError) {
    console.error('❌ Failed to parse DeepSeek response:', parseError);
    throw new Error('Failed to parse DeepSeek AI response');
  }
}

// Advanced template fallback system
function generateAdvancedTemplateFiles(prompt: string, projectType: string) {
  const files = [
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
  
  return files;
}
