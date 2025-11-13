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

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id: eventId } = params;
  if (!eventId) return new Response("Missing event ID", { status: 400 });

  // -------------------------------------------------------
  // 🔐 Auth required
  // -------------------------------------------------------
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // -------------------------------------------------------
    // 1️⃣ Fetch event (for banner info)
    // -------------------------------------------------------
    const { data: event } = await supabase
      .from("events")
      .select("id, banner_public_id")
      .eq("id", eventId)
      .maybeSingle();

    // -------------------------------------------------------
    // 2️⃣ Delete banner
    // -------------------------------------------------------
    const deletedBanner = event?.banner_public_id ?? null;

    if (deletedBanner) {
      try {
        await imagekit.deleteFile(deletedBanner);
      } catch (e) {
        console.warn("Banner deletion failed:", e);
      }
    }

    // -------------------------------------------------------
    // 3️⃣ Delete card images from translations
    // -------------------------------------------------------
    const { data: translations } = await supabase
      .from("event_translations")
      .select("id, lang, card_image_public_id")
      .eq("event_id", eventId);

    const deletedCards: any[] = [];

    if (translations?.length) {
      for (const t of translations) {
        if (t.card_image_public_id) {
          try {
            await imagekit.deleteFile(t.card_image_public_id);
            deletedCards.push({
              translation_id: t.id,
              lang: t.lang,
              card_image_public_id: t.card_image_public_id,
            });
          } catch (e) {
            console.warn("Card image deletion failed:", e);
          }
        }
      }
    }

    // -------------------------------------------------------
    // 4️⃣ Delete gallery media
    // -------------------------------------------------------
    const { data: media } = await supabase
      .from("event_media")
      .select("id, public_id")
      .eq("event_id", eventId)
      .eq("is_deleted", false);

    const deletedMedia: any[] = [];

    if (media?.length) {
      for (const m of media) {
        try {
          await imagekit.deleteFile(m.public_id);
          deletedMedia.push({
            media_id: m.id,
            public_id: m.public_id,
          });
        } catch (e) {
          console.warn("Gallery deletion failed:", e);
        }
      }
    }

    // -------------------------------------------------------
    // 5️⃣ Delete event from database (cascade handles children)
    // -------------------------------------------------------
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (deleteError) throw deleteError;

    // -------------------------------------------------------
    // 📝 6️⃣ AUDIT LOG
    // -------------------------------------------------------
    await logAudit({
      actor_user_id,
      action: "delete_event",
      entity: "event",
      entity_id: eventId,
      diff: {
        banner_deleted: deletedBanner,
        card_images_deleted: deletedCards,
        gallery_deleted: deletedMedia,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error deleting event:", err);
    return new Response(err.message, { status: 500 });
  }
};
