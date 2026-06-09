'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  Typography,
} from '@mui/material'
import Button from '@/components/ui/Button'
import { restaurantSchema, type RestaurantFormData } from '@/lib/validation/restaurant'
import { createRestaurant } from '../../actions'

interface CreateRestaurantFormProps {
  cuisineOptions: { value: string; label: string }[]
}

export default function CreateRestaurantForm({ cuisineOptions }: CreateRestaurantFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: { title: '', location: '', description: '', cuisine: '', preview_image_url: '' },
  })

  const previewUrl = watch('preview_image_url')

  const onSubmit = async (data: RestaurantFormData) => {
    setServerError(null)
    const result = await createRestaurant(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* Live image preview */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 260 },
          bgcolor: '#e8e8e8',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Typography sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>
            Image preview
          </Typography>
        )}
      </Box>

      <TextField
        {...register('preview_image_url')}
        label="Preview image URL"
        fullWidth
        size="small"
        placeholder="https://..."
        error={!!errors.preview_image_url}
        helperText={errors.preview_image_url?.message}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <TextField
        {...register('title')}
        label="Restaurant name"
        fullWidth
        required
        error={!!errors.title}
        helperText={errors.title?.message}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
          '& input': { fontSize: '1.1rem', fontWeight: 700 },
        }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Controller
          name="cuisine"
          control={control}
          render={({ field }) => (
            <FormControl size="small" sx={{ minWidth: 200 }} required error={!!errors.cuisine}>
              <InputLabel>Cuisine</InputLabel>
              <Select {...field} label="Cuisine">
                {cuisineOptions.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {errors.cuisine && <FormHelperText>{errors.cuisine.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <TextField
          {...register('location')}
          label="Location"
          size="small"
          required
          error={!!errors.location}
          helperText={errors.location?.message}
          sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      <TextField
        {...register('description')}
        label="Description"
        fullWidth
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description?.message}
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Create restaurant'}
        </Button>
        <Button variant="outlined" href="/my-restaurants" disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
