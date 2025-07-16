import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  className?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ className }) => {
  const [reportType, setReportType] = useState<string>('');
  const [format, setFormat] = useState<string>('csv');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'inventory', label: 'Inventory Report', description: 'Current stock levels and product details' },
    { value: 'sales', label: 'Sales Report', description: 'Order performance and revenue analytics' },
    { value: 'fulfillment', label: 'Fulfillment Report', description: 'Order processing and delivery metrics' },
    { value: 'low_stock', label: 'Low Stock Alert', description: 'Products below minimum threshold' },
    { value: 'transactions', label: 'Inventory Transactions', description: 'Stock movement history' },
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: 'Error',
        description: 'Please select a report type',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let data: any[] = [];
      let filename = '';

      switch (reportType) {
        case 'inventory':
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('products')
            .select('name, sku, category, current_stock, min_stock_level, max_stock_level, unit_price, is_active');
          
          if (inventoryError) throw inventoryError;
          data = inventoryData || [];
          filename = `inventory_report_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'sales':
          const { data: salesData, error: salesError } = await supabase
            .from('orders')
            .select(`
              order_number,
              customer_name,
              customer_email,
              status,
              total_amount,
              created_at,
              order_items (
                quantity,
                unit_price,
                total_price,
                products (name, sku)
              )
            `)
            .gte('created_at', startDate?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('created_at', endDate?.toISOString() || new Date().toISOString());

          if (salesError) throw salesError;
          data = salesData || [];
          filename = `sales_report_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'fulfillment':
          const { data: fulfillmentData, error: fulfillmentError } = await supabase
            .from('orders')
            .select('order_number, status, created_at, updated_at, assigned_to, profiles!orders_assigned_to_fkey(first_name, last_name)')
            .gte('created_at', startDate?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('created_at', endDate?.toISOString() || new Date().toISOString());

          if (fulfillmentError) throw fulfillmentError;
          data = fulfillmentData || [];
          filename = `fulfillment_report_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'low_stock':
          const { data: lowStockData, error: lowStockError } = await supabase
            .from('products')
            .select('name, sku, current_stock, min_stock_level, category')
            .filter('is_active', 'eq', true);

          if (lowStockError) throw lowStockError;
          data = (lowStockData || []).filter(item => item.current_stock <= item.min_stock_level);
          filename = `low_stock_report_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'transactions':
          const { data: transactionData, error: transactionError } = await supabase
            .from('inventory_transactions')
            .select(`
              transaction_type,
              quantity_change,
              previous_stock,
              new_stock,
              notes,
              created_at,
              products (name, sku),
              profiles!inventory_transactions_created_by_fkey (first_name, last_name)
            `)
            .gte('created_at', startDate?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('created_at', endDate?.toISOString() || new Date().toISOString())
            .order('created_at', { ascending: false });

          if (transactionError) throw transactionError;
          data = transactionData || [];
          filename = `transaction_report_${new Date().toISOString().split('T')[0]}`;
          break;
      }

      if (format === 'csv') {
        downloadCSV(data, filename);
      } else {
        downloadJSON(data, filename);
      }

      toast({
        title: 'Report Generated',
        description: `${reportTypes.find(r => r.value === reportType)?.label} downloaded successfully`,
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: 'No Data',
        description: 'No data available for the selected criteria',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value).replace(/"/g, '""');
          }
          return String(value || '').replace(/"/g, '""');
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const downloadJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Report Generator</span>
        </CardTitle>
        <CardDescription>
          Generate and download comprehensive business reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(reportType === 'sales' || reportType === 'fulfillment' || reportType === 'transactions') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-input rounded-md"
                value={startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-input rounded-md"
                value={endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateReport} 
          disabled={loading || !reportType}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
};