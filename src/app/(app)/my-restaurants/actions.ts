'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CuisineType } from '@/types/app-types'
import { restaurantSchema, type RestaurantFormData } from '@/lib/validation/restaurant'

export async function createRestaurant(
  data: RestaurantFormData,
): Promise<{ error?: string }> {
  const parsed = restaurantSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { title, location, description, cuisine, preview_image_url } = parsed.data

  const { error } = await supabase.from('restaurants').insert({
    owner_id: user.id,
    title,
    location,
    description: description || null,
    cuisine: cuisine as CuisineType,
    preview_image_url: preview_image_url || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/my-restaurants')
  revalidatePath('/restaurants')
  redirect('/my-restaurants')
}
