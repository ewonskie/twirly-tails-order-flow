import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
<<<<<<< HEAD
import Index from "./pages/Index";
import Auth from "./pages/Auth";
=======

// Public Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Protected Pages
>>>>>>> 69939d5 (New UI DESIGN)
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
<<<<<<< HEAD
import NotFound from "./pages/NotFound";
=======
>>>>>>> 69939d5 (New UI DESIGN)

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <Index />
      } />
      <Route path="/auth" element={
        user ? <Navigate to="/dashboard" replace /> : <Auth />
      } />
=======
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/about" element={<About />} />

      {/* Protected Routes */}
>>>>>>> 69939d5 (New UI DESIGN)
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />
<<<<<<< HEAD
=======

      {/* Fallback */}
>>>>>>> 69939d5 (New UI DESIGN)
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
