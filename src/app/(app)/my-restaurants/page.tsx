import Link from 'next/link'
import { Container, Typography, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { requireOwner } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { RestaurantRow } from '@/types/app-types'
import RestaurantCard from '../restaurants/_components/RestaurantCard'

export default async function MyRestaurantsPage() {
  const user = await requireOwner()
  const supabase = await createClient()

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select<'*', RestaurantRow>('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
            fontWeight: 700,
          }}
        >
          My Restaurants
        </Typography>

        <Link href="/my-restaurants/new" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            New Restaurant
          </Button>
        </Link>
      </Box>

      {restaurants && restaurants.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
          }}
        >
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography sx={{ color: 'text.secondary' }}>
            You haven't added any restaurants yet.
          </Typography>
        </Box>
      )}
    </Container>
  )
}
