import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../lib/audit";

export const prerender = false;

export const POST: APIRoute = async ({
  request,
  cookies,
  redirect,
  locals,
}) => {
  // The user should already be in locals (from middleware)
  const user = locals.user;

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  // 📝 Audit Log: LOGOUT
  if (user) {
    await logAudit({
      actor_user_id: user.id,
      action: "logout",
      entity: "auth",
      entity_id: user.id,
      diff: {
        email: user.email,
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("cf-connecting-ip"),
        user_agent: request.headers.get("user-agent"),
      },
    });
  }

  // Clear cookies
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  // Logout from Supabase (optional)
  await supabase.auth.signOut();

  return redirect("/admin/login", 302);
};
