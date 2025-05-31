import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, LogOut, Package } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-white mr-3" />
            <h1 className="text-white text-xl font-medium">
              E-Commerce Platform
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/products">
                  <Button
                    variant="ghost"
                    className={`text-white hover:text-blue-100 hover:bg-blue-700 ${
                      location === "/products" ? "bg-blue-700" : ""
                    }`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-white hover:text-blue-100 hover:bg-blue-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-blue-100 hover:bg-blue-700"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
