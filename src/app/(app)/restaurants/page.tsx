/*
 * Restaurant List ("/restaurants") — Authenticated users (both reviewers and owners).
 *
 * Server Component: fetches user_preferences from DB for sort/filter state, then queries
 * restaurants with those filters applied. Filter/sort changes go through Server Actions
 * (restaurants/actions.ts) which update user_preferences + call revalidatePath so the
 * page re-renders with the new data — persisting preferences across sessions.
 */

import { Container, Typography, Box } from '@mui/material'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import { CuisineType, RestaurantRow, SortOrderPref } from '@/types/app-types'
import { cuisineLabel } from '@/lib/cuisines'
import RestaurantFilters from './_components/RestaurantFilters'
import RestaurantCard from './_components/RestaurantCard'

export default async function RestaurantsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch this user's saved filter/sort preferences
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('sort_order, cuisine_filter, rating_filter_min')
    .eq('user_id', user.id)
    .maybeSingle<{ sort_order: SortOrderPref; cuisine_filter: string | null; rating_filter_min: number | null }>()

  const sortOrder: SortOrderPref = prefs?.sort_order ?? 'best_to_worst'
  const cuisineFilter: string | null = prefs?.cuisine_filter ?? null
  const ratingMin: number | null = prefs?.rating_filter_min ?? null

  // Cuisine options from the DB enum — stays in sync with Supabase automatically.
  // Cast needed because gen-types doesn't scan pg_catalog functions.
  const { data: cuisineValues } = await (supabase as any).rpc('get_cuisine_types') as { data: string[] | null }
  const cuisineOptions = (cuisineValues ?? [])
    .sort((a: string, b: string) => {
      if (a === 'other') return 1
      if (b === 'other') return -1
      return a.localeCompare(b)
    })
    .map((value: string) => ({ value, label: cuisineLabel(value) }))

  // Restaurants with current filters applied
  let query = supabase
    .from('restaurants')
    .select<'*', RestaurantRow>('*')
    .order('average_rating', { ascending: sortOrder === 'worst_to_best' })

  if (cuisineFilter) query = query.eq('cuisine', cuisineFilter as CuisineType)
  if (ratingMin !== null) query = query.gte('average_rating', ratingMin)

  const { data: restaurants } = await query

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Restaurants
      </Typography>

      <RestaurantFilters
        cuisineOptions={cuisineOptions}
        currentSortOrder={sortOrder}
        currentCuisine={cuisineFilter}
        currentRatingMin={ratingMin}
      />

      {restaurants && restaurants.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
            mt: 3,
          }}
        >
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ color: 'text.secondary' }}>
            No restaurants match your filters.
          </Typography>
        </Box>
      )}
    </Container>
  )
}
