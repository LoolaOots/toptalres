/*
 * Create Restaurant Page ("/my-restaurants/new") — Owner only.
 *
 * Server Component: guards access with requireOwner(), then fetches cuisine options via the
 * get_cuisine_types() RPC (same source of truth as the restaurant list filters).
 * Renders CreateRestaurantForm (Client Component) — a react-hook-form + Zod form
 * (src/lib/validation/restaurant.ts) shared with the edit form on Restaurant Detail.
 * On submit, createRestaurant() (my-restaurants/actions.ts) validates server-side, inserts
 * the row with owner_id = current user, revalidates /my-restaurants and /restaurants,
 * and redirects back to /my-restaurants.
 * "My Restaurants" back button at the top for cancelling out without saving.
 */

import Link from 'next/link'
import { Container, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { requireOwner } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { cuisineLabel } from '@/lib/cuisines'
import CreateRestaurantForm from './_components/CreateRestaurantForm'

export default async function NewRestaurantPage() {
  await requireOwner()
  const supabase = await createClient()

  const { data: cuisineValues } = await (supabase as any).rpc('get_cuisine_types') as { data: string[] | null }
  const cuisineOptions = (cuisineValues ?? [])
    .sort((a: string, b: string) => {
      if (a === 'other') return 1
      if (b === 'other') return -1
      return a.localeCompare(b)
    })
    .map((value: string) => ({ value, label: cuisineLabel(value) }))

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href="/my-restaurants" style={{ textDecoration: 'none' }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
        >
          My Restaurants
        </Button>
      </Link>

      <Typography
        variant="h5"
        sx={{
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
          mb: 4,
        }}
      >
        New Restaurant
      </Typography>

      <CreateRestaurantForm cuisineOptions={cuisineOptions} />
    </Container>
  )
}
