import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";
import { logAudit } from "../../../../../lib/audit";
import { getActorUserId } from "../../../../../utils/auth";

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

// --- Config ---
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 10;

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { id: eventId } = params;
    if (!eventId) return new Response("Missing event ID", { status: 400 });

    const actor_user_id = getActorUserId(locals);
    if (!actor_user_id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    if (!files.length)
      return new Response("No files uploaded", { status: 400 });

    if (files.length > MAX_FILES)
      return new Response(`You can upload up to ${MAX_FILES} files.`, {
        status: 400,
      });

    // Validate file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return new Response(`File "${file.name}" exceeds the 25 MB limit.`, {
          status: 400,
        });
      }
    }

    // Count existing media items for position ordering
    const { count } = await supabase
      .from("event_media")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    const results: any[] = [];

    // Upload each file
    for (const [i, file] of files.entries()) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // --- Detect video vs image ---
      const name = file.name.toLowerCase();
      const mime = file.type || "";
      const isVideo = mime.startsWith("video/");
      console.log(
        `Uploading "${file.name}" as ${
          isVideo ? "video" : "image"
        }, mime: ${mime}`
      );
      // --- Upload to ImageKit ---
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: `/event-gallery/${eventId}`,
        useUniqueFileName: true,
        tags: [isVideo ? "video" : "image"],
      });

      // --- Save metadata in Supabase ---
      const { data: inserted, error } = await supabase
        .from("event_media")
        .insert([
          {
            event_id: eventId,
            type: isVideo ? "video" : "image",
            public_id: uploadResponse.fileId,
            url: uploadResponse.url,
            width: uploadResponse.width ?? null,
            height: uploadResponse.height ?? null,
            bytes: uploadResponse.size ?? null,
            position: (count ?? 0) + i,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      results.push(inserted);
    }

    await logAudit({
      actor_user_id,
      action: "upload_media",
      entity: "event_media",
      entity_id: eventId,
      diff: { created: results },
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Upload failed" }),
      { status: 500 }
    );
  }
};
