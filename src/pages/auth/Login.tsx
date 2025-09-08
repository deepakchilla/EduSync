import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "./AuthLayout";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
          className: "border-green-500 bg-green-500 text-white",
        });
        navigate("/dashboard");
      } else {
        // Show the specific error message from the backend
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || "Invalid email or password. Please check your credentials and try again.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back! Please enter your details."
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-5">
          <div className="space-y-2 animate-fade-in-up">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2 animate-fade-in-up-delayed">
            <Label htmlFor="password" className="text-foreground font-medium text-sm">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-12 h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 animate-fade-in-up-delayed-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
              }
            />
            <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer hover:text-blue-900 transition-colors">
              Remember me
            </Label>
          </div>

          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-900 hover:text-blue-700 transition-all duration-200 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-up-delayed-3"
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="relative py-6 animate-fade-in-up-delayed-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-blue-700 font-medium">
              New to EduSync?
            </span>
          </div>
        </div>

        <Link to="/auth/register" className="block w-full animate-fade-in-up-delayed-5">
          <Button 
            variant="outline" 
            className="w-full h-11 border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            Create an account
          </Button>
        </Link>

        <div className="text-center pt-4 animate-fade-in-up-delayed-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-blue-900 hover:text-blue-700 underline transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-900 hover:text-blue-700 underline transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}