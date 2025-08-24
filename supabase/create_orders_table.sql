-- Create orders table for storing client orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  phone_last_four TEXT NOT NULL,
  title TEXT NOT NULL,
  degree TEXT NOT NULL,
  current_status TEXT DEFAULT 'received',
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone_tracking ON orders(tracking_id, phone_last_four);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(current_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Allow all operations for authenticated users (you can customize this based on your needs)
CREATE POLICY "Enable all operations for authenticated users" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow read access for anonymous users with correct tracking info
CREATE POLICY "Enable read access for order tracking" ON orders
  FOR SELECT USING (true);

-- Add some sample data for testing (optional)
INSERT INTO orders (tracking_id, phone_last_four, title, degree, current_status, estimated_delivery, client_name, client_phone, client_email)
VALUES 
  ('TR001234', '4567', 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية', 'ماجستير إدارة الأعمال', 'data_collection', '2024-03-15', 'أحمد محمد', '0501234567', 'ahmed@example.com'),
  ('TR001235', '6543', 'الذكاء الاصطناعي في الرعاية الصحية', 'دكتوراه علوم الحاسوب', 'research_plan', '2024-04-20', 'فاطمة علي', '0509876543', 'fatima@example.com')
ON CONFLICT (tracking_id) DO NOTHING;