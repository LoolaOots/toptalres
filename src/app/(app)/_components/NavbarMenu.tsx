'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconButton, Menu, MenuItem, Typography, Avatar, Box, Divider } from '@mui/material'
import { signOut } from '../actions'

interface NavbarMenuProps {
  userName: string
  role: string
}

export default function NavbarMenu({ userName, role }: NavbarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 36,
            height: 36,
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{userName}</Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: '0.8rem', textTransform: 'capitalize' }}
          >
            {role === 'owner' ? 'Restaurant Owner' : 'Food Reviewer'}
          </Typography>
        </Box>

        <Divider />

        {role === 'owner' && (
          <MenuItem component={Link} href="/my-restaurants" onClick={handleClose}>
            My Restaurants
          </MenuItem>
        )}

        <MenuItem
          onClick={async () => {
            handleClose()
            await signOut()
          }}
          sx={{ color: 'error.main' }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  )
}
