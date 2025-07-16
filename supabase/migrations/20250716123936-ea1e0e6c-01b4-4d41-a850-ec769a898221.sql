-- Clear existing data
DELETE FROM inventory_transactions;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM notifications;

-- Insert restaurant products (beverages, shakes, Korean food, snacks)
INSERT INTO products (name, description, sku, category, unit_price, current_stock, min_stock_level, max_stock_level, is_active) VALUES
-- Shakes & Beverages
('Avocado Mango Supreme', 'Real fruits mixed in a Supreme shake with creamy avocado and sweet mango', 'AMS001', 'Beverages', 185.00, 50, 10, 100, true),
('Mango Monster', 'Mango shake with ice cream and mango cubes for extra flavor', 'MM002', 'Beverages', 185.00, 45, 10, 100, true),
('Strawberry Delight', 'Fresh strawberry shake with whipped cream topping', 'SD003', 'Beverages', 175.00, 40, 10, 100, true),
('Chocolate Madness', 'Rich chocolate shake with chocolate chips and syrup', 'CM004', 'Beverages', 195.00, 35, 10, 100, true),
('Vanilla Bean Dream', 'Classic vanilla shake made with real vanilla beans', 'VBD005', 'Beverages', 165.00, 55, 10, 100, true),
('Cookies & Cream Blast', 'Oreo cookies blended with vanilla ice cream', 'CCB006', 'Beverages', 205.00, 30, 10, 100, true),
('Banana Split Shake', 'Banana shake with cherry and chocolate sauce', 'BSS007', 'Beverages', 185.00, 42, 10, 100, true),
('Matcha Green Tea Latte', 'Premium matcha powder with steamed milk', 'MGTL008', 'Beverages', 195.00, 25, 10, 100, true),
('Iced Coffee Supreme', 'Premium coffee beans with vanilla ice cream', 'ICS009', 'Beverages', 155.00, 60, 15, 120, true),
('Tropical Paradise', 'Pineapple, mango, and coconut shake blend', 'TP010', 'Beverages', 215.00, 28, 10, 100, true),

-- Korean Food
('Classic Ramyun', 'Korean instant noodles with vegetables and egg', 'CR011', 'Korean Food', 185.00, 80, 20, 200, true),
('Spicy Kimchi Ramyun', 'Hot and spicy ramyun with kimchi and pork', 'SKR012', 'Korean Food', 215.00, 65, 20, 200, true),
('Cheese Ramyun', 'Creamy ramyun topped with melted cheese', 'CHR013', 'Korean Food', 225.00, 55, 20, 200, true),
('Seafood Ramyun', 'Ramyun with shrimp, squid, and fish cake', 'SR014', 'Korean Food', 245.00, 45, 15, 150, true),
('Bulgogi Bowl', 'Marinated beef with rice and vegetables', 'BB015', 'Korean Food', 285.00, 35, 10, 100, true),
('Korean Fried Chicken', 'Crispy chicken with Korean spicy sauce', 'KFC016', 'Korean Food', 265.00, 40, 15, 120, true),
('Bibimbap', 'Mixed rice bowl with vegetables and beef', 'BIM017', 'Korean Food', 255.00, 30, 10, 100, true),
('Korean Corn Dog', 'Corn dog with potato cubes and special sauce', 'KCD018', 'Korean Food', 125.00, 70, 20, 200, true),
('Kimchi Fried Rice', 'Fried rice with kimchi and Korean spices', 'KFR019', 'Korean Food', 195.00, 50, 15, 150, true),
('Korean BBQ Wrap', 'Grilled meat wrapped in lettuce with sauce', 'KBBW020', 'Korean Food', 235.00, 25, 10, 100, true),

-- Snacks & Sides
('Korean Rice Balls', 'Seasoned rice balls with seaweed and filling', 'KRB021', 'Snacks', 85.00, 60, 20, 200, true),
('Crispy Chicken Wings', 'Golden fried chicken wings with dipping sauce', 'CCW022', 'Snacks', 155.00, 45, 15, 150, true),
('Sweet Potato Fries', 'Crispy sweet potato fries with honey dip', 'SPF023', 'Snacks', 125.00, 55, 20, 200, true),
('Mozzarella Sticks', 'Breaded mozzarella with marinara sauce', 'MS024', 'Snacks', 145.00, 40, 15, 150, true),
('Korean Pancake', 'Savory pancake with scallions and seafood', 'KP025', 'Snacks', 165.00, 35, 10, 100, true),
('Popcorn Chicken', 'Bite-sized crispy chicken pieces', 'PC026', 'Snacks', 135.00, 50, 15, 150, true),
('Onion Rings', 'Golden fried onion rings with ranch dip', 'OR027', 'Snacks', 115.00, 45, 15, 150, true),
('Korean Fish Cake', 'Traditional fish cake soup with vegetables', 'KFC028', 'Snacks', 95.00, 65, 20, 200, true),
('Loaded Nachos', 'Tortilla chips with cheese, jalapeños, and salsa', 'LN029', 'Snacks', 175.00, 30, 10, 100, true),
('Spring Rolls', 'Fresh spring rolls with sweet chili sauce', 'SPR030', 'Snacks', 105.00, 40, 15, 150, true);

