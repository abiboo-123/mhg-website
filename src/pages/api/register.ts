import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const event_slug = formData.get("event");
  const name = formData.get("name");
  const email = formData.get("email");
  const companionship = formData.get("companionship");
  const gender = formData.get("gender");
  const lang = formData.get("lang");

  const { error } = await supabase
    .from("event_registrations")
    .insert([{ event_slug, name, email, companionship, gender, lang }]);

  if (error)
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
    });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
