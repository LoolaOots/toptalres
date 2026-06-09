// Auto-generate this file by running:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'reviewer' | 'owner'
export type SortOrderPref = 'best_to_worst' | 'worst_to_best'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          name?: string
          role?: UserRole
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          location: string
          cuisine: string
          preview_image_url: string | null
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          location: string
          cuisine: string
          preview_image_url?: string | null
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          location?: string
          cuisine?: string
          preview_image_url?: string | null
          average_rating?: number
          review_count?: number
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          reviewer_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          reviewer_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          sort_order: SortOrderPref
          cuisine_filter: string | null
          rating_filter_min: number | null
          updated_at: string
        }
        Insert: {
          user_id: string
          sort_order?: SortOrderPref
          cuisine_filter?: string | null
          rating_filter_min?: number | null
          updated_at?: string
        }
        Update: {
          sort_order?: SortOrderPref
          cuisine_filter?: string | null
          rating_filter_min?: number | null
          updated_at?: string
        }
      }
    }
  }
}
