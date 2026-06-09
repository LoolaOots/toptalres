'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { CuisineType } from '@/types/app-types'

const restaurantSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100),
  location: z.string().trim().min(1, 'Location is required').max(200),
  description: z.string().trim().max(2000).optional(),
  cuisine: z.string().min(1, 'Cuisine is required'),
  preview_image_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type RestaurantFormData = z.infer<typeof restaurantSchema>

export async function updateRestaurant(
  restaurantId: string,
  data: RestaurantFormData,
): Promise<{ error?: string }> {
  const parsed = restaurantSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { title, location, description, cuisine, preview_image_url } = parsed.data

  const { error } = await supabase
    .from('restaurants')
    .update({
      title,
      location,
      description: description || null,
      cuisine: cuisine as CuisineType,
      preview_image_url: preview_image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', restaurantId)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/restaurants/${restaurantId}`)
  revalidatePath('/restaurants')
  revalidatePath('/my-restaurants')
  return {}
}

export async function deleteRestaurant(restaurantId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', restaurantId)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/restaurants')
  revalidatePath('/my-restaurants')
  redirect('/restaurants')
}
