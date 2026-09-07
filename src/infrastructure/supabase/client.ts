// Re-export SSR-aware Supabase clients from utils.
// Use createServerClient() in Server Components / Route Handlers.
// Use createBrowserClient() in Client Components.
export { createClient as createServerClient } from "@/utils/supabase/server";
export { createClient as createBrowserClient } from "@/utils/supabase/client";
