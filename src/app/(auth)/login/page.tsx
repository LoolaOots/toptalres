/*
 * Sign In Page ("/login") — Client Component, public only.
 *
 * Layout: Shared (auth) layout — white left panel with form, food image right panel, logo top-left.
 * Form: Email + Password fields, inline Zod validation errors, server error Alert banner.
 * Validation: signInSchema from src/lib/validation/auth.ts (email trimmed + lowercased, password max 64).
 * Submission: Calls signIn() Server Action → Supabase signInWithPassword → role-based redirect.
 * Security: Generic error message hides whether email or password was incorrect.
 * Authenticated users are redirected to their dashboard via redirectIfAuthenticated() in (auth)/layout.tsx.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Box, Card, TextField, Typography, Alert, Divider } from '@mui/material'
import Button from '@/components/ui/Button'
import { signIn } from '../actions'
import { signInSchema, type SignInFormData } from '@/lib/validation/auth'

type FormData = SignInFormData

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(signInSchema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const result = await signIn(data)
    if (result?.error) {
      setServerError(result.error)
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: 5,
        borderRadius: 4,
        bgcolor: 'transparent',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        Welcome back
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Sign in to your account
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          fullWidth
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField
          {...register('password')}
          label="Password"
          type="password"
          fullWidth
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          sx={{ py: 1.5 }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: '#1976d2', fontWeight: 700 }}>
          Sign up
        </Link>
      </Typography>
    </Card>
  )
}
