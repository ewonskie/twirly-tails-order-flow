import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Package className="h-16 w-16 text-primary mr-4" />
              <h1 className="text-5xl font-bold">Twirly Tails</h1>
            </div>
            <h2 className="text-2xl text-muted-foreground mb-8">
              Complete Order Management System
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Streamline your ingredient tracking, automate inventory updates, and enhance operational 
              efficiency with our comprehensive digital management platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Powerful Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage orders, track inventory, and coordinate deliveries efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Order Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create, edit, and cancel orders with ease. Track order status from creation to fulfillment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically update stock levels, set minimum thresholds, and receive low-stock alerts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multi-Channel Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sync orders from Shopify, Facebook, and POS systems into one unified dashboard.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure user authentication with role-based permissions for Admin, Staff, and Suppliers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Why Choose Twirly Tails?</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Real-Time Tracking</h4>
                  <p className="text-muted-foreground">
                    Monitor inventory levels in real-time and prevent stockouts with automated alerts.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Streamlined Operations</h4>
                  <p className="text-muted-foreground">
                    Reduce manual input and errors with automated inventory updates and order processing.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Comprehensive Reporting</h4>
                  <p className="text-muted-foreground">
                    Generate detailed sales, inventory, and fulfillment reports in CSV/PDF formats.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-card p-8 rounded-lg border">
                <h4 className="text-2xl font-bold mb-4">Ready to Start?</h4>
                <p className="text-muted-foreground mb-6">
                  Join thousands of businesses already using Twirly Tails to streamline their operations.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link to="/auth">
                    Access System
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold">Twirly Tails OMS</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Twirly Tails. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
