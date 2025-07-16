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
              Authentic Korean Restaurant
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Experience the finest Korean cuisine with our signature ramyun, fresh fruit shakes, and traditional dishes. 
              Join us for an authentic taste of Korea in the Philippines.
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
            <h3 className="text-3xl font-bold mb-4">Our Specialties</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our signature Korean dishes and refreshing beverages made with the finest ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Korean Ramyun</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Authentic Korean noodles with rich broths, fresh vegetables, and premium ingredients.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fresh Fruit Shakes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Premium fruit shakes made with real fruits, natural ingredients, and no artificial flavors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Korean BBQ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Traditional Korean BBQ dishes with marinated meats, fresh sides, and authentic flavors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Korean Snacks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Delicious Korean street food, traditional snacks, and appetizers to complement your meal.
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
                  <h4 className="text-xl font-semibold mb-2">Fresh Ingredients Daily</h4>
                  <p className="text-muted-foreground">
                    We source only the freshest ingredients daily to ensure the highest quality in every dish.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Authentic Korean Flavors</h4>
                  <p className="text-muted-foreground">
                    Our chefs bring traditional Korean recipes and cooking techniques to every dish we serve.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Multiple Locations</h4>
                  <p className="text-muted-foreground">
                    Conveniently located across the Philippines with consistent quality at every branch.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-card p-8 rounded-lg border">
                <h4 className="text-2xl font-bold mb-4">Visit Us Today!</h4>
                <p className="text-muted-foreground mb-6">
                  Experience authentic Korean cuisine at our multiple locations across the Philippines.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link to="/auth">
                    Find Locations
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
            <span className="font-bold">Twirly Tails Restaurant</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Twirly Tails Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
