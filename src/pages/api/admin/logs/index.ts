import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const GET: APIRoute = async ({ url, locals }) => {
  const role = locals.role;
  if (role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 50);
  const offset = (page - 1) * limit;

  const search = url.searchParams.get("search") || "";
  const action = url.searchParams.get("action") || "";
  const entity = url.searchParams.get("entity") || "";
  const roleFilter = url.searchParams.get("role") || "";

  // ---- Build Query ----
  let query = supabase
    .from("audit_log_with_actor")
    .select("*", { count: "exact" });

  if (action) query = query.ilike("action", `%${action}%`);
  if (entity) query = query.ilike("entity", `%${entity}%`);
  if (roleFilter) query = query.ilike("role", `${roleFilter}`);

  if (search) {
    query = query.or(
      `action.ilike.%${search}%, entity.ilike.%${search}%, email.ilike.%${search}%, role.ilike.%${search}%`
    );
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      logs: data,
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    }),
    { status: 200 }
  );
};
