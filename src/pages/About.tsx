// src/pages/About.tsx

import { ShoppingCart, Package, BarChart3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header"; // Updated path

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1">
        {/* Title Section */}
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Powerful Features</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the tools that help Twirly Tails manage orders, streamline inventory, and empower staff.
          </p>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 pb-20">
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
      </main>

      {/* Footer (reused from Home) */}
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

export default About;
