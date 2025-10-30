import type { MiddlewareHandler } from "astro";
import { createClient } from "@supabase/supabase-js";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies } = context;

  // Only protect /admin routes except /admin/login
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const access_token = cookies.get("sb-access-token")?.value;

    // If no access token, redirect to login and delete cookies
    if (!access_token) {
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

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    // Create Supabase client with the token
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

    // Fetch the user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user invalid, delete cookies and redirect
    if (!user) {
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

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    // Fetch profile and role
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

    // Attach user info to context.locals for pages
    context.locals.user = user;
    context.locals.role = profile.role;
  }

  // Proceed to next middleware or page
  return next();
};
