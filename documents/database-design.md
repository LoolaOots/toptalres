# Database Design — Restaurant Review Platform

## Overview

Single shared database used by both the website (SPA) and iOS app via a shared backend API.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| User model | Single `users` table with `role` enum | Simpler auth, clean FK references, easy to extend |
| Sort/filter persistence | `user_preferences` table (DB, not localStorage) | Must work across web and iOS on the same account |
| Average rating | Stored on `restaurants`, updated incrementally | Enables fast sorting/filtering without aggregation queries |
| Cuisine | String column on `restaurants` | Sufficient for filtering; normalized to lowercase on write |

---

## Tables

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PRIMARY KEY |
| `email` | VARCHAR | UNIQUE, NOT NULL |
| `password_hash` | VARCHAR | NOT NULL |
| `role` | ENUM('reviewer', 'owner') | NOT NULL |
| `name` | VARCHAR | NOT NULL |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**Notes:**
- Single table for both roles. Role-based access control is enforced at the API layer.
- `password_hash` stores a bcrypt hash — never plaintext.

---

### `restaurants`

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PRIMARY KEY |
| `owner_id` | UUID | NOT NULL, FK → `users.id` |
| `title` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `location` | VARCHAR | NOT NULL |
| `cuisine` | VARCHAR | NOT NULL |
| `preview_image_url` | VARCHAR | |
| `average_rating` | DECIMAL(3,2) | NOT NULL, DEFAULT 0 |
| `review_count` | INTEGER | NOT NULL, DEFAULT 0 |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**Notes:**
- `owner_id` links each restaurant to its owner. Owners can only modify rows where `owner_id = current_user.id`.
- `average_rating` and `review_count` are stored (denormalized) for fast sorting and filtering. They are updated in the same transaction as any review write — never independently.
- `cuisine` is normalized to lowercase on write to avoid "Italian" vs "italian" duplicates.

**Indexes:**
- `owner_id` — for owner dashboard queries
- `average_rating` — for sorting the restaurant list
- `cuisine` — for filtering

---

### `reviews`

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PRIMARY KEY |
| `restaurant_id` | UUID | NOT NULL, FK → `restaurants.id` |
| `reviewer_id` | UUID | NOT NULL, FK → `users.id` |
| `rating` | INTEGER | NOT NULL, CHECK (1–5) |
| `comment` | TEXT | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**Constraints:**
- `UNIQUE(restaurant_id, reviewer_id)` — one review per reviewer per restaurant.
- Only users with `role = 'reviewer'` may create reviews (enforced at API layer).

---

### `user_preferences`

| Column | Type | Constraints |
|---|---|---|
| `user_id` | UUID | PRIMARY KEY, FK → `users.id` |
| `sort_order` | ENUM('best_to_worst', 'worst_to_best') | NOT NULL, DEFAULT 'best_to_worst' |
| `cuisine_filter` | VARCHAR | NULLABLE |
| `rating_filter_min` | DECIMAL(3,2) | NULLABLE |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**Notes:**
- One row per user (1-to-1 with `users`). Created on registration with defaults.
- Loaded on login and cached in app state for the session. Written back to DB on any change.
- Storing in DB (not localStorage) ensures preferences are shared across web and iOS.

---

## Relationships

```
users ──< restaurants        (one owner has many restaurants)
users ──< reviews            (one reviewer has many reviews)
restaurants ──< reviews      (one restaurant has many reviews)
users ──  user_preferences   (one-to-one)
```

---

## Average Rating — Update Strategy

`average_rating` and `review_count` on `restaurants` are updated **in the same DB transaction** as every review mutation. This guarantees consistency — if either write fails, both roll back.

### Formulas

**Review submitted (new rating `R`):**
```
new_count = review_count + 1
new_avg   = (average_rating * review_count + R) / new_count
```

**Review edited (old rating `R_old`, new rating `R_new`):**
```
new_avg   = (average_rating * review_count - R_old + R_new) / review_count
new_count = unchanged
```

**Review deleted (deleted rating `R`):**
```
new_count = review_count - 1
new_avg   = (average_rating * review_count - R) / new_count  -- 0 if new_count = 0
```

### Transaction Pattern
```sql
BEGIN;
  -- Step 1: write the review
  INSERT INTO reviews (restaurant_id, reviewer_id, rating, comment)
  VALUES (...);

  -- Step 2: update restaurant stats atomically
  UPDATE restaurants
  SET review_count   = review_count + 1,
      average_rating = (average_rating * review_count + :new_rating) / (review_count + 1),
      updated_at     = NOW()
  WHERE id = :restaurant_id;
COMMIT;
```

---

## Authorization Rules (enforced at API layer)

| Action | Allowed roles | Extra condition |
|---|---|---|
| Create restaurant | `owner` | — |
| Read restaurant list | `reviewer` | — |
| Read restaurant detail | `reviewer`, `owner` | — |
| Update restaurant | `owner` | `owner_id = current_user.id` |
| Delete restaurant | `owner` | `owner_id = current_user.id` |
| Create review | `reviewer` | Not already reviewed this restaurant |
| Edit/delete review | `reviewer` | `reviewer_id = current_user.id` |
