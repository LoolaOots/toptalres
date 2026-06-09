/*
 * Owned Restaurants Page ("/my-restaurants") — Owner only.
 * Placeholder — full implementation coming soon.
 */

import { requireOwner } from '@/lib/auth'
import { Container, Typography } from '@mui/material'

export default async function MyRestaurantsPage() {
  await requireOwner()
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif', fontWeight: 700 }}
      >
        My Restaurants — coming soon
      </Typography>
    </Container>
  )
}
