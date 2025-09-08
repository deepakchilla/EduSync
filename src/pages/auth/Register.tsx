import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "./AuthLayout";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, GraduationCap, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") || "student",
    agreeToTerms: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!formData.agreeToTerms) {
        throw new Error("Please agree to the terms of service");
      }

      console.log("Submitting registration data:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'student' | 'faculty'
      });

      if (success) {
        toast({
          title: "Account created successfully!",
          description: `Welcome to EduSync, ${formData.firstName}!`,
          className: "border-green-500 bg-green-500 text-white",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
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
      title="Create your account"
      subtitle="Join our community of learners and educators."
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Role Selection */}
        <div className="animate-fade-in-up">
          <Label className="text-foreground font-medium text-sm">I am joining as a</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                formData.role === "student"
                  ? "border-blue-900 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:border-blue-700 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, role: "student" }))}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${
                  formData.role === "student"
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Student</div>
                  <div className="text-xs text-muted-foreground">Access resources</div>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                formData.role === "faculty"
                  ? "border-blue-900 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:border-blue-700 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, role: "faculty" }))}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${
                  formData.role === "faculty"
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Faculty</div>
                  <div className="text-xs text-muted-foreground">Manage content</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up-delayed">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-medium text-sm">First name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="pl-10 h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
                placeholder="First name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-medium text-sm">Last name</Label>
            <div>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 animate-fade-in-up-delayed-2">
          <Label htmlFor="email" className="text-foreground font-medium text-sm">Email address</Label>
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

        {/* Password */}
        <div className="space-y-2 animate-fade-in-up-delayed-3">
          <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-12 h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
              placeholder="Create a password"
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

        {/* Confirm Password */}
        <div className="space-y-2 animate-fade-in-up-delayed-4">
          <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">Confirm password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 h-11 border-2 focus:border-blue-900 transition-all duration-300 w-full hover:border-blue-700"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-3 animate-fade-in-up-delayed-5">
          <Checkbox
            id="agree-terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
            }
            className="mt-1"
          />
          <Label htmlFor="agree-terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:text-blue-900 transition-colors">
            I agree to the{" "}
            <Link to="/terms" className="text-blue-900 hover:text-blue-700 underline transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-900 hover:text-blue-700 underline transition-colors">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-up-delayed-6"
        >
          {isLoading ? (
            "Creating account..."
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="relative py-6 animate-fade-in-up-delayed-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-blue-200 font-medium">
              Already have an account?
            </span>
          </div>
        </div>

        <Link to="/auth/login" className="block w-full animate-fade-in-up-delayed-8">
          <Button 
            variant="outline" 
            className="w-full h-11 border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            Sign in instead
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}