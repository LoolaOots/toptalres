'use client'

import { useTransition } from 'react'
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material'
import { SortOrderPref } from '@/types/app-types'
import { updateSortOrder, updateCuisineFilter, updateRatingFilter } from '../actions'

interface RestaurantFiltersProps {
  cuisineOptions: { value: string; label: string }[]
  currentSortOrder: SortOrderPref
  currentCuisine: string | null
  currentRatingMin: number | null
}

const RATING_OPTIONS = [
  { label: 'Any rating', value: '' },
  { label: '2+ stars', value: '2' },
  { label: '3+ stars', value: '3' },
  { label: '4+ stars', value: '4' },
]

export default function RestaurantFilters({
  cuisineOptions,
  currentSortOrder,
  currentCuisine,
  currentRatingMin,
}: RestaurantFiltersProps) {
  const [isPending, startTransition] = useTransition()

  const handleSortChange = (value: string) => {
    startTransition(async () => { await updateSortOrder(value as SortOrderPref) })
  }

  const handleCuisineChange = (value: string) => {
    startTransition(async () => { await updateCuisineFilter(value === '' ? null : value) })
  }

  const handleRatingChange = (value: string) => {
    startTransition(async () => { await updateRatingFilter(value === '' ? null : Number(value)) })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        opacity: isPending ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {/* Sort order */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={currentSortOrder}
          label="Sort by"
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <MenuItem value="best_to_worst">Highest rated</MenuItem>
          <MenuItem value="worst_to_best">Lowest rated</MenuItem>
        </Select>
      </FormControl>

      {/* Cuisine filter */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Cuisine</InputLabel>
        <Select
          value={currentCuisine ?? ''}
          label="Cuisine"
          onChange={(e) => handleCuisineChange(e.target.value)}
        >
          <MenuItem value="">All cuisines</MenuItem>
          {cuisineOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Min rating filter */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Rating</InputLabel>
        <Select
          value={currentRatingMin !== null ? String(currentRatingMin) : ''}
          label="Rating"
          onChange={(e) => handleRatingChange(e.target.value)}
        >
          {RATING_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isPending && <CircularProgress size={20} />}
    </Box>
  )
}
