import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { RestaurantRow } from '@/types/app-types'
import { cuisineLabel } from '@/lib/cuisines'
import RestaurantDetail, { ReviewWithReviewer } from './_components/RestaurantDetail'

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .maybeSingle<RestaurantRow>()

  if (!restaurant) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, reviewer:users!reviews_reviewer_id_fkey(name)')
    .eq('restaurant_id', id)
    .order('created_at', { ascending: false })

  const { data: cuisineValues } = await (supabase as any).rpc('get_cuisine_types') as {
    data: string[] | null
  }
  const cuisineOptions = (cuisineValues ?? [])
    .sort((a: string, b: string) => {
      if (a === 'other') return 1
      if (b === 'other') return -1
      return a.localeCompare(b)
    })
    .map((value: string) => ({ value, label: cuisineLabel(value) }))

  return (
    <RestaurantDetail
      restaurant={restaurant}
      reviews={(reviews as ReviewWithReviewer[] | null) ?? []}
      cuisineOptions={cuisineOptions}
      isOwner={user.id === restaurant.owner_id}
    />
  )
}
