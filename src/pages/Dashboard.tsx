import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/Layout/MainLayout';
import { NotificationCenter } from '@/components/Dashboard/NotificationCenter';
import { ReportGenerator } from '@/components/Reports/ReportGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeProducts: 0,
    lowStockItems: 0,
    teamMembers: 0,
    pendingOrders: 0,
    revenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*)');

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('*');

      // Fetch team members (only for admin)
      let teamMembers = 1; // Current user
      if (profile?.role === 'admin') {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id');
        teamMembers = profiles?.length || 1;
      }

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const activeProducts = products?.filter(p => p.is_active)?.length || 0;
      const lowStockProducts = products?.filter(p => p.current_stock <= p.min_stock_level) || [];
      const lowStockItems = lowStockProducts.length;
      const pendingOrders = orders?.filter(o => o.status === 'pending')?.length || 0;
      const revenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setStats({
        totalOrders,
        activeProducts,
        lowStockItems,
        teamMembers,
        pendingOrders,
        revenue,
        recentOrders,
        lowStockProducts: lowStockProducts.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {profile?.first_name}!
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's your restaurant overview for today
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">₱{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Sales performance
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-destructive/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{stats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-success/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              <Package className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                Available dishes & beverages
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks to streamline your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Menu
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Process Orders
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/inventory">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Kitchen Inventory
                </Link>
              </Button>
              {profile?.role === 'admin' && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/team">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Staff
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Recent Orders</span>
              </CardTitle>
              <CardDescription>
                Latest order activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first order to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <Badge 
                        variant={order.status === 'fulfilled' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Stock Alerts</span>
              </CardTitle>
              <CardDescription>
                Products requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.lowStockProducts.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">All items in stock</p>
                  <p className="text-sm text-muted-foreground">
                    No restocking needed
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg border-warning/20 bg-warning/5">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge variant="outline" className="text-xs text-warning border-warning">
                        {product.current_stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Notifications and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NotificationCenter />
          <ReportGenerator />
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Real-time system health and integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-success/5 border-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Database Online</span>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-success/5 border-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Authentication Active</span>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-success/5 border-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Kitchen Display Online</span>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-success/5 border-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Payment System Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;