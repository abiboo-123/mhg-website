export function getActorUserId(locals: any): string | null {
  try {
    return locals.user?.id ?? null;
  } catch {
    return null;
  }
}
