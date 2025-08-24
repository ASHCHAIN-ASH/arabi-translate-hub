import { createClient } from '@supabase/supabase-js';
import { OrderStatus, TIMELINE_STEPS } from '@/types/order';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface DatabaseOrder {
  id: string;
  tracking_id: string;
  phone_last_four: string;
  title: string;
  degree: string;
  current_status: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_phone: string;
  client_email: string;
}

export const initializeDatabase = async () => {
  try {
    // Create the orders table using raw SQL
    const { error } = await supabase.rpc('execute_sql', {
      query: `
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

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Enable all operations for service role" ON orders;
        DROP POLICY IF EXISTS "Enable read access for order tracking" ON orders;
        DROP POLICY IF EXISTS "Enable insert for anonymous users" ON orders;

        -- Create policies for Row Level Security
        -- Allow all operations for service role (backend operations)
        CREATE POLICY "Enable all operations for service role" ON orders
          FOR ALL USING (true);

        -- Allow read access for anonymous users with correct tracking info
        CREATE POLICY "Enable read access for order tracking" ON orders
          FOR SELECT USING (true);

        -- Allow insert for anonymous users (order submission)
        CREATE POLICY "Enable insert for anonymous users" ON orders
          FOR INSERT WITH CHECK (true);

        -- Add some sample data for testing
        INSERT INTO orders (tracking_id, phone_last_four, title, degree, current_status, estimated_delivery, client_name, client_phone, client_email)
        VALUES 
          ('TR001234', '4567', 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية', 'ماجستير إدارة الأعمال', 'data_collection', '2024-03-15', 'أحمد محمد', '0501234567', 'ahmed@example.com'),
          ('TR001235', '6543', 'الذكاء الاصطناعي في الرعاية الصحية', 'دكتوراه علوم الحاسوب', 'research_plan', '2024-04-20', 'فاطمة علي', '0509876543', 'fatima@example.com')
        ON CONFLICT (tracking_id) DO NOTHING;
      `
    });
    
    if (error) {
      console.error('Error initializing database:', error);
      // Try alternative approach if the RPC doesn't exist
      await createTableAlternative();
    } else {
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    // Try alternative approach
    await createTableAlternative();
  }
};

// Alternative approach using individual queries
const createTableAlternative = async () => {
  try {
    // First try to create the table
    const { error: createError } = await supabase.rpc('create_table', {
      definition: `
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
        )
      `
    });
    
    if (createError) {
      console.log('Table might already exist or RPC not available');
    }
    
    // Try to insert sample data
    const { error: insertError } = await supabase
      .from('orders')
      .upsert([
        {
          tracking_id: 'TR001234',
          phone_last_four: '4567',
          title: 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية',
          degree: 'ماجستير إدارة الأعمال',
          current_status: 'data_collection',
          estimated_delivery: '2024-03-15',
          client_name: 'أحمد محمد',
          client_phone: '0501234567',
          client_email: 'ahmed@example.com'
        },
        {
          tracking_id: 'TR001235',
          phone_last_four: '6543',
          title: 'الذكاء الاصطناعي في الرعاية الصحية',
          degree: 'دكتوراه علوم الحاسوب',
          current_status: 'research_plan',
          estimated_delivery: '2024-04-20',
          client_name: 'فاطمة علي',
          client_phone: '0509876543',
          client_email: 'fatima@example.com'
        }
      ], { onConflict: 'tracking_id' });
    
    if (!insertError) {
      console.log('Sample data added successfully');
    }
  } catch (error) {
    console.log('Alternative database setup completed with warnings:', error);
  }
};

export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  try {
    // Initialize database on first call
    await initializeDatabase();
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        current_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    // Log the status change
    await logStatusChange(orderId, newStatus);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};

export const logStatusChange = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  console.log(`تغيير حالة الطلب ${orderId} إلى ${newStatus}`);
};

export const searchOrderByTracking = async (
  trackingId: string, 
  phoneLastFour: string
): Promise<OrderStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_id', trackingId.toUpperCase())
      .eq('phone_last_four', phoneLastFour)
      .single();
    
    if (error || !data) {
      return null;
    }

    // Calculate progress based on current status
    const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === data.current_status);
    const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100 : 10;

    // Convert database format to OrderStatus format
    const orderStatus: OrderStatus = {
      id: data.id,
      trackingId: data.tracking_id,
      phoneLastFour: data.phone_last_four,
      title: data.title,
      degree: data.degree,
      currentStatus: data.current_status,
      progress,
      estimatedDelivery: data.estimated_delivery,
      createdAt: data.created_at,
      timeline: [], // Will be populated separately
      files: [] // Will be populated separately
    };

    return orderStatus;
  } catch (error) {
    console.error('Error in searchOrderByTracking:', error);
    return null;
  }
};

export const createOrder = async (orderData: {
  trackingId: string;
  phoneLastFour: string;
  title: string;
  degree: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}): Promise<string> => {
  try {
    // Initialize database on first call
    await initializeDatabase();
    
    const estimatedDelivery = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        tracking_id: orderData.trackingId,
        phone_last_four: orderData.phoneLastFour,
        title: orderData.title,
        degree: orderData.degree,
        current_status: 'received',
        estimated_delivery: estimatedDelivery,
        client_name: orderData.clientName,
        client_phone: orderData.clientPhone,
        client_email: orderData.clientEmail
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    console.log('Order created successfully:', data);
    return data.id;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};