import { Container, Box, Skeleton } from '@mui/material'

function SkeletonCard() {
  return (
    <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={180} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="70%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="35%" height={22} sx={{ mb: 1 }} />
        <Skeleton width="60%" height={18} sx={{ mb: 1 }} />
        <Skeleton width="45%" height={18} />
      </Box>
    </Box>
  )
}

export default function MyRestaurantsLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton width={180} height={36} />
        <Skeleton width={160} height={40} sx={{ borderRadius: 2 }} />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
    </Container>
  )
}
