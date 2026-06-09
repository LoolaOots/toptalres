import { z } from 'zod'

export const restaurantSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Restaurant name is required')
    .max(100, 'Name must be 100 characters or less'),
  location: z
    .string()
    .trim()
    .min(1, 'Location is required')
    .max(200, 'Location must be 200 characters or less'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be 2000 characters or less')
    .optional(),
  cuisine: z.string().min(1, 'Cuisine is required'),
  preview_image_url: z
    .string()
    .url('Must be a valid URL')
    .refine((url) => /^https?:\/\//i.test(url), 'URL must start with http:// or https://')
    .optional()
    .or(z.literal('')),
})

export type RestaurantFormData = z.infer<typeof restaurantSchema>
