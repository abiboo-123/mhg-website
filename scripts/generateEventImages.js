import fs from "fs";
import path from "path";
import satori from "satori";
import sharp from "sharp";

const eventsPath = path.resolve("./src/data/events.translated.json");
const eventsByLang = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));

// Output directory
const outputDir = path.resolve("./public/events-banners");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load font (put a TTF/OTF in public/fonts/, e.g. Inter-Bold.ttf)
const fontPath = path.resolve("./public/fonts/Inter_28pt-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

async function generateImages() {
  let updated = false;

  for (const [lang, events] of Object.entries(eventsByLang)) {
    for (const event of events) {
      // Skip if a custom cardImage already exists outside auto-generated folder
      if (event.cardImage && !event.cardImage.startsWith("/events-banners/")) {
        continue;
      }

      const fileName = `${event.slug}-${lang}.png`;
      const publicUrl = `/events-banners/${fileName}`;
      const filePath = path.join(outputDir, fileName);

      // Create SVG with title
      const svg = await satori(
        {
          type: "div",
          props: {
            style: {
              width: "800px",
              height: "320px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(135deg, #0369a1, #0ea5e9)", // gradient
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
                    fontSize: "42px",
                    fontWeight: "700",
                    marginBottom: "20px",
                  },
                  children: event.title,
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "24px",
                    fontWeight: "400",
                    opacity: 0.9,
                  },
                  children: `${event.date}`,
                },
              },
            ],
          },
        },
        {
          width: 800,
          height: 320,
          fonts: [
            {
              name: "Inter",
              data: fontData,
              weight: 700,
              style: "normal",
            },
          ],
        }
      );
      

      // Convert SVG → PNG
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
      fs.writeFileSync(filePath, pngBuffer);

      // Update event JSON
      if (event.cardImage !== publicUrl) {
        event.cardImage = publicUrl;
        updated = true;
      }

      console.log(`✅ Banner for ${event.slug} (${lang}) → ${publicUrl}`);
    }
  }

  // Save updated JSON back
  if (updated) {
    fs.writeFileSync(eventsPath, JSON.stringify(eventsByLang, null, 2), "utf-8");
    console.log("💾 Updated events.translated.json with new cardImage paths.");
  }
}

generateImages();
