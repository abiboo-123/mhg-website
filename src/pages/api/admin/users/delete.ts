// src/pages/api/admin/users/delete.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (locals.role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }
  console.log("🗑 DELETE USER called");

  const actor_user_id = locals.user_id!;
  const { id: userId } = await request.json();
  if (!userId) {
    console.error("❌ No userId provided!");
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }
  console.log("🔐 Deleting user:", userId);

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // delete from auth.users (this cascades)
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("❌ Supabase delete error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  console.log("✅ Deleted user successfully:", userId);

  // audit log
  await logAudit({
    actor_user_id,
    action: "delete_admin_user",
    entity: "admin_user",
    entity_id: userId,
    diff: null,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
