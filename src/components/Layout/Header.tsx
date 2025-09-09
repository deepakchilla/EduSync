import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Users,
  Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePictureUrl } from "@/config/api";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: 'student' | 'faculty';
  userName?: string;
  user?: any; // Add user prop for direct user data
}

export function Header({ isAuthenticated = false, userRole, userName, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  // Use auth context data if available, otherwise fall back to props
  const currentUser = authUser || user || { firstName: '', lastName: '', role: 'student' };
  const displayName = authUser ? `${authUser.firstName} ${authUser.lastName}` : 
                     (user ? `${user.firstName} ${user.lastName}` : (userName || 'User'));
  const displayRole = authUser ? authUser.role : (user ? user.role : (userRole || 'student'));
  const isUserAuthenticated = authUser ? true : isAuthenticated;

  const navigation = [
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'About', href: '/about', icon: Users },
  ];

  // Add dashboard link for authenticated users
  const authenticatedNavigation = [
    { name: 'Dashboard', href: displayRole === 'FACULTY' ? '/faculty-dashboard' : '/dashboard', icon: BookOpen },
    ...(displayRole !== 'FACULTY' ? [{ name: 'Certifications', href: '/certifications', icon: Award }] : []),
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'About', href: '/about', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
            <header className="bg-white border-b border-gray-200/50 sticky top-0 z-50 shadow-lg shadow-gray-200/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group">
            <img 
              src="/src/assets/EduSyncNew.png" 
              alt="EduSync Logo" 
              className="h-10 w-auto transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {(isUserAuthenticated ? authenticatedNavigation : navigation).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                    isActive(item.href)
                      ? 'text-[#0f1a2a] bg-gray-100 shadow-md'
                      : 'text-gray-600 hover:text-[#0f1a2a] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${
                    isActive(item.href) ? 'text-[#0f1a2a]' : 'text-gray-500 group-hover:text-[#0f1a2a]'
                  }`} />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#0f1a2a] rounded-full"></div>
                  )}
                </Link>
              );
            })}
            {isUserAuthenticated && (
              <button
                onClick={handleSettingsClick}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === '/settings'
                    ? 'text-[#0f1a2a] bg-gray-100 shadow-md'
                    : 'text-gray-600 hover:text-[#0f1a2a] hover:bg-gray-50'
                }`}
              >
                <Settings className={`h-4 w-4 transition-all duration-300 ${
                  location.pathname === '/settings' ? 'text-[#0f1a2a]' : 'text-gray-500 group-hover:text-[#0f1a2a]'
                }`} />
                <span>Settings</span>
                {location.pathname === '/settings' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#0f1a2a] rounded-full"></div>
                )}
              </button>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isUserAuthenticated ? (
              <div className="flex items-center space-x-4">

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-300 border-2 border-transparent hover:border-gray-200">
                      <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                        <AvatarImage 
                          src={authUser?.profilePicture || ""} 
                          alt={displayName} 
                        />
                        <AvatarFallback className="bg-[#0f1a2a] text-white font-semibold text-sm">
                          {displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-white border border-gray-200/50 shadow-xl shadow-gray-200/30 rounded-2xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-semibold leading-none text-gray-900">{displayName}</p>
                        <p className="text-xs leading-none text-[#0f1a2a] font-medium capitalize bg-gray-100 px-2 py-1 rounded-full w-fit">
                          {displayRole}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem onClick={handleProfileClick} className="mx-2 my-1 rounded-xl hover:bg-gray-100 focus:bg-gray-100 transition-colors duration-200">
                      <User className="mr-3 h-4 w-4 text-[#0f1a2a]" />
                      <span className="font-medium">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick} className="mx-2 my-1 rounded-xl hover:bg-gray-100 focus:bg-gray-100 transition-colors duration-200">
                      <Settings className="mr-3 h-4 w-4 text-[#0f1a2a]" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem onClick={handleLogout} className="mx-2 my-1 rounded-xl hover:bg-red-50 focus:bg-red-50 transition-colors duration-200">
                      <LogOut className="mr-3 h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-700">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-[#0f1a2a] hover:bg-gray-100 transition-all duration-300 px-4 py-2 rounded-xl font-medium"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button 
                    size="sm" 
                    className="bg-[#0f1a2a] hover:bg-[#0a141f] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl font-medium"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 transition-all duration-300 p-2 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#0f1a2a]" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {(isUserAuthenticated ? authenticatedNavigation : navigation).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary-muted shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-md'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {isUserAuthenticated && (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <button
                      onClick={() => {
                        handleProfileClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSettingsClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}