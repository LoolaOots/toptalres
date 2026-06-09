import Link from 'next/link'
import { Container, Typography, Button, Box } from '@mui/material'

export default function RestaurantNotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Box
        sx={{
          fontSize: '3rem',
          mb: 2,
          color: 'text.disabled',
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
        }}
      >
        404
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        Restaurant not found
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        This restaurant may have been removed or the link is incorrect.
      </Typography>
      <Link href="/restaurants" style={{ textDecoration: 'none' }}>
        <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>
          Back to Restaurants
        </Button>
      </Link>
    </Container>
  )
}
