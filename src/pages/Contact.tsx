import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock, ChefHat, Utensils } from "lucide-react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BackButton } from "@/components/ui/back-button";

const Contact = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit Twirly Tails for the best Korean food and refreshing beverages in the Philippines
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Our Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Mercato de Mactan</p>
                      <p className="text-sm text-muted-foreground">Lapu-Lapu City</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Mercato Insular Square</p>
                      <p className="text-sm text-muted-foreground">Davao City</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Poblacion</p>
                      <p className="text-sm text-muted-foreground">BM Dimataga St</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Foodcamp</p>
                      <p className="text-sm text-muted-foreground">Marigondon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">0919 647 2136</p>
                <p className="text-sm text-muted-foreground">Call us for reservations and inquiries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">info@twirlytails.com</p>
                <p className="text-sm text-muted-foreground">Send us your feedback and suggestions</p>
              </CardContent>
            </Card>
          </div>

          {/* Operating Hours & Services */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monday</span>
                    <span className="text-muted-foreground">CLOSED</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tuesday</span>
                    <span className="text-muted-foreground">CLOSED</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Wednesday</span>
                    <span className="text-primary font-medium">1:00 PM - 12:00 AM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Thursday</span>
                    <span className="text-primary font-medium">1:00 PM - 12:00 AM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Friday</span>
                    <span className="text-primary font-medium">1:00 PM - 12:00 AM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Saturday</span>
                    <span className="text-primary font-medium">1:00 PM - 12:00 AM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-primary font-medium">1:00 PM - 12:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Restaurant Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-4 w-4 text-primary" />
                  <span>Authentic Korean Cuisine</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span>Fresh Fruit Shakes & Beverages</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Dine-in & Takeout Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Late Night Service Until Midnight</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">About Twirly Tails Restaurant</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Twirly Tails is your premier destination for authentic Korean cuisine and refreshing beverages in the Philippines. 
              We specialize in traditional Korean dishes like ramyun, bulgogi, and bibimbap, alongside our signature fruit shakes 
              made with fresh, high-quality ingredients.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              With multiple locations across the Philippines, we're committed to serving delicious food and creating memorable 
              dining experiences for our customers. Visit us today and taste the authentic flavors of Korea!
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Contact;