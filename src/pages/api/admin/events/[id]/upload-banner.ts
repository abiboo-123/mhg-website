import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";

// ✅ Keep your imports as you added
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

export const prerender = false;

// --- Supabase Client ---
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- ImageKit Client ---
const imagekit = new ImageKit({
  publicKey: import.meta.env.PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: import.meta.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;

  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const { url, public_id } = body;

  if (!url || !public_id)
    return new Response("Missing metadata", { status: 400 });

  const { data, error } = await supabase
    .from("events")
    .update({
      banner_url: url,
      banner_public_id: public_id,
      banner_uploaded: true,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logAudit({
    actor_user_id,
    action: "upload_banner",
    entity: "event_banner",
    entity_id: id!,
    diff: { url, public_id },
  });

  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" },
  });
};
