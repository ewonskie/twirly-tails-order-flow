import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ShoppingCart, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  unit_price: number;
  current_stock: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  total_amount: number;
  order_source: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export default function Orders() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (id, name, unit_price, current_stock)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, unit_price, current_stock')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { product_id: '', quantity: 1, unit_price: 0, total_price: 0 }
    ]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unit_price = product.unit_price;
        newItems[index].total_price = product.unit_price * newItems[index].quantity;
      }
    } else if (field === 'quantity') {
      newItems[index].total_price = newItems[index].unit_price * value;
    }

    setOrderItems(newItems);
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      notes: '',
    });
    setOrderItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the order",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);
      
      const orderData = {
        order_number: generateOrderNumber(),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        total_amount: totalAmount,
        notes: formData.notes,
        created_by: profile?.user_id,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Order created successfully",
      });

      resetForm();
      setIsDialogOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'processing' | 'fulfilled' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ShoppingCart className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'fulfilled':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const;
      case 'processing':
        return 'default' as const;
      case 'fulfilled':
        return 'default' as const;
      case 'cancelled':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const canManage = profile?.role === 'admin' || profile?.role === 'staff';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Customer Name</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Customer Email</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customer_phone">Customer Phone</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Order Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  
                  {orderItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-2">
                      <div className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label>Product</Label>
                          <Select
                            value={item.product_id}
                            onValueChange={(value) => updateOrderItem(index, 'product_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} (${product.unit_price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <div className="text-sm font-semibold pt-2">
                            ${item.total_price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="text-right text-lg font-semibold">
                  Total: ${orderItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Order</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(order.status)} className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span>{order.status.toUpperCase()}</span>
                  </Badge>
                  {canManage && order.status !== 'fulfilled' && order.status !== 'cancelled' && (
                    <Select
                      value={order.status}
                      onValueChange={(value: 'pending' | 'processing' | 'fulfilled' | 'cancelled') => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.customer_email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {order.customer_email}
                  </p>
                )}
                {order.customer_phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {order.customer_phone}
                  </p>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Order Items:</h4>
                  <div className="space-y-2">
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.product?.name} × {item.quantity}
                        </span>
                        <span>${item.total_price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <span className="font-medium">Notes:</span> {order.notes}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by creating your first order.
            </p>
            {canManage && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}