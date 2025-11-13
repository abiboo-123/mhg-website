import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";

export const prerender = false;

// ✅ Keep your imports
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

export const DELETE: APIRoute = async ({ request, params, locals }) => {
  const id = params.id;
  if (!id) return new Response("Missing event ID", { status: 400 });

  // -----------------------------------------------------
  // 🔐 Auth Required
  // -----------------------------------------------------
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    console.log(
      "Unauthorized attempt to delete event banner",
      actor_user_id,
      locals
    );
    console.log("Cookies received?", request.headers.get("cookie"));
    return new Response("Unauthorized", { status: 401 });
  }

  // -----------------------------------------------------
  // 1️⃣ Fetch existing banner
  // -----------------------------------------------------
  const { data: event } = await supabase
    .from("events")
    .select("banner_public_id, banner_url")
    .eq("id", id)
    .single();

  if (!event?.banner_public_id) {
    return new Response("No banner found", { status: 404 });
  }

  const old_public_id = event.banner_public_id;
  const old_url = event.banner_url;

  // -----------------------------------------------------
  // 2️⃣ Delete the file from ImageKit
  // -----------------------------------------------------
  try {
    await imagekit.deleteFile(old_public_id);
  } catch (e) {
    console.warn("Banner deletion failed (maybe already removed):", e);
  }

  // -----------------------------------------------------
  // 3️⃣ Update DB – remove banner metadata
  // -----------------------------------------------------
  await supabase
    .from("events")
    .update({
      banner_url: null,
      banner_public_id: null,
      banner_uploaded: false,
    })
    .eq("id", id);

  // -----------------------------------------------------
  // 📝 4️⃣ Audit Log
  // -----------------------------------------------------
  await logAudit({
    actor_user_id,
    action: "delete_banner",
    entity: "event_banner",
    entity_id: id,
    diff: {
      deleted_banner: {
        public_id: old_public_id,
        url: old_url,
      },
    },
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
