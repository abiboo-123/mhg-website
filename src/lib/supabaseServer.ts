import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";

export function createServerSupabase(cookies: AstroCookies) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL!;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!;

  const access_token = cookies.get("sb-access-token")?.value;
  const refresh_token = cookies.get("sb-refresh-token")?.value;

  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${access_token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return { supabase, access_token, refresh_token };
}
