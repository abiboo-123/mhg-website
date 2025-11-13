import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// ✅ Keep your structure
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const { id: eventId } = params;

  if (!eventId) {
    return new Response("Missing event ID", { status: 400 });
  }

  // ✅ Auth check
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Parse request
  const body = await request.json();
  const { order } = body;

  if (!Array.isArray(order)) {
    return new Response("Invalid request body", { status: 400 });
  }

  // ---------- Fetch BEFORE state for audit ----------
  const { data: beforeData } = await supabase
    .from("event_media")
    .select("id, position")
    .eq("event_id", eventId)
    .eq("is_deleted", false);

  // ---------- Apply updates ----------
  const updates = order.map((o) =>
    supabase
      .from("event_media")
      .update({ position: o.position })
      .eq("id", o.id)
      .eq("event_id", eventId)
  );

  await Promise.all(updates);

  // ---------- Fetch AFTER state ----------
  const { data: afterData } = await supabase
    .from("event_media")
    .select("id, position")
    .eq("event_id", eventId)
    .eq("is_deleted", false);

  // ---------- Audit Log ----------
  await logAudit({
    actor_user_id,
    action: "reorder_media",
    entity: "event_media",
    entity_id: eventId,
    diff: {
      before: beforeData ?? [],
      after: afterData ?? [],
    },
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
