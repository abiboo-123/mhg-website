import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { logAudit } from "../../../lib/audit";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get("email"));
  const password = String(form.get("password"));

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return redirect(
      `/admin/login?error=${encodeURIComponent("Invalid email or password")}`,
      302
    );
  }

  // ---------------------------
  // SUCCESSFUL LOGIN
  // ---------------------------
  const session = data.session;
  const user = data.user;

  const isDev = import.meta.env.DEV;

  // Set cookies
  cookies.set("sb-access-token", session.access_token, {
    path: "/",
    httpOnly: true,
    secure: !isDev,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookies.set("sb-refresh-token", session.refresh_token, {
    path: "/",
    httpOnly: true,
    secure: !isDev,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });

  // 📝 Audit log: LOGIN
  await logAudit({
    actor_user_id: user.id,
    action: "login",
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

  return redirect("/admin", 302);
};
