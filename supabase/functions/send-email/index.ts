import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject?: string;
  content?: string;
  template_key?: string;
  variables?: Record<string, string>;
  trigger_type?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      subject,
      content,
      template_key,
      variables = {},
      trigger_type
    }: EmailRequest = await req.json();
    
    console.log("Email request received:", { to, subject, template_key, trigger_type });

    let emailSubject = subject;
    let emailContent = content;
    let templateUsed = template_key;

    // إذا كان هناك trigger_type، ابحث عن رد تلقائي
    if (trigger_type && !template_key) {
      console.log("Looking for auto reply for trigger:", trigger_type);
      
      const { data: autoReply } = await supabase
        .from('auto_replies')
        .select(`
          template_id,
          email_templates (
            id,
            subject,
            content,
            variables
          )
        `)
        .eq('trigger_type', trigger_type)
        .eq('is_active', true)
        .single();

      if (autoReply?.email_templates) {
        templateUsed = autoReply.template_id;
        emailSubject = autoReply.email_templates.subject;
        emailContent = autoReply.email_templates.content;
        console.log("Auto reply template found:", templateUsed);
      }
    }

    // إذا كان هناك template_key، احصل على القالب
    if (template_key && !emailSubject && !emailContent) {
      console.log("Fetching template:", template_key);
      
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('template_key', template_key)
        .eq('is_active', true)
        .single();

      if (template) {
        emailSubject = template.subject_template;
        emailContent = template.html_template;
        templateUsed = template.id;
        console.log("Template found:", template.template_key);
      }
    }

    if (!emailSubject || !emailContent) {
      console.error("No subject or content found");
      return new Response(
        JSON.stringify({ error: "لم يتم العثور على موضوع أو محتوى البريد الإلكتروني" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // استبدال المتغيرات في الموضوع والمحتوى
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      emailSubject = emailSubject.replace(new RegExp(placeholder, 'g'), value);
      emailContent = emailContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // إرسال البريد الإلكتروني
    console.log("Sending email to:", to);
    
    const emailResponse = await resend.emails.send({
      from: "ماستر التعليمي <info@masteredupath.com>",
      to: Array.isArray(to) ? to : [to],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // تسجيل البريد في قاعدة البيانات
    const recipients = Array.isArray(to) ? to : [to];
    
    for (const recipient of recipients) {
      await supabase
        .from('email_outbox')  // نستخدم email_outbox بدلاً من email_logs
        .insert({
          recipient_email: recipient,
          sender_email: 'info@masteredupath.com',
          subject: emailSubject,
          content: emailContent,
          template_id: templateUsed,
          status: emailResponse.error ? 'failed' : 'sent',
          error_message: emailResponse.error?.message,
          metadata: { resend_id: emailResponse.data?.id, variables },
          sent_at: new Date().toISOString()
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال البريد الإلكتروني بنجاح",
        data: emailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);