-- Insert sample orders
INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, status, total_amount, order_source, notes, created_by) VALUES
('TT-2024-001', 'Maria Santos', 'maria.santos@email.com', '09171234567', 'fulfilled', 555.00, 'dine-in', 'Table 5 - Extra spicy', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-002', 'John Cruz', 'john.cruz@email.com', '09182345678', 'processing', 760.00, 'takeout', 'No onions on ramyun', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-003', 'Lisa Garcia', 'lisa.garcia@email.com', '09193456789', 'fulfilled', 370.00, 'delivery', 'Delivered to Makati CBD', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-004', 'Miguel Torres', 'miguel.torres@email.com', '09204567890', 'pending', 445.00, 'dine-in', 'Birthday celebration - Table 12', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-005', 'Sarah Kim', 'sarah.kim@email.com', '09215678901', 'fulfilled', 625.00, 'takeout', 'Extra cheese on everything', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-006', 'David Lee', 'david.lee@email.com', '09226789012', 'processing', 890.00, 'delivery', 'Corporate lunch order', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-007', 'Ana Rodriguez', 'ana.rodriguez@email.com', '09237890123', 'cancelled', 285.00, 'dine-in', 'Customer changed mind', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-008', 'Carlos Mendoza', 'carlos.mendoza@email.com', '09248901234', 'fulfilled', 515.00, 'takeout', 'Regular customer - knows the drill', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-009', 'Grace Tan', 'grace.tan@email.com', '09259012345', 'processing', 340.00, 'delivery', 'Office building - 15th floor', (SELECT id FROM profiles LIMIT 1)),
('TT-2024-010', 'Robert Johnson', 'robert.johnson@email.com', '09260123456', 'pending', 720.00, 'dine-in', 'Group of 6 - booth seating', (SELECT id FROM profiles LIMIT 1));

-- Insert order items for the orders
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1 (TT-2024-001)
((SELECT id FROM orders WHERE order_number = 'TT-2024-001'), (SELECT id FROM products WHERE sku = 'AMS001'), 2, 185.00, 370.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-001'), (SELECT id FROM products WHERE sku = 'CR011'), 1, 185.00, 185.00),

-- Order 2 (TT-2024-002)
((SELECT id FROM orders WHERE order_number = 'TT-2024-002'), (SELECT id FROM products WHERE sku = 'SKR012'), 2, 215.00, 430.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-002'), (SELECT id FROM products WHERE sku = 'CCW022'), 1, 155.00, 155.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-002'), (SELECT id FROM products WHERE sku = 'SPF023'), 1, 125.00, 125.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-002'), (SELECT id FROM products WHERE sku = 'KRB021'), 2, 85.00, 170.00),

-- Order 3 (TT-2024-003)
((SELECT id FROM orders WHERE order_number = 'TT-2024-003'), (SELECT id FROM products WHERE sku = 'MM002'), 2, 185.00, 370.00),

-- Order 4 (TT-2024-004)
((SELECT id FROM orders WHERE order_number = 'TT-2024-004'), (SELECT id FROM products WHERE sku = 'CHR013'), 1, 225.00, 225.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-004'), (SELECT id FROM products WHERE sku = 'KCD018'), 1, 125.00, 125.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-004'), (SELECT id FROM products WHERE sku = 'OR027'), 1, 115.00, 115.00),

-- Order 5 (TT-2024-005)
((SELECT id FROM orders WHERE order_number = 'TT-2024-005'), (SELECT id FROM products WHERE sku = 'KFC016'), 1, 265.00, 265.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-005'), (SELECT id FROM products WHERE sku = 'TP010'), 1, 215.00, 215.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-005'), (SELECT id FROM products WHERE sku = 'MS024'), 1, 145.00, 145.00),

