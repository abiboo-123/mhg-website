import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET: APIRoute = async ({ params, request }) => {
  const eventId = params.id;
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") ?? "en";

  if (!eventId) {
    return new Response(JSON.stringify({ error: "Missing event ID" }), {
      status: 400,
    });
  }

  console.log("Fetching translation for event:", eventId, "lang:", lang);

  const { data, error } = await sb
    .from("event_translations")
    .select("title, description, tags")
    .eq("event_id", eventId)
    .eq("lang", lang)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "No translation found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};
