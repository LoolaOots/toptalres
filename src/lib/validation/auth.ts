import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(64, 'Password must be 64 characters or less'),
})

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be 100 characters or less')
      .transform((val) => val.replace(/\s+/g, ' ')), // collapse multiple spaces

    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .max(254, 'Email is too long')
      .email('Enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be 64 characters or less'),

    confirmPassword: z.string(),

    role: z.enum(['reviewer', 'owner'] as const),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
