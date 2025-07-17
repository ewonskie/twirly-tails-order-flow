import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/ui/back-button';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
}

interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: string;
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reference_id: string;
  notes: string;
  created_at: string;
  products: Product;
}

export default function Inventory() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [formData, setFormData] = useState({
    transaction_type: 'adjustment' as 'adjustment' | 'restock' | 'damage' | 'return',
    quantity_change: '',
    notes: '',
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, current_stock, min_stock_level, max_stock_level')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          products (id, name, sku, current_stock, min_stock_level, max_stock_level)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const resetForm = () => {
    setSelectedProduct('');
    setFormData({
      transaction_type: 'adjustment',
      quantity_change: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const quantityChange = parseInt(formData.quantity_change);
    if (isNaN(quantityChange) || quantityChange === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity change",
        variant: "destructive",
      });
      return;
    }

    const newStock = product.current_stock + quantityChange;
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Stock cannot go below zero",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', selectedProduct);

      if (updateError) throw updateError;

      // Create inventory transaction
      const { error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert({
          product_id: selectedProduct,
          transaction_type: formData.transaction_type,
          quantity_change: quantityChange,
          previous_stock: product.current_stock,
          new_stock: newStock,
          notes: formData.notes,
          created_by: profile?.id,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });

      resetForm();
      setIsDialogOpen(false);
      fetchProducts();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.current_stock <= product.min_stock_level) {
      return { status: 'Low Stock', variant: 'destructive' as const };
    }
    if (product.current_stock > product.max_stock_level) {
      return { status: 'Overstock', variant: 'secondary' as const };
    }
    return { status: 'Normal', variant: 'default' as const };
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'restock':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sale':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case 'damage':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'return':
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'adjustment':
        return <Package className="h-4 w-4 text-gray-600" />;
      default:
        return <Package className="h-4 w-4" />;
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
      <BackButton />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and inventory transactions</p>
        </div>
        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Package className="h-4 w-4 mr-2" />
                Adjust Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Inventory Adjustment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Current: {product.current_stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="transaction_type">Transaction Type</Label>
                  <Select
                    value={formData.transaction_type}
                    onValueChange={(value: any) => setFormData({ ...formData, transaction_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="damage">Damage/Loss</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity_change">Quantity Change</Label>
                  <Input
                    id="quantity_change"
                    type="number"
                    value={formData.quantity_change}
                    onChange={(e) => setFormData({ ...formData, quantity_change: e.target.value })}
                    placeholder="Use negative numbers to decrease stock"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Positive numbers increase stock, negative numbers decrease stock
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Reason for adjustment..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.current_stock} units</p>
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No products found. Add products first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border-b pb-2 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div>
                        <p className="font-medium">{transaction.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.transaction_type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.quantity_change > 0 ? '+' : ''}{transaction.quantity_change}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.previous_stock} → {transaction.new_stock}
                      </p>
                    </div>
                  </div>
                  {transaction.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {transaction.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No transactions found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {products.some(p => p.current_stock <= p.min_stock_level) && (
        <Card className="mt-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products
                .filter(p => p.current_stock <= p.min_stock_level)
                .map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="destructive">
                      {product.current_stock} / {product.min_stock_level} min
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}