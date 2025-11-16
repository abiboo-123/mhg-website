import type { MiddlewareHandler } from "astro";
import { createClient } from "@supabase/supabase-js";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies } = context;
  // Protect BOTH admin pages and admin API routes
  const isAdminPage =
    url.pathname.startsWith("/admin") && url.pathname !== "/admin/login";
  const isAdminAPI = url.pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminAPI) {
    const access_token = cookies.get("sb-access-token")?.value;

    if (!access_token) {
      // For API: return 401 JSON
      if (isAdminAPI) {
        return new Response("Unauthorized", { status: 401 });
      }

      // For pages: redirect to login
      const headers = new Headers();
      headers.set("Location", "/admin/login");
      headers.append(
        "Set-Cookie",
        `sb-access-token=; Path=/; HttpOnly; Max-Age=0`
      );
      headers.append(
        "Set-Cookie",
        `sb-refresh-token=; Path=/; HttpOnly; Max-Age=0`
      );

      return new Response(null, { status: 302, headers });
    }

    // Supabase auth client
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (isAdminAPI) return new Response("Unauthorized", { status: 401 });

      // Redirect for admin pages
      const headers = new Headers();
      headers.set("Location", "/admin/login");
      headers.append(
        "Set-Cookie",
        `sb-access-token=; Path=/; HttpOnly; Max-Age=0`
      );
      headers.append(
        "Set-Cookie",
        `sb-refresh-token=; Path=/; HttpOnly; Max-Age=0`
      );

      return new Response(null, { status: 302, headers });
    }

    // Fetch role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Store in locals (BOTH API + pages will have this)
    context.locals.user = user;
    context.locals.user_id = user.id;
    context.locals.role = profile.role;
  }

  return next();
};
