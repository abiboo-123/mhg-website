import type { MiddlewareHandler } from "astro";
import { createClient } from "@supabase/supabase-js";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies } = context;

  // Only protect /admin routes other than login page
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const access_token = cookies.get("sb-access-token")?.value;

    // 🚫 No access token → redirect immediately
    if (!access_token) {
      return Response.redirect(new URL("/admin/login", url), 302);
    }

    try {
      // ✅ Create Supabase client with the user's token
      const supabase = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        }
      );

      // ✅ Verify user session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        cookies.delete("sb-access-token");
        cookies.delete("sb-refresh-token");
        return Response.redirect(new URL("/admin/login", url), 302);
      }

      // ✅ Check user role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle(); // safer than single()

      if (
        error ||
        !profile ||
        (profile.role !== "admin" && profile.role !== "super_admin")
      ) {
        return new Response("You are not authorized to access this page.", {
          status: 403,
        });
      }

      // ✅ Make role accessible in your pages
      context.locals.user = user;
      context.locals.role = profile.role;
    } catch (err) {
      console.error("Middleware auth error:", err);
      // Fallback redirect on any failure
      return Response.redirect(new URL("/admin/login", url), 302);
    }
  }

  return next();
};
