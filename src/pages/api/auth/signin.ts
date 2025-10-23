import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get("email"));
  const password = String(form.get("password"));

  // Create Supabase client
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: true, // keep login alive using refresh token
        detectSessionInUrl: false,
      },
    }
  );

  // Attempt to sign in
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

  // ✅ Store Access Token Cookie
  cookies.set("sb-access-token", data.session.access_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // ✅ Store Refresh Token Cookie
  cookies.set("sb-refresh-token", data.session.refresh_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return redirect("/admin", 302);
};
