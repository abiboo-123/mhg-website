import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";
import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// ✅ KEEP YOUR IMPORT STRUCTURE
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

const fontPath = path.resolve("./public/fonts/Inter_28pt-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;

  // ---------------------------------------
  // ✅ Auth Required
  // ---------------------------------------
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { lang } = await request.json().catch(() => ({}));

  // ---------------------------------------
  // Fetch event + translations
  // ---------------------------------------
  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, slug, date, time, location, event_translations(id, lang, title, card_image_public_id)"
    )
    .eq("id", id)
    .single();

  if (error || !event) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const translations = lang
    ? event.event_translations.filter((t: any) => t.lang === lang)
    : event.event_translations;

  const font = [{ name: "Inter", data: fontData, weight: 700 as const }];
  const updated = [];
  const audit_before: any[] = [];
  const audit_after: any[] = [];

  for (const t of translations) {
    if (!t.title) continue;

    const fileName = `event-card-${event.slug}-${t.lang}.png`;

    // ---------------------------------------
    // 🟦 Save BEFORE state for audit log
    // ---------------------------------------
    audit_before.push({
      translation_id: t.id,
      lang: t.lang,
      old_public_id: t.card_image_public_id ?? null,
    });

    // ---------------------------------------
    // Delete old image if exists
    // ---------------------------------------
    if (t.card_image_public_id) {
      try {
        await imagekit.deleteFile(t.card_image_public_id);
      } catch (e: any) {
        console.warn("⚠️ Old file deletion failed", (e as Error).message);
      }
    }

    // ---------------------------------------
    // Generate Card SVG
    // ---------------------------------------
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "800px",
            height: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
            color: "white",
            fontFamily: "Inter",
            textAlign: "center",
            padding: "40px",
            borderRadius: "16px",
          },
          children: [
            {
              type: "h1",
              props: {
                style: {
                  fontSize: t.title.length > 40 ? "32px" : "40px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  maxWidth: "700px",
                  lineHeight: "1.2",
                },
                children: t.title,
              },
            },
            {
              type: "p",
              props: {
                style: { fontSize: "20px", opacity: 0.9, margin: "4px 0" },
                children: event.location || "Location TBD",
              },
            },
            {
              type: "p",
              props: {
                style: { fontSize: "18px", opacity: 0.8 },
                children: event.time
                  ? `${event.date || ""} • ${event.time.slice(0, 5)}`
                  : `${event.date || ""}`,
              },
            },
          ],
        },
      } as any,
      { width: 800, height: 400, fonts: font }
    );

    // ---------------------------------------
    // PNG from SVG
    // ---------------------------------------
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    // ---------------------------------------
    // Upload to ImageKit
    // ---------------------------------------
    const upload = await imagekit.upload({
      file: pngBuffer.toString("base64"),
      fileName,
      folder: "/event-card-image/",
      useUniqueFileName: false,
    });

    // ---------------------------------------
    // Update DB
    // ---------------------------------------
    await supabase
      .from("event_translations")
      .update({
        card_image_url: upload.url,
        card_image_public_id: upload.fileId,
        card_image_generated: true,
        card_image_template: "default-v1",
      })
      .eq("id", t.id);

    updated.push({ lang: t.lang, url: upload.url });

    // ---------------------------------------
    // 🟩 After state for audit
    // ---------------------------------------
    audit_after.push({
      translation_id: t.id,
      lang: t.lang,
      new_public_id: upload.fileId,
      new_url: upload.url,
    });
  }

  // ---------------------------------------
  // 📝 AUDIT LOG
  // ---------------------------------------
  await logAudit({
    actor_user_id,
    action: "generate_card_image",
    entity: "event_translation",
    entity_id: event.id,
    diff: {
      before: audit_before,
      after: audit_after,
    },
  });

  return new Response(JSON.stringify({ updated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
