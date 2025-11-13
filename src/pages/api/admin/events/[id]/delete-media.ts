import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";

// ✅ Keep your structure
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

const imagekit = new ImageKit({
  publicKey: import.meta.env.PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: import.meta.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const { id: eventId } = params;
  const { mediaId } = await request.json();

  if (!eventId || !mediaId)
    return new Response("Missing data", { status: 400 });

  // ------------------------------------------
  // 🔐 Auth required
  // ------------------------------------------
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ------------------------------------------
  // 1️⃣ Fetch media BEFORE deletion (for audit)
  // ------------------------------------------
  const { data: media, error: fetchError } = await supabase
    .from("event_media")
    .select("*")
    .eq("id", mediaId)
    .single();

  if (fetchError || !media)
    return new Response("Media not found", { status: 404 });

  // ------------------------------------------
  // 2️⃣ Delete from ImageKit
  // ------------------------------------------
  if (media.public_id) {
    try {
      await imagekit.deleteFile(media.public_id);
    } catch (e) {
      console.warn("ImageKit deletion failed (possibly already deleted):", e);
    }
  }

  // ------------------------------------------
  // 3️⃣ Soft delete in DB
  // ------------------------------------------
  const { error: deleteError } = await supabase
    .from("event_media")
    .update({ is_deleted: true })
    .eq("id", mediaId);

  if (deleteError) throw deleteError;

  // ------------------------------------------
  // 📝 4️⃣ AUDIT LOG — record deleted media
  // ------------------------------------------
  await logAudit({
    actor_user_id,
    action: "delete_media",
    entity: "event_media",
    entity_id: eventId,
    diff: {
      deleted_media: {
        id: media.id,
        type: media.type,
        public_id: media.public_id,
        url: media.url,
        position: media.position,
      },
    },
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
