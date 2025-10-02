import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { ClientEmail } from './_templates/client-email.tsx';
import { AdminEmail } from './_templates/admin-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
    const requestData: PartnershipRequest = await req.json();
    
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
      from: 'Partnership System <system@masteredupath.com>',
      to: ['admin@masteredupath.com'], // Replace with actual admin email
      subject: `🔔 طلب شراكة جديد من ${requestData.institutionName}`,
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