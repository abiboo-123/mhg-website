// src/pages/api/admin/users/index.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";

export const GET: APIRoute = async ({ locals }) => {
  const role = locals.role;
  const actor_user_id = locals.user_id;

  if (!actor_user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) Get users from auth (cannot select via SQL)
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Auth listUsers error:", listError);
    return new Response(JSON.stringify({ error: listError.message }), {
      status: 500,
    });
  }

  // 2) Get roles & full names from profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, role, full_name");

  if (profilesError) {
    console.error("Profiles error:", profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), {
      status: 500,
    });
  }

  // 3) Merge auth.users + profiles
  const merged = users.map((u) => {
    const profile = profiles.find((p) => p.id === u.id);

    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      role: profile?.role || "admin",
      full_name: profile?.full_name || "",
    };
  });

  return new Response(JSON.stringify({ users: merged }), {
    status: 200,
  });
};
