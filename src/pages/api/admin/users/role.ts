// src/pages/api/admin/users/role.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";

export const PUT: APIRoute = async ({ request, locals }) => {
  if (locals.role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const actor_user_id = locals.user_id!;
  const { id: userId, role: newRole } = await request.json();

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) Load OLD ROLE
  const { data: oldRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const oldRole = oldRow?.role || null;

  // 2) Update role
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  // 3) Audit log
  await logAudit({
    actor_user_id,
    action: "update_admin_role",
    entity: "admin_user",
    entity_id: userId,
    diff: {
      old_role: oldRole,
      new_role: newRole,
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
