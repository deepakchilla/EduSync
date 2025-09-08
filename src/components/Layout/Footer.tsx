import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1a2a] text-white border-t border-white/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/src/assets/EduSyncNewDark.png" 
                alt="EduSync Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/90 max-w-xs leading-relaxed text-sm">
              Modern educational platform connecting students and faculty through seamless resource sharing.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg relative">
              <span>Platform</span>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/resources" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link 
                  to="/auth/register?role=student" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Student Portal
                </Link>
              </li>
              <li>
                <Link 
                  to="/auth/register?role=faculty" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Faculty Portal
                </Link>
              </li>
              <li>
                <Link 
                  to="/help" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg relative">
              <span>Company</span>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg relative">
              <span>Contact</span>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-white/80 group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">hello@edusync.edu</span>
              </li>
              <li className="flex items-center space-x-3 text-white/80 group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-white/80 group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">Educational Campus, Learning City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © {currentYear} EduSync. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-8">
            <Link 
              to="/privacy" 
              className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}