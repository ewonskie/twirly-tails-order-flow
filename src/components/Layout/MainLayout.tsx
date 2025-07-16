import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Bell,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'staff': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'supplier': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Menu Items', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Kitchen Inventory', href: '/inventory', icon: BarChart3 },
    ...(profile?.role === 'admin' ? [{ name: 'Staff Management', href: '/team', icon: Users }] : []),
    { name: 'Contact Info', href: '/contact', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Package className="h-10 w-10 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Twirly Tails
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Restaurant Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-sm">{profile?.first_name} {profile?.last_name}</p>
                <Badge className={`text-xs px-2 py-0.5 ${getRoleColor(profile?.role || '')}`}>
                  {profile?.role?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-primary" />
              <span>© 2024 Twirly Tails Restaurant. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Status: </span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span>Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};