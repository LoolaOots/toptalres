'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AppButton from '@/components/ui/Button'
import { RestaurantRow } from '@/types/app-types'
import { cuisineLabel } from '@/lib/cuisines'
import { updateRestaurant, deleteRestaurant } from '../actions'

export type ReviewWithReviewer = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer: { name: string } | null
}

interface RestaurantDetailProps {
  restaurant: RestaurantRow
  reviews: ReviewWithReviewer[]
  cuisineOptions: { value: string; label: string }[]
  isOwner: boolean
}

export default function RestaurantDetail({
  restaurant,
  reviews,
  cuisineOptions,
  isOwner,
}: RestaurantDetailProps) {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(restaurant.title)
  const [location, setLocation] = useState(restaurant.location)
  const [description, setDescription] = useState(restaurant.description ?? '')
  const [cuisine, setCuisine] = useState<string>(restaurant.cuisine)
  const [imageUrl, setImageUrl] = useState(restaurant.preview_image_url ?? '')

  const handleCancel = () => {
    setTitle(restaurant.title)
    setLocation(restaurant.location)
    setDescription(restaurant.description ?? '')
    setCuisine(restaurant.cuisine)
    setImageUrl(restaurant.preview_image_url ?? '')
    setError(null)
    setEditMode(false)
  }

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const result = await updateRestaurant(restaurant.id, {
        title,
        location,
        description,
        cuisine,
        preview_image_url: imageUrl,
      })
      if (result.error) {
        setError(result.error)
      } else {
        setEditMode(false)
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRestaurant(restaurant.id)
      if (result?.error) setError(result.error)
    })
  }

  const heroImage = editMode ? imageUrl : restaurant.preview_image_url
  const heroTitle = editMode ? title : restaurant.title

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Link href="/restaurants" style={{ textDecoration: 'none' }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
        >
          Restaurants
        </Button>
      </Link>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Hero image */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 220, sm: 360 },
          bgcolor: '#e8e8e8',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt={heroTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Typography sx={{ color: 'text.disabled' }}>No image</Typography>
        )}
      </Box>

      {editMode && (
        <TextField
          label="Preview image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          size="small"
          placeholder="https://..."
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      )}

      {/* Title row + action buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        {editMode ? (
          <TextField
            label="Restaurant name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '& input': { fontSize: '1.4rem', fontWeight: 700 },
            }}
          />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {restaurant.title}
          </Typography>
        )}

        {isOwner && !editMode && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, pt: 0.5 }}>
            <AppButton
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditMode(true)}
            >
              Edit
            </AppButton>
            <AppButton
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </AppButton>
          </Box>
        )}

        {editMode && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, pt: 0.5 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isPending}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Cuisine + Location */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {editMode ? (
          <FormControl size="small" sx={{ minWidth: 200 }}>
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
        ) : (
          <Chip
            label={cuisineLabel(restaurant.cuisine)}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
          />
        )}

        {editMode ? (
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {restaurant.location}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Rating (read-only — driven by reviews) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            sx={{
              fontSize: 20,
              color:
                restaurant.average_rating > 0 && star <= Math.round(restaurant.average_rating)
                  ? '#f5a623'
                  : '#e0e0e0',
            }}
          />
        ))}
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', ml: 0.5 }}>
          {restaurant.average_rating > 0 ? restaurant.average_rating.toFixed(1) : '—'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          ({restaurant.review_count} {restaurant.review_count === 1 ? 'review' : 'reviews'})
        </Typography>
      </Box>

      {/* Description */}
      {editMode ? (
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      ) : restaurant.description ? (
        <Typography sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8, maxWidth: 720 }}>
          {restaurant.description}
        </Typography>
      ) : (
        <Box sx={{ mb: 4 }} />
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Reviews */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No reviews yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {review.reviewer?.name ?? 'Anonymous'}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.25, mb: review.comment ? 1.5 : 0 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    sx={{ fontSize: 15, color: star <= review.rating ? '#f5a623' : '#e0e0e0' }}
                  />
                ))}
              </Box>

              {review.comment && (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {review.comment}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => !isPending && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete restaurant?</DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently delete <strong>{restaurant.title}</strong> and all its reviews.
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={isPending}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isPending}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
