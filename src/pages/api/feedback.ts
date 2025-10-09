import { createClient } from "@supabase/supabase-js";
export const prerender = false;
import type { APIRoute } from "astro";

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const { error } = await supabase.from("event_feedback").insert([data]);

  if (error)
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
    });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
