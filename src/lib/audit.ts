import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!;
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

/**
 * Write an entry to audit_log
 */
export async function logAudit({
  actor_user_id,
  action,
  entity,
  entity_id,
  diff = null,
}: {
  actor_user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  diff?: any;
}) {
  const { error } = await supabase.from("audit_log").insert([
    {
      actor_user_id,
      action,
      entity,
      entity_id,
      diff,
    },
  ]);

  if (error) {
    console.error("Audit Log Error:", error);
  }
}