-- Continue for remaining orders...
((SELECT id FROM orders WHERE order_number = 'TT-2024-006'), (SELECT id FROM products WHERE sku = 'BB015'), 2, 285.00, 570.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-006'), (SELECT id FROM products WHERE sku = 'BIM017'), 1, 255.00, 255.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-006'), (SELECT id FROM products WHERE sku = 'KRB021'), 3, 85.00, 255.00),

((SELECT id FROM orders WHERE order_number = 'TT-2024-007'), (SELECT id FROM products WHERE sku = 'KBBW020'), 1, 235.00, 235.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-007'), (SELECT id FROM products WHERE sku = 'KRB021'), 2, 85.00, 170.00),

((SELECT id FROM orders WHERE order_number = 'TT-2024-008'), (SELECT id FROM products WHERE sku = 'SR014'), 1, 245.00, 245.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-008'), (SELECT id FROM products WHERE sku = 'CM004'), 1, 195.00, 195.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-008'), (SELECT id FROM products WHERE sku = 'KP025'), 1, 165.00, 165.00),

((SELECT id FROM orders WHERE order_number = 'TT-2024-009'), (SELECT id FROM products WHERE sku = 'VBD005'), 1, 165.00, 165.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-009'), (SELECT id FROM products WHERE sku = 'PC026'), 1, 135.00, 135.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-009'), (SELECT id FROM products WHERE sku = 'KFC028'), 2, 95.00, 190.00),

((SELECT id FROM orders WHERE order_number = 'TT-2024-010'), (SELECT id FROM products WHERE sku = 'MGTL008'), 3, 195.00, 585.00),
((SELECT id FROM orders WHERE order_number = 'TT-2024-010'), (SELECT id FROM products WHERE sku = 'LN029'), 1, 175.00, 175.00);

-- Insert inventory transactions
INSERT INTO inventory_transactions (product_id, transaction_type, quantity_change, previous_stock, new_stock, notes, created_by) VALUES
((SELECT id FROM products WHERE sku = 'AMS001'), 'adjustment', 50, 0, 50, 'Initial stock setup', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'MM002'), 'adjustment', 45, 0, 45, 'Initial stock setup', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'CR011'), 'adjustment', 80, 0, 80, 'Initial stock setup', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'SKR012'), 'adjustment', 65, 0, 65, 'Initial stock setup', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'CHR013'), 'adjustment', 55, 0, 55, 'Initial stock setup', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'AMS001'), 'sale', -2, 50, 48, 'Order TT-2024-001', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'CR011'), 'sale', -1, 80, 79, 'Order TT-2024-001', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'SKR012'), 'sale', -2, 65, 63, 'Order TT-2024-002', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'MM002'), 'sale', -2, 45, 43, 'Order TT-2024-003', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM products WHERE sku = 'CHR013'), 'sale', -1, 55, 54, 'Order TT-2024-004', (SELECT id FROM profiles LIMIT 1));

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
((SELECT id FROM profiles LIMIT 1), 'low_stock', 'Low Stock Alert', 'Tropical Paradise shake is running low (28 units remaining)', false),
((SELECT id FROM profiles LIMIT 1), 'order_update', 'New Order', 'Order TT-2024-010 has been placed for ₱720', false),
((SELECT id FROM profiles LIMIT 1), 'low_stock', 'Stock Warning', 'Korean BBQ Wrap stock is below minimum level', false),
((SELECT id FROM profiles LIMIT 1), 'order_update', 'Order Fulfilled', 'Order TT-2024-008 has been completed and ready for pickup', true),
((SELECT id FROM profiles LIMIT 1), 'system', 'Daily Report', 'Today sales total: ₱4,505 from 10 orders', true),
((SELECT id FROM profiles LIMIT 1), 'low_stock', 'Restock Needed', 'Matcha Green Tea Latte needs immediate restocking (25 units)', false),
((SELECT id FROM profiles LIMIT 1), 'order_update', 'Order Cancelled', 'Order TT-2024-007 was cancelled by customer', true),
((SELECT id FROM profiles LIMIT 1), 'system', 'Peak Hours Alert', 'Lunch rush starting - prepare for high volume orders', false),
((SELECT id FROM profiles LIMIT 1), 'order_update', 'Processing Order', 'Order TT-2024-006 is being prepared for delivery', false),
((SELECT id FROM profiles LIMIT 1), 'system', 'Kitchen Update', 'Korean Fried Chicken prep time increased due to high demand', true);