import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="edu-button-primary">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="edu-button-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Looking for something specific? Try searching our resources:
              </p>
              <Link to="/resources">
                <Button variant="outline" className="edu-button-secondary">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Popular Pages
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/" className="text-primary hover:underline text-sm">Home</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/about" className="text-primary hover:underline text-sm">About</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/resources" className="text-primary hover:underline text-sm">Resources</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/auth/login" className="text-primary hover:underline text-sm">Login</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
