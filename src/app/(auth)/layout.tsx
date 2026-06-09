import Image from 'next/image'
import Link from 'next/link'
import { Box } from '@mui/material'
import { redirectIfAuthenticated } from '@/lib/auth'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await redirectIfAuthenticated()
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* LEFT — white panel with form */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          px: 6,
          py: 5,
          overflowY: 'auto',
        }}
      >
        {/* Logo — pinned top-left, same as landing page */}
        <Box sx={{ mb: 'auto' }}>
          <Link href="/">
            <Image src="/logo.png" alt="Toptal" width={48} height={48} priority />
          </Link>
        </Box>

        {/* Form — vertically centered */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
      </Box>

      {/* RIGHT — same food image as landing page */}
      <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <Image
          src="/food-hero.jpg"
          alt="Restaurant food"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </Box>

    </Box>
  )
}
