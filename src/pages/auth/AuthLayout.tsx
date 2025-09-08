import { Link } from "react-router-dom";
import authBg from "@/assets/auth-bg.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex overflow-hidden bg-[hsl(215,16%,97%)]">
      {/* Left Side - Premium 4K Quality Branding Section */}
      <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen overflow-hidden">
        {/* Sophisticated Background Pattern */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        <div className="absolute inset-0 bg-[hsl(215,84%,16%)] transition-all duration-1000 ease-out"></div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Premium Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white w-full h-full">
          <div className="max-w-xl animate-fade-in-up">
            {/* Clean Logo Section */}
            <div className="mb-8 animate-fade-in-up-delayed-1">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src="/src/assets/EduSyncNewDark.png" 
                  alt="EduSync Logo" 
                  className="h-16 w-auto drop-shadow-lg"
                />
              </div>
            </div>
            
            {/* Sophisticated Tagline */}
            <p className="text-xl text-white/95 mb-10 leading-relaxed max-w-lg mx-auto font-light tracking-wide animate-fade-in-up-delayed-3">
              Empowering education through seamless collaboration and resource sharing
            </p>
            
            {/* Premium Feature Cards */}
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="bg-white/15 backdrop-blur-md rounded-lg p-6 border border-white/25 hover:bg-white/20 hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-out transform animate-fade-in-up-delayed-4 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center hover:bg-white/35 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Connect Communities</h3>
                    <p className="text-white/90 text-sm">Bridge students and faculty seamlessly</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-lg p-6 border border-white/25 hover:bg-white/20 hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-out transform animate-fade-in-up-delayed-5 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center hover:bg-white/35 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Resource Sharing</h3>
                    <p className="text-white/90 text-sm">Effortless educational content distribution</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-lg p-6 border border-white/25 hover:bg-white/20 hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-out transform animate-fade-in-up-delayed-6 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center hover:bg-white/35 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Streamlined Learning</h3>
                    <p className="text-white/90 text-sm">Enhanced educational experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Premium 4K Quality Auth Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto bg-[hsl(0,0%,100%)] min-h-screen transition-all duration-700 ease-out relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20L40 0L20 20L0 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="flex flex-col justify-center min-h-screen px-12 py-16 relative z-10">
          <div className="w-full max-w-lg mx-auto animate-fade-in-right">
            {/* Premium Header */}
            <div className="text-center mb-12 animate-fade-in-right-delayed-1">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-[hsl(215,25%,27%)] leading-tight tracking-tight">{title}</h2>
                <p className="text-[hsl(215,16%,65%)] leading-relaxed text-lg font-light">{subtitle}</p>
              </div>
            </div>

            {/* Premium Form Container */}
            <div className="bg-[hsl(0,0%,100%)] rounded-lg shadow-2xl border border-[hsl(215,16%,90%)] p-10 transform hover:shadow-3xl transition-all duration-500 ease-out animate-fade-in-right-delayed-2 relative overflow-hidden">
              {children}
            </div>

            {/* Premium Footer */}
            <div className="mt-10 text-center animate-fade-in-right-delayed-3">
              <p className="text-sm text-[hsl(215,16%,65%)] font-light">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-[hsl(215,84%,16%)] hover:text-[hsl(215,84%,12%)] font-semibold hover:underline transition-colors duration-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[hsl(215,84%,16%)] hover:text-[hsl(215,84%,12%)] font-semibold hover:underline transition-colors duration-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}