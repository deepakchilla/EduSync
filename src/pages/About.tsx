import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Chilaka from "../assets/Chilaka.jpg";
import Rafi from "../assets/Rafi.jpg";
import Pranav from "../assets/Pranav.jpg";
import Abhiram from "../assets/Abhiram.jpg";
import Aravind from "../assets/Aravind.jpg";
import Deepak from "../assets/Deepak.jpg";
import { 
  Users, 
  BookOpen, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Code,
  Database,
  Server,
  Lock,
  Star,
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  Rocket
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header isAuthenticated={false} />
      
      {/* Hero Section - Professional Introduction */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Professional Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center" 
            alt="Professional Education Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-7xl font-bold text-white mb-8 leading-tight">
                EduSync
              <span className="block text-5xl text-slate-200 font-light mt-4">
                Revolutionizing Education Through Technology
              </span>
            </h1>
            <p className="text-2xl text-slate-200 max-w-4xl mx-auto mb-12 leading-relaxed">
              EduSync is a comprehensive educational platform that connects educators and students 
              through seamless resource sharing, collaborative learning, and efficient academic management.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 text-xl px-10 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300">
                Explore Platform
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-xl px-10 py-4 rounded-lg font-semibold transition-all duration-300">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Statistics - Impressive Numbers */}
      {/* What is EduSync? */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What is EduSync?</h2>
            <p className="text-xl text-slate-300">A modern educational platform designed for academic excellence</p>
        </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">2</div>
              <div className="text-slate-300">User Types</div>
              <div className="text-sm text-slate-400 mt-1">Students & Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">∞</div>
              <div className="text-slate-300">Resource Sharing</div>
              <div className="text-sm text-slate-400 mt-1">Unlimited Uploads</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-300">Accessibility</div>
              <div className="text-sm text-slate-400 mt-1">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-300">Secure</div>
              <div className="text-sm text-slate-400 mt-1">Data Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">About EduSync Platform</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to know about our educational platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-blue-600" />
                      </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">What is EduSync?</h3>
                    <p className="text-slate-600">
                      EduSync is a comprehensive educational platform that bridges the gap between 
                      educators and students through seamless resource sharing and collaborative learning.
                      </p>
                    </div>
                  </div>
                  
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">What is the Goal?</h3>
                    <p className="text-slate-600">
                      To revolutionize education by providing a centralized platform where faculty can 
                      easily share resources and students can access learning materials efficiently.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-purple-600" />
        </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">What Does It Offer?</h3>
                    <p className="text-slate-600">
                      Resource management, file sharing, user authentication, role-based access control, 
                      and a modern, responsive interface for both students and faculty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">How is EduSync Helpful?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-slate-900">For Students</div>
                    <div className="text-sm text-slate-600">Easy access to learning materials, organized resource browsing, and seamless download experience</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-slate-900">For Faculty</div>
                    <div className="text-sm text-slate-600">Simple resource upload, file management, and organized content distribution to students</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-slate-900">For Institutions</div>
                    <div className="text-sm text-slate-600">Centralized resource management, secure data handling, and scalable educational infrastructure</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Development Team</h4>
                <p className="text-slate-600 text-sm">
                  Developed by a team of 6 passionate developers committed to creating 
                  innovative educational solutions that enhance learning experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features - Professional Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Core Features & Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive functionality designed for educational excellence
            </p>
          </div>

          <div className="space-y-24">
            {/* Feature 1: Role-Based Access Control */}
          <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center" 
                    alt="Role-Based Access Control"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Role-Based Access Control</h3>
                      </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Separate interfaces for students and faculty with appropriate permissions and features. 
                    Our system ensures that each user type has access to the right tools and resources.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Student Dashboard with Resource Browsing</span>
                        </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Faculty Upload and Management Tools</span>
                      </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Secure Authentication System</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 2: Resource Management */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center" 
                    alt="Resource Management"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
          </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-white" />
        </div>
                    <h3 className="text-3xl font-bold text-slate-900">Resource Management</h3>
        </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Comprehensive file handling with support for multiple formats and sizes. 
                    Organize, preview, and manage educational resources efficiently.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Multi-Format Support (PDF, Images, Documents)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">File Preview and Download</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Smart Organization and Categorization</span>
          </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Data Management */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center" 
                    alt="Data Management"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Data Management</h3>
                  </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Robust database design with proper relationships and data integrity. 
                    Built for scalability and reliability with enterprise-grade architecture.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Normalized Database Schema</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Foreign Key Relationships</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Data Validation and Constraints</span>
                    </div>
          </div>
        </div>
        </div>
          </div>

            {/* Feature 4: Responsive Design */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center" 
                    alt="Responsive Design"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Responsive Design</h3>
                  </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Mobile-first approach with seamless experience across all devices. 
                    Optimized for performance and accessibility on any screen size.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Mobile-Optimized Interface</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Touch-Friendly Interactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Cross-Browser Compatibility</span>
                    </div>
                  </div>
                </div>
                    </div>
                  </div>

            {/* Feature 5: Security & Privacy */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center" 
                    alt="Security & Privacy"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Security & Privacy</h3>
                  </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Enterprise-grade security measures to protect user data and content. 
                    Your privacy and security are our top priorities.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">JWT Token Authentication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Input Sanitization and Validation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Secure File Storage</span>
                    </div>
                  </div>
                </div>
              </div>
                  </div>

            {/* Feature 6: Modern Development */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="flex-shrink-0 lg:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=center" 
                    alt="Modern Development"
                    className="w-full h-80 object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="flex-1 lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Modern Development</h3>
                  </div>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Built with latest tools and practices for maintainable, scalable code. 
                    Following industry best practices and modern development standards.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Component-Based Architecture</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Type Safety with TypeScript</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Clean Code Principles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Development Process</h2>
            <p className="text-xl text-slate-600">
              Systematic approach to building a production-ready application
            </p>
        </div>
        
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Planning</h3>
              <p className="text-slate-600">Requirements analysis, database design, and architecture planning</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Development</h3>
              <p className="text-slate-600">Full-stack implementation with modern technologies and best practices</p>
            </div>

              <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Testing</h3>
              <p className="text-slate-600">Comprehensive testing including security, performance, and usability</p>
              </div>
            
              <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Deployment</h3>
              <p className="text-slate-600">Production-ready deployment with monitoring and maintenance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Credits */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Development Team</h2>
            <p className="text-xl text-slate-300">
              Passionate developers committed to educational excellence
            </p>
        </div>
        
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src={Deepak} width={200}
                  alt="Alex Smith"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Deepak Chilla</h3>
              <p className="text-slate-300 mb-4">Full-Stack Developer & Team Lead</p>
              <p className="text-slate-400 text-sm mb-4">
                Responsible for overall system design, backend development, 
                database architecture, and deployment strategies.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">React</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Spring Boot</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">MySQL</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src={Chilaka} width={200} 
                  alt="Deepak"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Madhur Chilaka</h3>
              <p className="text-slate-300 mb-4">Frontend Specialist & UI/UX Expert</p>
              <p className="text-slate-400 text-sm mb-4">
                Focused on creating intuitive user interfaces, responsive design, 
                and seamless user experience across all devices.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">TypeScript</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Tailwind</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Shadcn</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src={Abhiram} width={100} 
                  alt="Michael Rodriguez"
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Abhiram Chettupalli</h3>
              <p className="text-slate-300 mb-4"></p>
              <p className="text-slate-400 text-sm mb-4">
                Specialized in RESTful API development, database optimization, 
                security implementation, and server-side logic.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Java</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">JPA</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Security</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src={Rafi} width={200} 
                  alt="David Kim"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Dudekula Rafi</h3>
              <p className="text-slate-300 mb-4">DevOps Engineer & System Administrator</p>
              <p className="text-slate-400 text-sm mb-4">
                Specialized in deployment automation, server management, 
                and ensuring optimal performance and reliability.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Docker</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">AWS</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">CI/CD</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src={Pranav} width={200}
                  alt="Emma Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Pranav Doppalapudi</h3>
              <p className="text-slate-300 mb-4">Quality Assurance & Testing Specialist</p>
              <p className="text-slate-400 text-sm mb-4">
                Focused on ensuring code quality, comprehensive testing, 
                and maintaining high standards throughout the development process.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Testing</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Quality</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Automation</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-slate-600">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                  alt="James Wilson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Annavarapu Aravind</h3>
              <p className="text-slate-300 mb-4">Project Manager & Technical Lead</p>
              <p className="text-slate-400 text-sm mb-4">
                Responsible for project coordination, timeline management, 
                and ensuring seamless collaboration across the development team.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Management</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Coordination</Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">Leadership</Badge>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="mt-16 pt-16 border-t border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">6</div>
                <div className="text-slate-400">Core Developers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">6+</div>
                <div className="text-slate-400">Months Development</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-slate-400">Lines of Code</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-slate-400">Dedication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Experience EduSync?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join the future of educational technology with a platform built for excellence, 
            security, and user experience.
          </p>
          <div className="flex justify-center gap-6">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 text-lg rounded-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-700 px-10 py-4 text-lg rounded-lg">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}