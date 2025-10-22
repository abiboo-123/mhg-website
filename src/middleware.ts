import type { MiddlewareHandler } from "astro";
import { createClient } from "@supabase/supabase-js";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, url, cookies } = context;

  // Only protect /admin routes (except /admin/login)
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    // Get token from cookies
    const access_token = cookies.get("sb-access-token")?.value;

    if (!access_token) {
      return Response.redirect(new URL("/admin/login", url), 302);
    }

    // Create client with the access token
    const supabase = createClient(
      import.meta.env.SUPABASE_URL,
      import.meta.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`, // ✅ Attach token
          },
        },
      }
    );

    // Now the user is correctly fetched using token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Token invalid or expired
      cookies.delete("sb-access-token");
      cookies.delete("sb-refresh-token");
      return Response.redirect(new URL("/admin/login", url), 302);
    }

    // Fetch user role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "admin" && profile.role !== "super_admin")
    ) {
      return new Response("You are not authorized to access this page.", {
        status: 403,
      });
    }

    // ✅ Make user info available in pages
    context.locals.user = user;
    context.locals.role = profile.role;
  }

  return next();
};
