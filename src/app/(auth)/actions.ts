'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signInSchema, signUpSchema } from '@/lib/validation/auth'
import { UserRole } from '@/types/app-types'

export type AuthError = { error: string }

export async function signIn(data: {
  email: string
  password: string
}): Promise<AuthError | never> {
  // Server-side validation — never trust client input alone
  const parsed = signInSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Return a generic message — don't reveal whether email or password was wrong
    return { error: 'Invalid email or password.' }
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single<{ role: UserRole }>()

  redirect(profile?.role === 'owner' ? '/my-restaurants' : '/restaurants')
}

export async function signUp(data: {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}): Promise<AuthError | never> {
  // Server-side validation with sanitization applied via Zod transforms
  const parsed = signUpSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Use parsed.data — email is lowercased, name is trimmed and spaces collapsed
  const { name, email, password, role } = parsed.data

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with this email already exists.' }
    }
    return { error: error.message }
  }

  redirect(role === 'owner' ? '/my-restaurants' : '/restaurants')
}
