import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// ✅ Keep your structure
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

const sb = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST: APIRoute = async ({ params, request, locals }) => {
  const eventId = params.id;

  // -----------------------------------------------------
  // 🔐 Auth Required
  // -----------------------------------------------------
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { lang, title, description, tags } = await request.json();

  console.log("Incoming translation request:", { eventId, lang, title });

  if (!eventId || !lang || !title || !description) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // -----------------------------------------------------
  // 1️⃣ Check if translation exists
  // -----------------------------------------------------
  const { data: existing } = await sb
    .from("event_translations")
    .select("id")
    .eq("event_id", eventId)
    .eq("lang", lang)
    .maybeSingle();

  if (existing) {
    return new Response(
      JSON.stringify({ error: "Translation already exists" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  // -----------------------------------------------------
  // 2️⃣ Insert translation
  // -----------------------------------------------------
  const { data: inserted, error } = await sb
    .from("event_translations")
    .insert([{ event_id: eventId, lang, title, description, tags }])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // -----------------------------------------------------
  // 📝 3️⃣ Audit Log
  // -----------------------------------------------------
  await logAudit({
    actor_user_id,
    action: "create_translation",
    entity: "event_translation",
    entity_id: inserted.id,
    diff: {
      created: inserted,
    },
  });

  return new Response(JSON.stringify({ success: true, id: inserted.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
