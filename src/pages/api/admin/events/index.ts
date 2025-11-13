import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string;
const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!PUBLIC_SUPABASE_URL || !SERVICE_KEY)
  console.warn(
    "⚠️ Server Supabase env missing (PUBLIC_SUPABASE_URL / SERVICE_ROLE_KEY)"
  );

const sb = createClient(PUBLIC_SUPABASE_URL, SERVICE_KEY);

export const GET: APIRoute = async () => {
  try {
    console.log("📡 Fetching events list from Supabase...");

    const { data, error } = await sb
      .from("events")
      .select(
        `
        id,
        slug,
        date,
        created_at,
        time,
        location,
        available,
        highlighted,
        is_past,
        attendance,
        event_translations(lang, title)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Clean response
    const mapped = (data || []).map((r: any) => {
      const translations = r.event_translations || [];
      const en = translations.find((t: any) => t.lang === "en");
      const de = translations.find((t: any) => t.lang === "de");

      return {
        id: r.id,
        slug: r.slug,
        date: r.date,
        time: r.time,
        location: r.location,
        available: r.available,
        highlighted: r.highlighted,
        is_past: r.is_past,
        attendance: r.attendance,
        title: en?.title ?? "(No EN title)",
        translations: translations.map((t: any) => ({ lang: t.lang })),
        hasEN: !!en,
        hasDE: !!de,
      };
    });

    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("🔥 API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
