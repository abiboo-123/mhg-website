import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const POST: APIRoute = async ({ params }) => {
  const { id } = params;

  // Update verified flag
  const { error } = await supabase
    .from("images")
    .update({ verified: true })
    .eq("id", id);

  if (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ error: "Failed to verify image" }), {
      status: 500,
    });
  }

  // ✅ Redirect back to the admin/verify page
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin/verify",
    },
  });
};
