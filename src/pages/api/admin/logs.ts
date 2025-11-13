import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const offset = (page - 1) * limit;

  console.log("Fetching audit logs…");

  // 1️⃣ Fetch audit logs
  const { data: logs, error: auditError } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (auditError) {
    console.error("Audit Log Error:", auditError);
    return new Response("Failed to load audit logs", { status: 500 });
  }

  if (!logs.length) {
    return new Response(JSON.stringify({ page, limit, logs: [] }), {
      status: 200,
    });
  }

  // 2️⃣ Fetch profiles for all actors
  const actorIds = logs.map((log) => log.actor_user_id);

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .in("id", actorIds);

  if (profileError) {
    console.error("Profile Error:", profileError);
    return new Response("Failed to load profiles", { status: 500 });
  }

  const profileMap = new Map();
  profiles?.forEach((p) => profileMap.set(p.id, p));

  // 3️⃣ Fetch emails from auth.users (must be separate)
  const { data: users, error: userError } = await supabase.auth.admin.listUsers(
    {
      perPage: 200, // enough for your admin actions
    }
  );

  if (userError) {
    console.error("Auth Users Error:", userError);
  }

  const userMap = new Map();
  users?.users?.forEach((u: any) => userMap.set(u.id, u));

  // 4️⃣ Merge everything: logs + profile.role + user.email
  const enriched = logs.map((log) => ({
    ...log,
    actor: {
      email: userMap.get(log.actor_user_id)?.email ?? null,
      role: profileMap.get(log.actor_user_id)?.role ?? "unknown",
    },
  }));

  return new Response(JSON.stringify({ page, limit, logs: enriched }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
