import Image from 'next/image'
import Link from 'next/link'
import { Box, AppBar, Toolbar, Button } from '@mui/material'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavbarMenu from './_components/NavbarMenu'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f8f8' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: '#fff', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Link href="/restaurants" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Toptal" width={40} height={40} priority />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link href="/restaurants" style={{ textDecoration: 'none' }}>
              <Button sx={{ textTransform: 'none', fontWeight: 600, color: 'text.primary' }}>
                View All Restaurants
              </Button>
            </Link>
            <NavbarMenu
              userName={user.user_metadata?.name ?? user.email ?? 'User'}
              role={user.user_metadata?.role ?? 'reviewer'}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  )
}
