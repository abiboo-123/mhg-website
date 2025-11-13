import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const event_slug = formData.get("event_slug");
    const lang = formData.get("lang");
    const satisfaction_overall = Number(formData.get("satisfaction_overall"));
    const satisfaction_org = Number(formData.get("satisfaction_org"));
    const interest_topic = Number(formData.get("interest_topic"));
    const speaker_quality = Number(formData.get("speaker_quality"));
    const discovery_source = formData.get("discovery_source");
    const discovery_other = formData.get("discovery_other") || null;
    const improvement_suggestions =
      formData.get("improvement_suggestions") || null;
    const overall_feedback = formData.get("overall_feedback") || null;
    const name = formData.get("name") || null;
    const email = formData.get("email") || null;
    const phone = formData.get("phone") || null;

    // GDPR Required Fields
    const consent_version = formData.get("consent_version");
    const consent_hash = formData.get("consent_hash");
    const consent_date = formData.get("consent_date");

    // ✅ Validation
    if (
      !event_slug ||
      !satisfaction_overall ||
      !consent_version ||
      !consent_hash
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields." }),
        { status: 400 }
      );
    }

    const insertData = {
      event_slug,
      satisfaction_overall,
      satisfaction_org,
      interest_topic,
      speaker_quality,
      discovery_source,
      discovery_other,
      improvement_suggestions,
      overall_feedback,
      name,
      email,
      phone,
      lang,
      consent_version,
      consent_hash,
      consent_date,
    };

    const { error } = await supabase
      .from("event_feedback")
      .insert([insertData]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500 }
    );
  }
};
