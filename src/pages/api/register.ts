import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const event_slug = formData.get("event_slug");
    const name = formData.get("name");
    const email = formData.get("email");
    const companionship = formData.get("companionship");
    const lang = formData.get("lang");

    // GDPR Consent Tracking Fields
    const consent_version = formData.get("consent_version");
    const consent_hash = formData.get("consent_hash");
    const consent_date = formData.get("consent_date");

    if (
      !event_slug ||
      !name ||
      !email ||
      !companionship ||
      !consent_version ||
      !consent_hash
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields." }),
        { status: 400 }
      );
    }

    const { error } = await supabase.from("event_registrations").insert([
      {
        event_slug,
        name,
        email,
        companionship,
        lang,
        consent_version,
        consent_hash,
        consent_date,
      },
    ]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500 }
    );
  }
};
