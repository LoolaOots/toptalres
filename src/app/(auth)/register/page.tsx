/*
 * Register Page ("/register") — Client Component, public only.
 *
 * Layout: Shared (auth) layout — white left panel, food image right panel, logo top-left.
 * Form: Role selector cards (Food Reviewer / Restaurant Owner) → name → email → password → confirm password.
 * Validation: signUpSchema from src/lib/validation/auth.ts — name min 1/max 100, email max 254,
 *             password min 8/max 64 (NIST SP 800-63B), passwords must match.
 * Submission: Calls signUp() Server Action → sanitizes → supabase.auth.signUp with { name, role } metadata
 *             → DB trigger auto-creates public.users + public.user_preferences rows → role-based redirect.
 * Submit button label reflects selected role: "Sign Up as a Food Reviewer / Restaurant Owner".
 * Authenticated users are redirected to their dashboard via redirectIfAuthenticated() in (auth)/layout.tsx.
 */

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Box, Card, TextField, Typography, Alert, Divider } from '@mui/material'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import Button from '@/components/ui/Button'
import { signUp } from '../actions'
import { signUpSchema, type SignUpFormData } from '@/lib/validation/auth'
import { UserRole } from '@/types/database'

type FormData = SignUpFormData

const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  {
    value: 'reviewer',
    label: 'Food Reviewer',
    icon: <RateReviewOutlinedIcon sx={{ fontSize: 44 }} />,
  },
  {
    value: 'owner',
    label: 'Restaurant Owner',
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 44 }} />,
  },
]

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: 'reviewer' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const result = await signUp(data)
    if (result?.error) {
      setServerError(result.error)
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 480,
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
        Create an account
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Join Toptal Restaurant Reviews
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Role selector */}
        <Typography sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
          I am a…
        </Typography>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {roles.map((role) => {
                const selected = field.value === role.value
                return (
                  <Box
                    key={role.value}
                    onClick={() => field.onChange(role.value)}
                    sx={{
                      flex: 1,
                      py: 3,
                      px: 2,
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: selected ? 'primary.main' : 'divider',
                      bgcolor: selected ? 'primary.50' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.15s',
                      color: selected ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {role.icon}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {role.label}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          )}
        />

        <TextField
          {...register('name')}
          label="Full name"
          fullWidth
          autoComplete="name"
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

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
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField
          {...register('confirmPassword')}
          label="Confirm password"
          type="password"
          fullWidth
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          sx={{ py: 1.5 }}
        >
          {isSubmitting ? 'Creating account…' : `Sign Up as a ${selectedRole === 'owner' ? 'Restaurant Owner' : 'Food Reviewer'}`}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#1976d2', fontWeight: 700 }}>
          Sign in
        </Link>
      </Typography>
    </Card>
  )
}
