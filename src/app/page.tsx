import Image from 'next/image'
import { Box, Typography, Stack } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* LEFT PANEL */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          px: 6,
          py: 5,
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 'auto' }}>
          <Image src="/logo.png" alt="Toptal logo" width={48} height={48} priority />
        </Box>

        {/* Main content — vertically centered */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            {['Toptal', 'Restaurant', 'Reviews'].map((word) => (
              <Typography
                key={word}
                variant="h1"
                sx={{
                  fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  lineHeight: 1.05,
                  color: '#111',
                  display: 'block',
                }}
              >
                {word}
              </Typography>
            ))}
          </Box>

          <Typography
            sx={{
              fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
              fontSize: '1.4rem',
              color: '#555',
              mb: 5,
            }}
          >
            Give and get honest feedback.
          </Typography>

          {/* Feature icons */}
          <Stack direction="row" spacing={10} sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <EditOutlinedIcon sx={{ fontSize: 28, color: '#111' }} />
              <Typography
                sx={{
                  fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#111',
                }}
              >
                Write a Review
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <StarBorderOutlinedIcon sx={{ fontSize: 28, color: '#111' }} />
              <Typography
                sx={{
                  fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#111',
                }}
              >
                Find Top Rated
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {/* Food background image */}
        <Image
          src="/food-hero.jpg"
          alt="Restaurant food"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />

        {/* Dark overlay for button legibility */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%)',
          }}
        />

        {/* Sign Up / Sign In buttons */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            display: 'flex',
            gap: 1.5,
            zIndex: 1,
          }}
        >
          <Button href="/register" variant="outlined" colorScheme="light">
            Sign Up
          </Button>
          <Button href="/login" variant="outlined" colorScheme="light">
            Sign In
          </Button>
        </Box>
      </Box>

    </Box>
  )
}
