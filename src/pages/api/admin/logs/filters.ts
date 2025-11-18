import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const GET: APIRoute = async ({ locals }) => {
  if (locals.role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: entitiesData, error: entityErr } = await supabase
    .from("audit_log_with_actor")
    .select("entity")
    .neq("entity", "")
    .order("entity");

  const { data: actionsData, error: actionErr } = await supabase
    .from("audit_log_with_actor")
    .select("action")
    .neq("action", "")
    .order("action");

  if (entityErr || actionErr) {
    return new Response(
      JSON.stringify({
        error: entityErr?.message || actionErr?.message,
      }),
      { status: 500 }
    );
  }

  const entities = [...new Set(entitiesData.map((e) => e.entity))];
  const actions = [...new Set(actionsData.map((a) => a.action))];

  return new Response(
    JSON.stringify({
      entities,
      actions,
    }),
    { status: 200 }
  );
};
