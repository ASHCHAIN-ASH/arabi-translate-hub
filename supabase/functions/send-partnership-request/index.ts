import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { ClientEmail } from './_templates/client-email.tsx';
import { AdminEmail } from './_templates/admin-email.tsx';
import { createClient } from "npm:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartnershipRequest {
  institutionName: string;
  institutionType: string;
  contactPerson: string;
  email: string;
  phone: string;
  position: string;
  selectedPackage: string;
  employeesCount: string;
  expectedServices: string;
  additionalNotes?: string;
  submittedAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const requestData: PartnershipRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.contactPerson || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@masteredupath.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`طلب شراكة - ${data.institutionName || ''} - ${data.selectedPackage || ''}`).toString().slice(0, 300),
        message: (data.additionalNotes || `${data.institutionName} (${data.institutionType}) - باقة ${data.selectedPackage} - ${data.employeesCount} موظف` || "").toString().slice(0, 8000),
        form_type: "partnership_request",
        service_type: 'partnership',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { institution_name: data.institutionName, institution_type: data.institutionType, position: data.position, selected_package: data.selectedPackage, employees_count: data.employeesCount, expected_services: data.expectedServices },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

    
    console.log('Processing partnership request for:', requestData.institutionName);

    // Render client email
    const clientHtml = await renderAsync(
      React.createElement(ClientEmail, {
        institutionName: requestData.institutionName,
        contactPerson: requestData.contactPerson,
        selectedPackage: requestData.selectedPackage,
      })
    );

    // Render admin email
    const adminHtml = await renderAsync(
      React.createElement(AdminEmail, requestData)
    );

    // Send email to client
    const clientEmailResult = await resend.emails.send({
      from: 'Master Edu Path <partnerships@masteredupath.com>',
      to: [requestData.email],
      subject: 'شكراً لاهتمامك بالشراكة المؤسسية معنا 🎓',
      html: clientHtml,
    });

    if (clientEmailResult.error) {
      console.error('Error sending client email:', clientEmailResult.error);
      throw clientEmailResult.error;
    }

    console.log('Client email sent successfully:', clientEmailResult.data?.id);

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: 'Partnership System <partnerships@masteredupath.com>',
      to: ['info@masteredupath.com'],
      subject: `🔔 طلب شراكة مؤسسية عاجل من ${requestData.institutionName}`,
      html: adminHtml,
      replyTo: requestData.email,
    });

    if (adminEmailResult.error) {
      console.error('Error sending admin email:', adminEmailResult.error);
      throw adminEmailResult.error;
    }

    console.log('Admin email sent successfully:', adminEmailResult.data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Partnership request submitted successfully',
        clientEmailId: clientEmailResult.data?.id,
        adminEmailId: adminEmailResult.data?.id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-partnership-request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});