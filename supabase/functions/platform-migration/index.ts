import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationStatus {
  users: number;
  services: number;
  orders: number;
  categories: number;
  errors: string[];
  warnings: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Authenticate user (admin only)
    const authHeader = req.headers.get('authorization');
    let currentUser = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = JSON.parse(atob(token));
        if (payload.exp > Date.now()) {
          const { data: user } = await supabase
            .from('platform_users')
            .select('id, role, status')
            .eq('id', payload.sub)
            .eq('status', 'active')
            .single();
          currentUser = user;
        }
      } catch (e) {
        console.log('Invalid token:', e);
      }
    }

    if (!currentUser || currentUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'مطلوب صلاحيات الإدارة' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { operation } = await req.json();

    switch (operation) {
      case 'migrate':
        return await handleMigration(supabase);
      case 'status':
        return await handleMigrationStatus(supabase);
      case 'seed':
        return await handleSeedData(supabase);
      default:
        return new Response(JSON.stringify({ error: 'عملية غير صحيحة' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function handleMigration(supabase: any): Promise<Response> {
  const status: MigrationStatus = {
    users: 0,
    services: 0,
    orders: 0,
    categories: 0,
    errors: [],
    warnings: []
  };

  try {
    // Check if migration has already been run
    const { data: existingMigration } = await supabase
      .from('platform_legacy_mappings')
      .select('id')
      .limit(1);

    if (existingMigration && existingMigration.length > 0) {
      status.warnings.push('Migration has already been performed. Use status operation to check current state.');
      return new Response(JSON.stringify({ status }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Step 1: Migrate Categories
    console.log('Starting categories migration...');
    try {
      // Create default categories for testing
      const defaultCategories = [
        {
          name_ar: 'التسويق الرقمي',
          name_en: 'Digital Marketing',
          slug: 'digital-marketing',
          description_ar: 'خدمات التسويق الرقمي والإعلان',
          description_en: 'Digital marketing and advertising services',
          is_active: true,
          sort_order: 1
        },
        {
          name_ar: 'تحسين محركات البحث',
          name_en: 'SEO',
          slug: 'seo',
          description_ar: 'خدمات تحسين محركات البحث',
          description_en: 'Search Engine Optimization services',
          is_active: true,
          sort_order: 2
        },
        {
          name_ar: 'التطوير والبرمجة',
          name_en: 'Development & Programming',
          slug: 'development',
          description_ar: 'خدمات التطوير والبرمجة',
          description_en: 'Development and programming services',
          is_active: true,
          sort_order: 3
        }
      ];

      for (const category of defaultCategories) {
        const { data: newCategory, error } = await supabase
          .from('platform_categories')
          .insert(category)
          .select()
          .single();

        if (error) {
          console.error('Error creating category:', error);
          status.errors.push(`Failed to create category ${category.name_ar}: ${error.message}`);
        } else {
          status.categories++;
          console.log(`Created category: ${category.name_ar}`);
        }
      }
    } catch (error: any) {
      status.errors.push(`Categories migration failed: ${error.message}`);
    }

    // Step 2: Migrate Services  
    console.log('Starting services migration...');
    try {
      // Get first category for default assignment
      const { data: firstCategory } = await supabase
        .from('platform_categories')
        .select('id')
        .limit(1)
        .single();

      // Create default services for testing
      const defaultServices = [
        {
          category_id: firstCategory?.id,
          name_ar: 'إدارة الحملات الإعلانية',
          name_en: 'Advertising Campaign Management',
          slug: 'ad-campaign-management',
          description_ar: 'إدارة شاملة للحملات الإعلانية على منصات التواصل الاجتماعي',
          description_en: 'Comprehensive management of advertising campaigns on social media platforms',
          price: 1500.00,
          unit_type: 'service',
          delivery_days: 14,
          is_active: true,
          show_to_clients: true,
          features_ar: ['تحليل الجمهور المستهدف', 'إنشاء المحتوى الإعلاني', 'تقارير الأداء'],
          features_en: ['Target audience analysis', 'Ad content creation', 'Performance reports']
        },
        {
          category_id: firstCategory?.id,
          name_ar: 'تحسين السيو المتقدم',
          name_en: 'Advanced SEO Optimization',
          slug: 'advanced-seo',
          description_ar: 'تحسين موقعك الإلكتروني لمحركات البحث بتقنيات متقدمة',
          description_en: 'Optimize your website for search engines with advanced techniques',
          price: 1200.00,
          unit_type: 'service',
          delivery_days: 21,
          is_active: true,
          show_to_clients: true,
          features_ar: ['بحث الكلمات المفتاحية', 'تحسين المحتوى', 'بناء الروابط'],
          features_en: ['Keyword research', 'Content optimization', 'Link building']
        }
      ];

      for (const service of defaultServices) {
        const { data: newService, error } = await supabase
          .from('platform_services')
          .insert(service)
          .select()
          .single();

        if (error) {
          console.error('Error creating service:', error);
          status.errors.push(`Failed to create service ${service.name_ar}: ${error.message}`);
        } else {
          status.services++;
          console.log(`Created service: ${service.name_ar}`);
        }
      }
    } catch (error: any) {
      status.errors.push(`Services migration failed: ${error.message}`);
    }

    // Step 3: Create admin user if doesn't exist
    console.log('Checking admin user...');
    try {
      const { data: adminUser } = await supabase
        .from('platform_users')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();

      if (!adminUser) {
        // Create default admin user
        const { data: newAdmin, error } = await supabase
          .from('platform_users')
          .insert({
            email: 'admin@masteredupath.com',
            email_normalized: 'admin@masteredupath.com',
            full_name: 'مدير النظام',
            role: 'admin',
            status: 'active',
            password_hash: '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2', // Ali@@#@@1409
            email_verified: true
          })
          .select()
          .single();

        if (error) {
          status.errors.push(`Failed to create admin user: ${error.message}`);
        } else {
          status.users++;
          console.log('Created admin user');
        }
      } else {
        console.log('Admin user already exists');
      }
    } catch (error: any) {
      status.errors.push(`Admin user setup failed: ${error.message}`);
    }

    // Step 4: Create sample customer for testing
    console.log('Creating sample customer...');
    try {
      const { data: sampleCustomer, error } = await supabase
        .from('platform_users')
        .insert({
          email: 'customer@example.com',
          email_normalized: 'customer@example.com',
          full_name: 'عميل تجريبي',
          phone: '0500000000',
          role: 'customer',
          status: 'active',
          password_hash: '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2', // Ali@@#@@1409
          email_verified: true
        })
        .select()
        .single();

      if (error) {
        if (error.code !== '23505') { // Not a unique constraint violation
          status.errors.push(`Failed to create sample customer: ${error.message}`);
        }
      } else {
        status.users++;
        console.log('Created sample customer');
      }
    } catch (error: any) {
      status.errors.push(`Sample customer creation failed: ${error.message}`);
    }

    console.log('Migration completed!');
    return new Response(JSON.stringify({
      success: true,
      message: 'تم تنفيذ الترحيل بنجاح',
      status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    status.errors.push(`General migration error: ${error.message}`);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'فشل في تنفيذ الترحيل',
      status
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

async function handleMigrationStatus(supabase: any): Promise<Response> {
  try {
    // Get counts from platform tables
    const [usersCount, servicesCount, ordersCount, categoriesCount] = await Promise.all([
      supabase.from('platform_users').select('id', { count: 'exact', head: true }),
      supabase.from('platform_services').select('id', { count: 'exact', head: true }),
      supabase.from('platform_orders').select('id', { count: 'exact', head: true }),
      supabase.from('platform_categories').select('id', { count: 'exact', head: true })
    ]);

    const status = {
      users: usersCount.count || 0,
      services: servicesCount.count || 0,
      orders: ordersCount.count || 0,
      categories: categoriesCount.count || 0,
      migrated: true
    };

    return new Response(JSON.stringify({ status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

async function handleSeedData(supabase: any): Promise<Response> {
  const status: MigrationStatus = {
    users: 0,
    services: 0,
    orders: 0,
    categories: 0,
    errors: [],
    warnings: []
  };

  try {
    // Add more sample data for testing
    console.log('Seeding additional test data...');

    // Add more categories
    const additionalCategories = [
      {
        name_ar: 'الترجمة والكتابة',
        name_en: 'Translation & Writing',
        slug: 'translation-writing',
        description_ar: 'خدمات الترجمة والكتابة الاحترافية',
        is_active: true,
        sort_order: 4
      },
      {
        name_ar: 'التصميم الجرافيكي',
        name_en: 'Graphic Design',
        slug: 'graphic-design',
        description_ar: 'خدمات التصميم الجرافيكي والبرندنج',
        is_active: true,
        sort_order: 5
      }
    ];

    for (const category of additionalCategories) {
      const { error } = await supabase
        .from('platform_categories')
        .insert(category);

      if (error && error.code !== '23505') {
        status.errors.push(`Failed to seed category: ${error.message}`);
      } else if (!error) {
        status.categories++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'تم إضافة البيانات التجريبية بنجاح',
      status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      message: 'فشل في إضافة البيانات التجريبية',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

serve(handler);