import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../../lib/audit";
import { generatePassword } from "../../../../utils/generatePassword";
export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.role !== "super_admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const { email, fullName, role } = await request.json();
  if (!email || !role) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing data" }),
      { status: 400 }
    );
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const password = generatePassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message }),
      { status: 400 }
    );
  }

  const userId = data.user.id;

  // Update profile
  await supabase
    .from("profiles")
    .update({
      role,
      full_name: fullName || null,
    })
    .eq("id", userId);

  // AUDIT LOG
  await logAudit({
    actor_user_id: locals.user?.id,
    action: "create_user",
    entity: "admin_user",
    entity_id: userId,
    diff: { email, role, fullName },
  });

  return new Response(
    JSON.stringify({
      success: true,
      password,
      email,
      role,
    }),
    { status: 200 }
  );
};
