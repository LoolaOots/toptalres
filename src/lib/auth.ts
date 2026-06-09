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

// Require any authenticated user — redirects to /login if not signed in.
export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

// Require reviewer role — redirects owners to /my-restaurants, unauthenticated to /login.
export async function requireReviewer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (user.user_metadata?.role === 'owner') redirect('/my-restaurants')
  return user
}

// Require owner role — redirects reviewers to /restaurants, unauthenticated to /login.
export async function requireOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (user.user_metadata?.role !== 'owner') redirect('/restaurants')
  return user
}
