import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";
import { getActorUserId } from "../../../../utils/auth";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!;
const supabaseAdminKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAdminKey);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const actor_user_id = getActorUserId(locals);
    if (!actor_user_id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      slug,
      date,
      time,
      location,
      available = false,
      highlighted = false,
      is_past = false,
      attendance = 0,
      speakers = [],
      translation,
    } = body;

    if (!slug || !date || !time || !location || !translation) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Insert base event
    const { data: eventData, error: eventErr } = await supabase
      .from("events")
      .insert([
        {
          slug,
          date,
          time,
          location,
          available,
          highlighted,
          is_past,
          attendance,
          speakers,
        },
      ])
      .select(
        "id, slug, date, time, location, available, highlighted, is_past, attendance, speakers"
      )
      .single();

    if (eventErr) {
      console.error("Event insert error:", eventErr);
      return new Response("Failed to insert event", { status: 500 });
    }

    const eventId = eventData.id;

    // Audit log for event creation
    await logAudit({
      actor_user_id,
      action: "create",
      entity: "event",
      entity_id: eventId,
      diff: eventData, // full snapshot
    });

    // Insert EN translation
    const { data: transData, error: transErr } = await supabase
      .from("event_translations")
      .insert([
        {
          event_id: eventId,
          lang: "en",
          title: translation.title,
          description: translation.description,
          tags: translation.tags,
        },
      ])
      .select("*")
      .single();

    if (transErr) {
      console.error("Translation insert error:", transErr);
      return new Response("Failed to insert translation", { status: 500 });
    }

    // Audit log for translation creation
    await logAudit({
      actor_user_id,
      action: "create",
      entity: "event_translation",
      entity_id: transData.id,
      diff: transData,
    });

    return new Response(JSON.stringify({ id: eventId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response("Internal server error", { status: 500 });
  }
};
