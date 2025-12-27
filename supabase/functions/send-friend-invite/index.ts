import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendInviteRequest {
  invitee_email: string;
  invitee_name: string;
  inviter_name: string;
  circle_tier: 'core' | 'inner' | 'outer';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { invitee_email, invitee_name, inviter_name, circle_tier }: SendInviteRequest = await req.json();

    console.log(`Sending invitation from ${inviter_name} to ${invitee_email}`);

    // Determine tier description for the email
    const tierDescriptions: Record<string, string> = {
      core: "closest inner circle (top 5 friends)",
      inner: "close friends circle (top 15 friends)",
      outer: "meaningful connections (top 150 friends)",
    };
    const tierDescription = tierDescriptions[circle_tier] || "friends";

    // Send the invitation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "InnerFriend <onboarding@resend.dev>",
      to: [invitee_email],
      subject: `${inviter_name} added you to their ${tierDescription}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You've been added as a friend!</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🤝 You've Been Added!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; margin-bottom: 20px;">
              Hi ${invitee_name}!
            </p>
            
            <p style="margin-bottom: 20px;">
              <strong>${inviter_name}</strong> has added you to their <strong>${tierDescription}</strong> on InnerFriend!
            </p>
            
            <p style="margin-bottom: 25px;">
              InnerFriend helps people nurture their closest relationships based on Dunbar's research on meaningful friendships. When you join and add your contact info, you'll automatically be connected to ${inviter_name} and can see each other's posts.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SITE_URL") || "https://innerfriend.app"}/auth" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Join InnerFriend
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Already have an account? Just make sure your email (${invitee_email}) is added to your contact methods, and you'll be automatically connected!
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            If you didn't expect this email, you can safely ignore it.
          </p>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send invitation email", details: emailError }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", emailData);

    // Mark the invitation as sent in pending_invitations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin
      .from("pending_invitations")
      .update({ invitation_sent_at: new Date().toISOString() })
      .eq("inviter_id", user.id)
      .eq("invitee_email", invitee_email)
      .is("invitation_sent_at", null);

    return new Response(
      JSON.stringify({ success: true, message: "Invitation sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in send-friend-invite function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
