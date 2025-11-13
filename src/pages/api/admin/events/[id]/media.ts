import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ GET all non-deleted media for event
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response("Missing event ID", { status: 400 });

  const { data, error } = await supabase
    .from("event_media")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Media fetch error:", error);
    return new Response("Error fetching media", { status: 500 });
  }

  // filter deleted if column exists
  const active = data?.filter((m: any) => !m.is_deleted);
  return new Response(JSON.stringify(active ?? []), {
    headers: { "Content-Type": "application/json" },
  });
};
