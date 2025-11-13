import { createClient } from "@supabase/supabase-js";

const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!PUBLIC_SUPABASE_URL || !SUPABASE_ANON) {
  console.warn(
    "Supabase public env missing: PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON"
  );
}

export const supabase = createClient(
  String(PUBLIC_SUPABASE_URL),
  String(SUPABASE_ANON)
);
