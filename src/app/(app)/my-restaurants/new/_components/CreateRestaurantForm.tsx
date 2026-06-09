'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Typography,
} from '@mui/material'
import { createRestaurant } from '../../actions'

interface CreateRestaurantFormProps {
  cuisineOptions: { value: string; label: string }[]
}

export default function CreateRestaurantForm({ cuisineOptions }: CreateRestaurantFormProps) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      const result = await createRestaurant({ title, location, description, cuisine, preview_image_url: imageUrl })
      if (result?.error) setError(result.error)
    })
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Image preview */}
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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Typography sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>Image preview</Typography>
        )}
      </Box>

      <TextField
        label="Preview image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        fullWidth
        size="small"
        placeholder="https://..."
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <TextField
        label="Restaurant name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& input': { fontSize: '1.1rem', fontWeight: 700 } }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }} required>
          <InputLabel>Cuisine</InputLabel>
          <Select
            value={cuisine}
            label="Cuisine"
            onChange={(e) => setCuisine(e.target.value)}
          >
            {cuisineOptions.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          size="small"
          required
          sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
        >
          {isPending ? 'Saving…' : 'Create restaurant'}
        </Button>
        <Button
          component={Link}
          href="/my-restaurants"
          variant="outlined"
          disabled={isPending}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
