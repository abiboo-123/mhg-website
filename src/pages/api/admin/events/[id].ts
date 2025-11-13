import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// 🔐 Audit imports
import { logAudit } from "../../../../lib/audit";
import { getActorUserId } from "../../../../utils/auth";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!;
const supabaseAdminKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAdminKey);

// ------------------------------
// GET — No audit log
// ------------------------------
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "*, event_translations(title, description, tags, lang, card_image_url)"
    )
    .eq("id", id)
    .single();

  if (error || !event) return new Response("Event not found", { status: 404 });

  const en = event.event_translations.find((t: any) => t.lang === "en") || {};
  const de = event.event_translations.find((t: any) => t.lang === "de") || {};

  const { data: media, error: mediaError } = await supabase
    .from("event_media")
    .select("id, url, type, created_at, position")
    .eq("event_id", id)
    .eq("is_deleted", false)
    .order("position", { ascending: true });

  if (mediaError) {
    console.warn("Warning: could not fetch media:", mediaError.message);
  }

  return new Response(
    JSON.stringify({ ...event, en, de, media: media || [] }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// ------------------------------
// PUT — With audit log
// ------------------------------
export const PUT: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  const body = await request.json();

  // --- AUTH ---
  const actor_user_id = getActorUserId(locals);
  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // ---------------------------------------------------------
    // UPDATE BASE EVENT
    // ---------------------------------------------------------
    if (body.section === "base") {
      // Fetch old data for diff
      const { data: oldData } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      // Build update payload
      const updateData = {
        slug: body.slug,
        date: body.date,
        time: body.time,
        location: body.location,
        available: body.available,
        highlighted: body.highlighted,
        is_past: body.is_past,
        register_available: body.register_available,
        register_url: body.register_url,
        banner_url: body.banner_url,
        banner_public_id: body.banner_public_id,
        banner_uploaded: body.banner_uploaded,
        attendance: body.attendance,
      };

      const { data, error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // 🔧 TS-safe diff building
      const before = (oldData || {}) as Record<string, any>;
      const after = updateData as Record<string, any>;
      const diff: Record<string, { old: any; new: any }> = {};

      Object.keys(after).forEach((key) => {
        if (after[key] !== before[key]) {
          diff[key] = {
            old: before[key],
            new: after[key],
          };
        }
      });

      if (Object.keys(diff).length > 0) {
        await logAudit({
          actor_user_id,
          action: "update_event_base",
          entity: "event",
          entity_id: id!,
          diff,
        });
      }

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
      });
    }

    // ---------------------------------------------------------
    // UPDATE / INSERT TRANSLATION
    // ---------------------------------------------------------
    if (body.section === "translation" && body.lang) {
      const { lang, title, description, tags } = body;

      const { data: existing } = await supabase
        .from("event_translations")
        .select("*")
        .eq("event_id", id)
        .eq("lang", lang)
        .maybeSingle();

      let result;

      // ✅ UPDATE EXISTING
      if (existing) {
        const updateData = {
          title,
          description,
          tags,
        };

        const { data, error } = await supabase
          .from("event_translations")
          .update(updateData)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;

        const before = existing as Record<string, any>;
        const after = updateData as Record<string, any>;
        const diff: Record<string, { old: any; new: any }> = {};

        Object.keys(after).forEach((key) => {
          if (after[key] !== before[key]) {
            diff[key] = {
              old: before[key],
              new: after[key],
            };
          }
        });

        if (Object.keys(diff).length > 0) {
          await logAudit({
            actor_user_id,
            action: "update_event_translation",
            entity: "event_translation",
            entity_id: id!,
            diff: {
              lang,
              ...diff,
            },
          });
        }
      }

      // ✅ INSERT NEW TRANSLATION
      else {
        const insertData = {
          event_id: id,
          lang,
          title,
          description,
          tags,
        };

        const { data, error } = await supabase
          .from("event_translations")
          .insert([insertData])
          .select()
          .single();

        if (error) throw error;
        result = data;

        await logAudit({
          actor_user_id,
          action: "add_event_translation",
          entity: "event_translation",
          entity_id: id!,
          diff: insertData,
        });
      }

      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
      });
    }

    return new Response("Invalid request", { status: 400 });
  } catch (err: any) {
    console.error("Error updating event:", err);
    return new Response(err.message, { status: 500 });
  }
};
