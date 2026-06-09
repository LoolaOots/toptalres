'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SortOrderPref } from '@/types/app-types'

async function updatePreference(userId: string, patch: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: updated, error: updateError } = await supabase
    .from('user_preferences')
    .update({ ...patch, updated_at: new Date().toISOString() } as any)
    .eq('user_id', userId)
    .select('user_id')
  if (updateError) {
    console.error('[updatePreference] update error:', updateError.message)
    return
  }
  // Row missing (pre-trigger user) — create it then apply the patch
  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from('user_preferences')
      .insert({ user_id: userId, ...patch } as any)
    if (insertError) console.error('[updatePreference] insert error:', insertError.message)
  }
}

export async function updateSortOrder(sortOrder: SortOrderPref) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await updatePreference(user.id, { sort_order: sortOrder })
  revalidatePath('/restaurants')
}

export async function updateCuisineFilter(cuisine: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await updatePreference(user.id, { cuisine_filter: cuisine })
  revalidatePath('/restaurants')
}

export async function updateRatingFilter(min: number | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await updatePreference(user.id, { rating_filter_min: min })
  revalidatePath('/restaurants')
}
