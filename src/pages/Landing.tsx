import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import studentsBg from "@/assets/image2.jpg";
import { 
  BookOpen, 
  Upload, 
  Download, 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  UserCheck
} from "lucide-react";

export default function Landing() {
  console.log("Landing component is rendering");
  const features = [
    {
      icon: BookOpen,
      title: "Rich Resource Library",
      description: "Access thousands of educational materials, documents, and study resources organized by subject and difficulty level."
    },
    {
      icon: Upload,
      title: "Easy Content Management",
      description: "Faculty can effortlessly upload, organize, and manage educational content with our intuitive interface."
    },
    {
      icon: Download,
      title: "Instant Access",
      description: "Students can view resources online or download them for offline study. Everything at your fingertips."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect students and faculty in a seamless educational ecosystem designed for modern learning."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your educational content and data are always protected."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for quick access to resources, even with large files and extensive libraries."
    }
  ];

  const stats = [
    { label: "Active Students", value: "10,000+" },
    { label: "Faculty Members", value: "500+" },
    { label: "Resources Shared", value: "25,000+" },
    { label: "Downloads", value: "100,000+" }
  ];

  return (
          <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${studentsBg})` }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Modern Educational{" "}
                <span className="text-white">Resource Platform</span>
              </h1>
              <p className="mt-6 text-xl text-white/90 leading-relaxed">
                Connect students and faculty through seamless resource sharing. 
                Upload, access, and manage educational materials with ease.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth/register?role=student">
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-white/90 w-full sm:w-auto font-semibold transition-all duration-200 hover:shadow-lg">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Join as Student
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/auth/register?role=faculty">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/20 hover:border-white/80 transition-all duration-200">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Join as Faculty
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center space-x-2 text-sm text-white/80 justify-center lg:justify-start">
                <CheckCircle className="h-4 w-4 text-white" />
                <span>Free to join • Instant access • No credit card required</span>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-bounce-in stat-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need for modern education
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              EduSync provides powerful tools for both students and faculty to enhance 
              the learning experience through seamless resource management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="edu-card animate-fade-in border-0 shadow-md feature-card glow-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your educational experience?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students and faculty already using EduSync to enhance learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="edu-button-primary font-semibold transition-all duration-200 hover:shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 hover:border-white/80 transition-all duration-200">
                Explore Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}