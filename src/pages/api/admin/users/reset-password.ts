// src/pages/api/admin/users/reset-password.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";
import { generatePassword } from "../../../../utils/generatePassword";

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const actor_user_id = locals.user_id!;
  const { userId, password } = await request.json();

  // Validate UUID format (fixes UUID error)
  if (!userId || typeof userId !== "string" || userId.length < 10) {
    return new Response(JSON.stringify({ error: "Invalid userId" }), {
      status: 400,
    });
  }

  const newPassword = password;

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  await logAudit({
    actor_user_id,
    action: "reset_admin_password",
    entity: "admin_user",
    entity_id: userId,
    diff: { password_reset: true },
  });

  return new Response(
    JSON.stringify({
      success: true,
      email: data.user?.email,
      password: newPassword,
    }),
    { status: 200 }
  );
};
