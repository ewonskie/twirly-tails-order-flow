-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'staff', 'supplier');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'fulfilled', 'cancelled');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('order_confirmation', 'low_stock', 'delivery_update', 'system_alert');

-- Create profiles table for user management
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for inventory
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT NOT NULL UNIQUE,
    category TEXT,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER NOT NULL DEFAULT 10,
    max_stock_level INTEGER NOT NULL DEFAULT 1000,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    status order_status NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    order_source TEXT DEFAULT 'manual', -- shopify, facebook, pos, manual
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory transactions table for tracking stock changes
CREATE TABLE public.inventory_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id),
    transaction_type TEXT NOT NULL, -- 'sale', 'restock', 'adjustment'
    quantity_change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference_id UUID, -- can reference order_id or other entities
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for products
CREATE POLICY "All authenticated users can view products" ON public.products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and staff can insert products" ON public.products
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Admins and staff can update products" ON public.products
    FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- RLS Policies for orders
CREATE POLICY "All authenticated users can view orders" ON public.orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and staff can insert orders" ON public.orders
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Admins and staff can update orders" ON public.orders
    FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- RLS Policies for order_items
CREATE POLICY "All authenticated users can view order items" ON public.order_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and staff can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = notifications.user_id));

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = notifications.user_id));

-- RLS Policies for inventory_transactions
CREATE POLICY "All authenticated users can view inventory transactions" ON public.inventory_transactions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and staff can insert inventory transactions" ON public.inventory_transactions
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- Create function to handle new user profile creation (only for admins)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile if created by admin or if it's the first user (bootstrap)
    IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
        -- Don't auto-create profiles after first admin exists
        RETURN NEW;
    ELSE
        -- First user becomes admin (bootstrap)
        INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'Admin'),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
            'admin'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create function to update inventory when orders are fulfilled
CREATE OR REPLACE FUNCTION public.update_inventory_on_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If order status changed to fulfilled, reduce inventory
    IF OLD.status != 'fulfilled' AND NEW.status = 'fulfilled' THEN
        -- Update product stock and create inventory transactions
        UPDATE public.products 
        SET current_stock = current_stock - oi.quantity
        FROM public.order_items oi 
        WHERE oi.order_id = NEW.id AND products.id = oi.product_id;
        
        -- Create inventory transactions
        INSERT INTO public.inventory_transactions (
            product_id, transaction_type, quantity_change, previous_stock, new_stock, 
            reference_id, notes, created_by
        )
        SELECT 
            oi.product_id,
            'sale',
            -oi.quantity,
            p.current_stock + oi.quantity,
            p.current_stock,
            NEW.id,
            'Order fulfilled: ' || NEW.order_number,
            NEW.created_by
        FROM public.order_items oi
        JOIN public.products p ON p.id = oi.product_id
        WHERE oi.order_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory updates
CREATE TRIGGER on_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_inventory_on_order_status_change();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_supplier ON public.products(supplier_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_by ON public.orders(created_by);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_inventory_transactions_product_id ON public.inventory_transactions(product_id);