'use client'

import Link from 'next/link'
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material'

export interface AppButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text'
  // 'light' renders white border + white text for use on dark/image backgrounds
  colorScheme?: 'default' | 'light'
  // Pass href to render the button as a Next.js Link
  href?: string
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'colorScheme',
})<{ colorScheme?: AppButtonProps['colorScheme'] }>(({ colorScheme }) => ({
  borderRadius: '50px',
  fontFamily: '"Proxima Nova", Montserrat, sans-serif',
  fontWeight: 700,
  textTransform: 'none',
  padding: '8px 24px',
  fontSize: '0.95rem',
  ...(colorScheme === 'light' && {
    color: '#fff',
    borderColor: '#fff',
    '&:hover': {
      borderColor: '#fff',
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  }),
}))

export default function Button({
  variant = 'contained',
  colorScheme = 'default',
  href,
  ...props
}: AppButtonProps) {
  if (href) {
    return (
      <StyledButton
        variant={variant}
        colorScheme={colorScheme}
        component={Link}
        href={href}
        {...props}
      />
    )
  }
  return <StyledButton variant={variant} colorScheme={colorScheme} {...props} />
}
