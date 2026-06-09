# Views Design — Restaurant Review Platform

## Routing Overview

| Route | View | Who sees it |
|---|---|---|
| `/` | Landing Page | Public (redirects if logged in) |
| `/login` | Sign In | Public |
| `/register` | Register | Public |
| `/profile` | Profile | Authenticated (both roles) |
| `/restaurants` | Restaurant List | Reviewer only |
| `/restaurants/:id` | Restaurant Detail | Reviewer + Owner |
| `/my-restaurants` | Owned Restaurants | Owner only |
| `/my-restaurants/new` | Create Restaurant | Owner only |
| `/my-restaurants/:id/edit` | Edit Restaurant | Owner only (their restaurant) |

**Auth redirects:**
- Unauthenticated user hits protected route → redirect to `/login`
- Authenticated user hits `/` → redirect to `/restaurants` (reviewer) or `/my-restaurants` (owner)
- Owner hits `/restaurants` → redirect to `/my-restaurants`
- Reviewer hits `/my-restaurants` → redirect to `/restaurants`

---

## Shared Layout — Navbar

| State | Navbar shows |
|---|---|
| Not logged in | Logo (left) + Sign In + Sign Up buttons (right) |
| Logged in (any role) | Logo (left) + Profile icon dropdown (right) |

**Profile icon dropdown options:**

| Option | Shows for | Route |
|---|---|---|
| Profile | Both roles | `/profile` |
| My Restaurants | Owner only | `/my-restaurants` |
| Reviews | Reviewer — hidden for now (future) | — |

---

## Views

### Landing Page (`/`)
Public-facing hero page, similar to DoorDash.

- **Navbar:** Logo left, Sign In + Sign Up buttons top right
- **Hero section:** Background image, headline, subheadline, "Get Started" CTA button → `/register`

---

### Sign In (`/login`)
- Email + password fields
- Inline validation errors (wrong password, email not found)
- Link to Register page

---

### Register (`/register`)
- Name field
- Email + password + confirm password fields
- Role selector — visually clear (two cards or radio buttons): **Reviewer** / **Restaurant Owner**
- Inline validation errors
- Link to Sign In page

---

### Profile (`/profile`)
Accessible to both roles via the profile icon dropdown.

- User's name, email, role (read-only)
- Sign Out button

*Future: password change, account settings.*

---

### Restaurant List (`/restaurants`)
Reviewer only.

- **Filter bar:** Cuisine dropdown + minimum average rating selector
- **Sort toggle:** Best → Worst (default) / Worst → Best — persisted to DB via `user_preferences`
- **Restaurant cards:** Name, preview image, cuisine, location, average rating (stars + number), review count
- **Empty state:** "No restaurants match your filters"
- **Loading state:** Skeleton cards while fetching

---

### Restaurant Detail (`/restaurants/:id`)
Visible to both reviewers and owners.

- Large preview image, title, cuisine, location, description
- Average rating + review count
- Reviews section: reviewer name, star rating, comment, date — or "No reviews yet"
- **If logged-in user is the owner of this restaurant:**
  - Edit button → `/my-restaurants/:id/edit`
  - Delete button with confirmation dialog
- Back button

*Future: Review submission form for reviewers.*

---

### Owned Restaurants (`/my-restaurants`)
Owner only.

- "Create New Restaurant" button at the top
- Restaurant cards: title, preview image, cuisine, average rating, review count
- Click card → Restaurant Detail (`/restaurants/:id`)
- **Empty state:** "You haven't added any restaurants yet" + Create CTA

---

### Create Restaurant (`/my-restaurants/new`)
Owner only.

- Fields: title, cuisine, location, description, preview image URL
- Save + Cancel buttons
- Inline validation errors

---

### Edit Restaurant (`/my-restaurants/:id/edit`)
Owner only — only for restaurants they own.

- Same form as Create, pre-filled with existing data
- Save + Cancel + Delete (with confirmation dialog)
- Inline validation errors

---

## Future Views (not in current scope)
- **Review submission** — reviewer adds a review to a restaurant from the Restaurant Detail page
- **Reviews list** — reviewer's own submitted reviews (profile dropdown "Reviews" option)
