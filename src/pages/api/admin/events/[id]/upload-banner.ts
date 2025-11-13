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

export const POST: APIRoute = async ({ request, params, locals }) => {
  try {
    const { id } = params;
    if (!id) return new Response("Missing event ID", { status: 400 });

    // ✅ Ensure authenticated user exists
    const actor_user_id = getActorUserId(locals);
    if (!actor_user_id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return new Response("No file provided", { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // --- Upload to ImageKit ---
    const uploadRes = await imagekit.upload({
      file: buffer,
      fileName: `banner-${id}.jpg`,
      folder: `/event-banners/${id}`,
    });

    // --- Update Supabase event ---
    const { data: updated, error } = await supabase
      .from("events")
      .update({
        banner_url: uploadRes.url,
        banner_public_id: uploadRes.fileId,
        banner_uploaded: true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // --- Audit Log ---
    await logAudit({
      actor_user_id,
      action: "upload_banner",
      entity: "event_banner", // 🟦 Better entity name
      entity_id: id,
      diff: {
        banner_url: uploadRes.url,
        banner_public_id: uploadRes.fileId,
      },
    });

    return new Response(JSON.stringify({ url: uploadRes.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("Banner upload error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
};
