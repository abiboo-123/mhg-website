import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const lang = formData.get("lang");

  // GDPR Consent Tracking Fields
  const consent_version = formData.get("consent_version");
  const consent_hash = formData.get("consent_hash");
  const consent_date = formData.get("consent_date");

  if (!name || !email || !message || !consent_version || !consent_hash) {
    return new Response(
      JSON.stringify({ success: false, message: "Missing required fields." }),
      { status: 400 }
    );
  }
  const { error } = await supabase.from("contact_messages").insert([
    {
      name,
      email,
      message,
      lang,
      consent_version,
      consent_hash,
    },
  ]);

  if (error)
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
    });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
