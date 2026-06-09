import { Container, Box, Skeleton } from '@mui/material'

export default function RestaurantDetailLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton width={130} height={36} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={360} sx={{ borderRadius: 3, mb: 3 }} />
      <Skeleton width="55%" height={52} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <Skeleton width={90} height={28} sx={{ borderRadius: 4 }} />
        <Skeleton width={160} height={28} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="circular" width={20} height={20} />
        ))}
        <Skeleton width={60} height={20} sx={{ ml: 1 }} />
      </Box>
      <Skeleton width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton width="90%" height={20} sx={{ mb: 1 }} />
      <Skeleton width="75%" height={20} sx={{ mb: 4 }} />
      <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 4 }} />
      <Skeleton width={80} height={32} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 3, mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 3 }} />
    </Container>
  )
}
