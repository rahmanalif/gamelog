# Backend Task: Game Section API (Hybrid RAWG Integration)

We are building a game discovery and logging platform. To provide a massive library of games, we will use the **RAWG API** (https://api.rawg.io/docs/) for metadata, while maintaining a **local database** for Gamelog-specific features (user logs, reviews, ratings, and site-wide engagement).

## Architecture Strategy: Hybrid Model
- **RAWG API**: Source of truth for static data (Title, Slug, Description, Images, Genres, Platforms, Release Date).
- **Local DB**: Source of truth for social data (User Reviews, Gamelog Ratings, Watchlists, Likes, Views, and Game-to-User relationships).
- **Unique Identifier**: Use the **RAWG Game ID** as the primary key/reference in our local database to link our data to their metadata.

---

## Database Models (Local)

### Game (Local Cache/Stats)
This table stores Gamelog-specific stats. Static metadata should be fetched from RAWG or cached.
- `rawgId` (Integer, Unique) - From RAWG
- `slug` (String, Unique)
- `gamelogAverageRating` (Float) - Average of our users' ratings
- `gamelogRatingCount` (Int)
- `gamelogReviewCount` (Int)
- `viewCount` (Int) - Incremented when a user views the detail page
- `likeCount` (Int) - Total likes from our users
- `listCount` (Int) - Total number of lists this game appears in

### GameLog / Review
- `id`
- `userId`
- `rawgId`
- `rating` (0.5 to 5.0, half-steps)
- `reviewText` (Text, optional)
- `playedAt` (Date)
- `platformId` (RAWG Platform ID)
- `finished` (Boolean)
- `containsSpoilers` (Boolean)
- `liked` (Boolean)
- `createdAt`
- `updatedAt`

### Watchlist
- `userId`
- `rawgId`

---

## Required Game APIs

### 1. GET /games
**Proxy to RAWG `/games` endpoint.**
- **Query params**: `page`, `page_size`, `search`, `genres`, `platforms`, `ordering`.
- **Backend Responsibility**: 
    1. Forward params to RAWG.
    2. Map RAWG's `background_image` to our `coverImage` field for the frontend.
    3. (Optional/Advanced) Merge local `gamelogAverageRating` into the response items.

### 2. GET /games/popular
**Proxy to RAWG `/games` with specific ordering.**
- Use `ordering=-added` (RAWG's popularity metric) or `ordering=-rating`.
- Support `limit` (page_size).

### 3. GET /games/:slug
**Hybrid Data Fetch.**
1. Fetch game details from RAWG `/games/{slug}`.
2. Fetch development team from RAWG `/games/{slug}/development-team` to find the **Director**.
3. Fetch local stats from our DB using the `rawgId`.
4. If authenticated, check if the user has logged/liked/wishlisted this game.
- **Response should merge these**:
  ```json
  {
    "id": "rawg_id",
    "title": "...",
    "director": "Hidetaka Miyazaki", // Derived from dev-team
    "images": { "cover": "...", "backdrop": "..." },
    "gamelogStats": { "rating": 4.6, "likes": 1200, "views": 5000 },
    "currentUser": { "hasLogged": true, "rating": 5, "isLiked": true, "isInWatchlist": false }
  }
  ```

### 4. POST /games/:rawgId/logs (Protected)
- Create or Update a `GameLog` entry.
- **Validation**: `rating` (0.5-5.0), `playedAt` (not future), `platformId` (must be valid for that game).
- **Side Effect**: Update the local `Game` stats (averageRating, counts).

### 5. GET /games/:rawgId/reviews
- Fetch from our **Local DB**.
- Support `page`, `limit`, `sort` (newest, popular, highest-rated).

### 6. GET /games/genres & /games/platforms
- Proxy to RAWG `/genres` and `/platforms` and cache the results.

---

## Implementation Priorities

1.  **Auth & Local Models**: Set up User and GameLog models first.
2.  **RAWG Service**: Create a service to fetch from `api.rawg.io` using your API key.
3.  **Detail Page API**: The `GET /games/:slug` is the most important for the "Game Detail" experience.
4.  **Logging Logic**: Ensure `POST /logs` correctly calculates the new average rating for the game in our local DB.

## Important Note on Images
RAWG provides `background_image`. For our "Poster" view, we usually use that image, but ensure the backend provides the correct URL. Some games in RAWG also have `short_screenshots` which can be used for backdrops.