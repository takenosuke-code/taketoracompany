import { createClient } from "@supabase/supabase-js";

// For use in build-time contexts (generateStaticParams, generateMetadata
// at build) where the request-scoped cookies() helper isn't available.
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
