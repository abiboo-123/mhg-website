import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ params, request }) => {
  const { id } = params;
  let ip =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Vercel may send multiple IPs like "1.2.3.4, 5.6.7.8"
  if (ip.includes(",")) ip = ip.split(",")[0].trim();

  if (ip === "unknown") {
    // fallback for local dev
    ip = "local-dev";
  }

  const { data: existing } = await supabase
    .from("image_likes")
    .select("*")
    .eq("image_id", id)
    .eq("ip_address", ip)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ message: "already_liked" }), {
      status: 200,
    });
  }

  await supabase.from("image_likes").insert({ image_id: id, ip_address: ip });

  const { data: image } = await supabase
    .from("images")
    .select("like_count")
    .eq("id", id)
    .single();

  if (image) {
    await supabase
      .from("images")
      .update({ like_count: image.like_count + 1 })
      .eq("id", id);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
