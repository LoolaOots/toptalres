import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Reads role from JWT metadata — no extra DB query needed.
// Call at the top of any server component or layout that should
// be inaccessible to already-authenticated users.
export async function redirectIfAuthenticated() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const role = user.user_metadata?.role
    redirect(role === 'owner' ? '/my-restaurants' : '/restaurants')
  }
}
