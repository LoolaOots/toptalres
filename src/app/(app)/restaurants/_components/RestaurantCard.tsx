import Link from 'next/link'
import { Box, Card, CardActionArea, Typography, Chip } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { RestaurantRow } from '@/types/app-types'
import { cuisineLabel } from '@/lib/cuisines'

type Restaurant = RestaurantRow

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { id, title, cuisine, location, preview_image_url, average_rating, review_count } = restaurant

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
    >
      <Link href={`/restaurants/${id}`} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
        <CardActionArea sx={{ display: 'block' }}>
          {/* Image */}
          <Box
            sx={{
              height: 180,
              bgcolor: '#e8e8e8',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {preview_image_url ? (
              <img
                src={preview_image_url}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Typography sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>No image</Typography>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                mb: 0.75,
              }}
              noWrap
            >
              {title}
            </Typography>

            <Chip
              label={cuisineLabel(cuisine)}
              size="small"
              sx={{ mb: 1, height: 22, fontSize: '0.73rem', fontWeight: 600 }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1.25,
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                {location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: '#f5a623' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {average_rating > 0 ? average_rating.toFixed(1) : '—'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                ({review_count} {review_count === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  )
}
