// Convenience types derived from the generated Database type.
// Import these instead of defining them manually — they stay in sync
// with database.ts automatically and won't be overwritten by npm run gen-types.

import type { Database } from './database'

export type UserRole = Database['public']['Enums']['user_role']
export type SortOrderPref = Database['public']['Enums']['sort_order_pref']
export type CuisineType = Database['public']['Enums']['cuisine_type']

export type RestaurantRow = Database['public']['Tables']['restaurants']['Row']
export type ReviewRow = Database['public']['Tables']['reviews']['Row']
export type UserRow = Database['public']['Tables']['users']['Row']
export type UserPreferencesRow = Database['public']['Tables']['user_preferences']['Row']

// Supabase RPC functions not picked up by gen-types (e.g. functions querying pg_catalog).
// Add any custom DB functions here so supabase.rpc() stays typed.
export type AppFunctions = {
  get_cuisine_types: {
    Args: Record<string, never>
    Returns: string[]
  }
}
