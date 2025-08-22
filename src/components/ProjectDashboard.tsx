import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { GlowCard } from './ui/glow-card'
import { ParticlesBackground } from './ui/particles-background'
import { Badge } from './ui/badge'
import { Crown } from 'lucide-react'
import type { Project } from '@/pages/Index'

interface ProjectDashboardProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
  onNewProject: (type: 'website' | 'mobile' | 'fullstack') => void
}

export function ProjectDashboard({ projects, onOpenProject, onNewProject }: ProjectDashboardProps) {
  const [typedText, setTypedText] = useState('')
  const [mockChatMessages, setMockChatMessages] = useState([
    { role: 'user', content: 'Create a modern portfolio website' },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [currentDesign, setCurrentDesign] = useState(0)
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const fullText = 'Create stunning websites with AI magic...'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setTypedText('')
          i = 0
        }, 2000)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true)
      setTimeout(() => {
        setMockChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Creating your portfolio with modern design, responsive layout, and smooth animations...' }
        ])
        setIsTyping(false)
      }, 1000)
      
      setTimeout(() => {
        setMockChatMessages([{ role: 'user', content: 'Create a modern portfolio website' }])
      }, 4000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Cycle through different website designs and preview modes
  useEffect(() => {
    const designInterval = setInterval(() => {
      setCurrentDesign(prev => (prev + 1) % designVariations.length)
      setShowMobilePreview(prev => !prev) // Alternate between web and mobile
    }, 4000)

    return () => clearInterval(designInterval)
  }, [])

  const features = [
    {
      icon: "🎨",
      title: "AI-Powered Design",
      description: "Generate beautiful websites and mobile apps using cutting-edge AI technology"
    },
    {
      icon: "📱",
      title: "Web & Mobile",
      description: "Create responsive websites and React Native mobile apps from a single description"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Build and export your projects in minutes, not hours or days"
    }
  ]

  const stats = [
    { label: "Projects Created", value: "100+" },
    { label: "Happy Developers", value: "25+" },
    { label: "Code Lines Written", value: "50K+" },
    { label: "Time Saved", value: "500+ hrs" }
  ]

  const designVariations = [
    {
      name: "Modern Portfolio",
      colors: ["from-orange-500/40", "from-orange-500/30", "from-yellow-500/30"],
      elements: {
        header: "w-28 h-4",
        subheader: "w-20 h-3", 
        bars: ["w-full h-6", "w-4/5 h-4", "w-3/5 h-4"],
        cards: ["from-orange-500/30 to-yellow-500/30", "from-yellow-500/30 to-red-500/30"]
      }
    },
    {
      name: "E-commerce Store", 
      colors: ["from-red-500/40", "from-red-500/30", "from-orange-500/30"],
      elements: {
        header: "w-32 h-4",
        subheader: "w-24 h-3",
        bars: ["w-full h-6", "w-3/4 h-4", "w-1/2 h-4"],
        cards: ["from-red-500/30 to-orange-500/30", "from-orange-500/30 to-yellow-500/30"]
      }
    },
    {
      name: "SaaS Dashboard",
      colors: ["from-yellow-500/40", "from-yellow-500/30", "from-red-500/30"], 
      elements: {
        header: "w-24 h-4",
        subheader: "w-16 h-3",
        bars: ["w-full h-6", "w-5/6 h-4", "w-2/3 h-4"],
        cards: ["from-yellow-500/30 to-red-500/30", "from-red-500/30 to-orange-500/30"]
      }
    }
  ]

  const exampleProjects = [
    {
      title: "Modern Portfolio",
      description: "Clean, professional portfolio with smooth animations",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tags: ["React", "TypeScript", "Tailwind"]
    },
    {
      title: "E-commerce Store",
      description: "Full-featured online store with payment integration",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tags: ["Next.js", "Stripe", "Database"]
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics dashboard with real-time data visualization",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      tags: ["Vue.js", "Charts", "API"]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Decorative Elements Above Header */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-40">
        {/* Top decorative lines */}
        <div className="relative h-2">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"></div>
          <div className="absolute top-1 left-0 w-3/4 h-0.5 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-40"></div>
          <div className="absolute top-1 right-0 w-1/2 h-0.5 bg-gradient-to-l from-red-500 to-orange-500 opacity-40"></div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-2 right-2 w-16 h-0.5 bg-gradient-to-l from-orange-500 to-transparent"></div>
          <div className="absolute top-4 right-4 w-12 h-0.5 bg-gradient-to-l from-red-500 to-transparent opacity-70"></div>
          <div className="absolute top-2 right-2 w-0.5 h-16 bg-gradient-to-b from-orange-500 to-transparent"></div>
          <div className="absolute top-4 right-4 w-0.5 h-12 bg-gradient-to-b from-red-500 to-transparent opacity-70"></div>
        </div>
        
        {/* Floating accent dots */}
        <div className="absolute top-6 left-1/4">
          <div className="w-2 h-2 bg-orange-500 rounded-full opacity-60 animate-pulse"></div>
        </div>
        <div className="absolute top-4 right-1/3">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        <div className="absolute top-8 left-1/3">
          <div className="w-1 h-1 bg-red-500 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute top-3 right-1/4">
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-8 bg-gradient-to-b from-orange-500/10 to-transparent blur-sm"></div>
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {/* Logo Placeholder */}
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
              ENIGMA
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm font-medium"
            >
              Preview
            </button>
            <button 
              onClick={() => onNewProject('website')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              Start Building
            </button>
          </nav>
        </div>
      </header>
      

      {/* Main Hero Section - Left: Text, Right: Interactive Components */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center overflow-hidden pt-16">
        {/* Falling Crowns - Only in Hero Section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Crown animations with different delays and positions */}
          <div className="absolute top-0 left-[10%] animate-fall-slow opacity-20" style={{animationDelay: '0s', animationDuration: '8s'}}>
            <Crown className="w-12 h-12 text-orange-400" />
          </div>
          <div className="absolute top-0 left-[25%] animate-fall-slow opacity-15" style={{animationDelay: '2s', animationDuration: '10s'}}>
            <Crown className="w-10 h-10 text-yellow-500" />
          </div>
          <div className="absolute top-0 left-[45%] animate-fall-slow opacity-25" style={{animationDelay: '4s', animationDuration: '12s'}}>
            <Crown className="w-14 h-14 text-orange-500" />
          </div>
          <div className="absolute top-0 left-[60%] animate-fall-slow opacity-18" style={{animationDelay: '6s', animationDuration: '9s'}}>
            <Crown className="w-11 h-11 text-red-400" />
          </div>
          <div className="absolute top-0 left-[75%] animate-fall-slow opacity-12" style={{animationDelay: '8s', animationDuration: '11s'}}>
            <Crown className="w-9 h-9 text-yellow-400" />
          </div>
          <div className="absolute top-0 left-[85%] animate-fall-slow opacity-22" style={{animationDelay: '1s', animationDuration: '8s'}}>
            <Crown className="w-12 h-12 text-orange-600" />
          </div>
          <div className="absolute top-0 left-[35%] animate-fall-slow opacity-16" style={{animationDelay: '3s', animationDuration: '13s'}}>
            <Crown className="w-8 h-8 text-red-500" />
          </div>
          <div className="absolute top-0 left-[95%] animate-fall-slow opacity-20" style={{animationDelay: '5s', animationDuration: '7s'}}>
            <Crown className="w-12 h-12 text-orange-300" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-lg px-4 py-2">
                ✨ Powered by Gemini and Deepseek
              </Badge>
              
              <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent leading-tight">
                ENIGMA
              </h1>
              
              <p className="text-2xl text-gray-400 leading-relaxed max-w-xl">
                Transform your ideas into stunning websites and mobile apps with the power of AI. 
                No coding experience required - just describe what you want and watch it come to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNewProject('website')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 h-16"
                >
                  Start Building Now 🚀
                </Button>
            
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">100+</div>
                  <div className="text-gray-400 text-sm">Projects Built</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">~30s</div>
                  <div className="text-gray-400 text-sm">Avg Generation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">100%</div>
                  <div className="text-gray-400 text-sm">Your Code</div>
                </div>
              </div>
            </div>

            {/* Right Side - Big Interactive Card */}
            <div className="relative">
              {/* Horizontal decorative lines above component */}
              <div className="absolute -top-6 left-0 right-0 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-2"></div>
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-60 mx-auto"></div>
              </div>
              
              {/* Single Large Card Mimicking Generation Layout */}
              <GlowCard 
                className="w-full aspect-video bg-gray-900/80 backdrop-blur-lg border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 cursor-pointer group transform hover:scale-[1.02]"
                onClick={() => onNewProject('website')}
              >
                <div className="h-full flex">
                  {/* Left Side - Interactive Chat */}
                  <div className="w-2/5 p-4 border-r border-orange-500/20 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💬</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-orange-400">Enigma AI</h3>
                        <p className="text-gray-400 text-xs">Real-time conversation</p>
                      </div>
                    </div>
                    
                    {/* Mock chat messages */}
                    <div className="space-y-3 flex-1 overflow-hidden">
                      <div className="flex justify-end">
                        <div className="bg-orange-600 text-white p-2 rounded-lg text-xs max-w-[200px]">
                          {showMobilePreview 
                            ? 'Create a React Native fitness tracking app' 
                            : 'Create a modern portfolio website with animations'
                          }
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-300 p-2 rounded-lg text-xs max-w-[200px]">
                          {showMobilePreview 
                            ? 'Perfect! I\'ll create a fitness app with workout tracking, progress charts, and notifications. Building React Native components now...'
                            : 'Perfect! I\'ll create a sleek portfolio with responsive design, smooth animations, and contact form. Starting now...'
                          }
                        </div>
                      </div>
                      
                    </div>
                    
                    {/* Mock input */}
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 bg-gray-800 rounded-lg px-2 py-1.5 text-xs text-gray-400 border border-orange-500/20">
                        Describe your website or app idea...
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Alternating Preview */}
                  <div className="w-3/5 p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{showMobilePreview ? '📱' : '🎨'}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-orange-400">
                          {showMobilePreview ? 'Mobile Preview' : 'Website Preview'}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {showMobilePreview ? 'React Native app' : 'Real-time generation'}
                        </p>
                      </div>
                    </div>
                    
                    {showMobilePreview ? (
                      /* Phone frame container */
                      <div className="flex-1 flex justify-center items-center">
                        {/* Phone frame */}
                        <div className="relative">
                          {/* Phone outline */}
                          <div className="w-40 h-72 bg-gray-800 rounded-3xl p-2 shadow-2xl border border-gray-600">
                            {/* Screen */}
                            <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden relative">
                              {/* Status bar */}
                              <div className="flex justify-between items-center px-3 py-1 bg-gray-800">
                                <div className="text-white text-xs">9:41</div>
                                <div className="flex gap-1">
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                </div>
                              </div>
                              
                              {/* App content */}
                              <div className="p-3 space-y-3">
                                {/* Header */}
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                                  <div>
                                    <div className="w-16 h-2 bg-gray-700 rounded mb-1"></div>
                                    <div className="w-12 h-1.5 bg-gray-800 rounded"></div>
                                  </div>
                                </div>
                                
                                {/* Stats cards */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-2">
                                    <div className="w-8 h-1.5 bg-orange-400 rounded mb-1"></div>
                                    <div className="w-6 h-1 bg-gray-600 rounded"></div>
                                  </div>
                                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-2">
                                    <div className="w-8 h-1.5 bg-blue-400 rounded mb-1"></div>
                                    <div className="w-6 h-1 bg-gray-600 rounded"></div>
                                  </div>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="bg-gray-800 rounded-full h-2">
                                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-2/3"></div>
                                </div>
                                
                                {/* List items */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="w-16 h-1.5 bg-gray-700 rounded"></div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="w-12 h-1.5 bg-gray-700 rounded"></div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <div className="w-14 h-1.5 bg-gray-700 rounded"></div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Home indicator */}
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                                <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Generated indicator */}
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓ Generated
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Mock browser window */
                      <div className="bg-gray-800 rounded-xl flex-1 p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="bg-gray-700 rounded px-2 py-0.5 text-xs ml-auto text-gray-400">
                            Generated in ~30s
                          </div>
                        </div>
                        
                        {/* Cycling website preview */}
                        <div className="bg-gray-700 rounded-lg flex-1 p-3 transition-all duration-1000 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-6 h-6 bg-gradient-to-r ${designVariations[currentDesign].colors[0]} to-yellow-500 rounded-full transition-all duration-1000`}></div>
                            <div>
                              <div className="w-16 h-2 bg-gray-600 rounded mb-1 transition-all duration-1000"></div>
                              <div className="w-12 h-1.5 bg-gray-600 rounded transition-all duration-1000"></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 flex-1">
                            <div className={`w-full bg-gradient-to-r ${designVariations[currentDesign].colors[0]} to-transparent rounded transition-all duration-1000 h-4`}></div>
                            <div className="w-3/4 bg-gray-600 rounded transition-all duration-1000 h-3"></div>
                            <div className="w-1/2 bg-gray-600 rounded transition-all duration-1000 h-3"></div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className={`h-16 bg-gradient-to-br ${designVariations[currentDesign].elements.cards[0]} rounded transition-all duration-1000`}></div>
                              <div className={`h-16 bg-gradient-to-br ${designVariations[currentDesign].elements.cards[1]} rounded transition-all duration-1000`}></div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-1.5 mt-2">
                              <div className={`h-3 bg-gradient-to-r ${designVariations[currentDesign].colors[0]} rounded transition-all duration-1000`}></div>
                              <div className={`h-3 bg-gradient-to-r ${designVariations[currentDesign].colors[1]} rounded transition-all duration-1000`}></div>
                              <div className={`h-3 bg-gradient-to-r ${designVariations[currentDesign].colors[2]} rounded transition-all duration-1000`}></div>
                            </div>
                          </div>
                          
                          {/* Design indicator */}
                          <div className="text-center mt-2">
                            <p className="text-orange-400 text-xs font-semibold transition-all duration-1000">
                              {designVariations[currentDesign].name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlowCard>
              
              {/* Horizontal decorative lines below interactive component */}
              <div className="mt-8 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-2"></div>
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-orange-600 to-red-500 opacity-60 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Why Choose <span className="text-orange-500">Enigma</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of web and mobile app development with our cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Horizontal decorative lines above features */}
            <div className="col-span-full mb-8 pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-2"></div>
              <div className="w-2/3 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 opacity-60 mx-auto"></div>
            </div>
            
            {features.map((feature, index) => (
              <GlowCard 
                key={index} 
                className="p-10 text-center bg-gray-900/30 backdrop-blur-sm border-gray-700 hover:border-orange-500/50 transition-all duration-300 group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-lg">
                  {feature.description}
                </p>
              </GlowCard>
            ))}
            
            {/* Horizontal decorative lines below features components */}
            <div className="col-span-full mt-8 pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-2"></div>
              <div className="w-2/3 h-0.5 bg-gradient-to-r from-red-500 to-yellow-500 opacity-60 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview Section */}
      <section id="preview" className="relative z-10 py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Watch Enigma <span className="text-orange-500">Create Magic</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            See real websites and apps being generated in real-time by Enigma AI
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <GlowCard className="p-8 bg-gray-900/50 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Live Website Preview */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="bg-gray-800 rounded px-4 py-2 text-sm ml-auto">
                      Generated in ~30s
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-6 h-96 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
                      <div>
                        <div className="w-32 h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="w-20 h-3 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="w-full h-6 bg-gradient-to-r from-orange-500/40 to-transparent rounded"></div>
                      <div className="w-4/5 h-4 bg-gray-600 rounded"></div>
                      <div className="w-3/5 h-4 bg-gray-600 rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-24 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-lg"></div>
                      <div className="h-24 bg-gradient-to-br from-yellow-500/30 to-red-500/30 rounded-lg"></div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 h-3 bg-orange-500/20 rounded"></div>
                      <div className="w-16 h-3 bg-orange-500 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Generation Process */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-orange-400 mb-6">Live Generation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Understanding Requirements</p>
                        <p className="text-gray-400 text-sm">AI analyzed your request in 0.1s</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Generating Structure</p>
                        <p className="text-gray-400 text-sm">Created React Native components</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Styling Components</p>
                        <p className="text-gray-400 text-sm">Applied native styles and animations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Adding Interactions</p>
                        <p className="text-gray-400 text-sm">Navigation and state management ready</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-orange-400 font-semibold mb-2">
                      {showMobilePreview ? 'Mobile Apps Include' : 'Full-Featured Websites Include'}
                    </p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      {showMobilePreview ? (
                        <>
                          <li>• Cross-platform React Native code</li>
                          <li>• Native navigation and gestures</li>
                          <li>• Device-optimized layouts</li>
                          <li>• State management setup</li>
                          <li>• Platform-specific components</li>
                          <li>• Expo configuration ready</li>
                          <li>• Production-ready structure</li>
                        </>
                      ) : (
                        <>
                          <li>• Contact forms with validation</li>
                          <li>• Smooth scroll animations</li>
                          <li>• Mobile-responsive layouts</li>
                          <li>• SEO-optimized structure</li>
                          <li>• Interactive components</li>
                          <li>• Modern design patterns</li>
                          <li>• Production-ready code</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-b from-black to-gray-900/50 border-t border-orange-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 ENIGMA. All rights reserved.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Built with</span>
              <div className="flex items-center gap-1">
                <span className="text-red-400 text-sm">❤️</span>
                <span className="text-orange-400 text-sm font-medium">love</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
