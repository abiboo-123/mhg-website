import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

dotenv.config();

// === Supabase setup ===
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// === ImageKit setup ===
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

// === Font setup ===
const fontPath = path.resolve("./public/fonts/Inter_28pt-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

// === Helper: Upload to ImageKit ===
async function uploadToImageKit(buffer, fileName) {
  try {
    const res = await imagekit.upload({
      file: buffer.toString("base64"),
      fileName,
      folder: "/event-card-image/",
      useUniqueFileName: false, // ensures replacement if same slug/lang
    });
    return res;
  } catch (err) {
    console.error(`❌ Upload failed for ${fileName}:`, err.message);
    return null;
  }
}

// === Helper: Delete from ImageKit by fileId ===
async function deleteFromImageKit(publicId) {
  try {
    await imagekit.deleteFile(publicId);
    console.log(`🗑️ Deleted old card image: ${publicId}`);
  } catch (err) {
    console.warn(`⚠️ No old image deleted (${publicId}):`, err.message);
  }
}

// === Main Generator ===
async function generateCardImages() {
  console.log("🔍 Fetching event translations from Supabase...");

  const { data: translations, error } = await supabase
    .from("event_translations")
    .select(
      `
      id, lang, title, card_image_url, card_image_public_id, 
      event_id,
      events (slug, date, time, location)
      `
    )
    .not("title", "is", null);

  if (error) throw error;
  console.log(`✅ Found ${translations.length} translations`);

  for (const t of translations) {
    const { lang, title, card_image_public_id } = t;
    const event = t.events;
    if (!event) continue;

    const fileName = `event-card-${event.slug}-${lang}.png`;

    // === Generate SVG ===
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
                  fontSize: title.length > 40 ? "32px" : "40px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  maxWidth: "700px",
                  lineHeight: "1.2",
                },
                children: title,
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
                  ? `${event.date || ""} • ${event.time}`
                  : `${event.date || ""}`,
              },
            },
          ],
        },
      },
      {
        width: 800,
        height: 400,
        fonts: [{ name: "Inter", data: fontData, weight: 700 }],
      }
    );

    // === Convert SVG → PNG buffer ===
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    // === Delete old image if exists ===
    if (card_image_public_id) {
      await deleteFromImageKit(card_image_public_id);
    }

    // === Upload to ImageKit ===
    const uploadRes = await uploadToImageKit(pngBuffer, fileName);
    if (!uploadRes) continue;

    console.log(`✅ Uploaded card image for ${event.slug} (${lang})`);

    // === Update translation row ===
    await supabase
      .from("event_translations")
      .update({
        card_image_url: uploadRes.url,
        card_image_public_id: uploadRes.fileId,
        card_image_generated: true,
        card_image_template: "default-v1",
      })
      .eq("id", t.id);

    console.log(`🖊️ Updated DB record for ${event.slug} (${lang})`);
  }

  console.log("🎉 Done generating all card images!");
}

generateCardImages().catch((err) => console.error(err));
