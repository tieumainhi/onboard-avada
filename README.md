# Exercises

This folder contains small end-to-end scripts that exercise the data pipeline:

- `01-get-users.js` — fetch all users from JSONPlaceholder and dump to `logs/`.
- `02-map-posts-comments.js` — fetch posts and comments, map them into users (`posts` and `comments` arrays per user). Approach: group posts by `userId`, comments by `postId`, then merge.
- `03-filter-more-than-3-comments.js` — build counts per user and filter users with more than 3 comments. Approach: count posts and sum comments per post.
- `04-top-and-sort.js` — find top users by `commentsCount` and `postsCount`, and sort users by `postsCount` descending.
- `05-get-post-1-merge-comments.js` — fetch post `id=1` and its comments concurrently and merge.

Notes on approach

- Services (`services/`) handle network calls and return safe fallbacks on errors.
- Helpers (`helpers/`) do the pure data transformation and are defensive: they accept empty/wrong-type inputs and return reasonable defaults.
- Performance: mapping functions use grouping and a single pass to avoid N^2 loops; scripts include `console.time` around heavy operations to measure cost when using large datasets.

How to run

```
node exercises/01-get-users.js
node exercises/02-map-posts-comments.js
node exercises/03-filter-more-than-3-comments.js
node exercises/04-top-and-sort.js
node exercises/05-get-post-1-merge-comments.js
```
