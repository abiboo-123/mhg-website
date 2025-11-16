import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id: eventId } = params;
  const actor_user_id = getActorUserId(locals);

  if (!actor_user_id) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();

  const { url, public_id, width, height, bytes, type } = body;

  if (!url || !public_id)
    return new Response("Missing metadata", { status: 400 });

  // Get current count for position
  const { count } = await supabase
    .from("event_media")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  // Insert DB row
  const { data, error } = await supabase
    .from("event_media")
    .insert([
      {
        event_id: eventId,
        type: type || "image",
        url,
        public_id,
        width,
        height,
        bytes,
        position: count ?? 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Log
  await logAudit({
    actor_user_id,
    action: "upload_media",
    entity: "event_media",
    entity_id: eventId!,
    diff: data,
  });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
