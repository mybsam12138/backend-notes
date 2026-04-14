# Pagination: OFFSET vs Keyset (Cursor) Pagination

## 1. Overview
Pagination retrieves data in chunks. Two main approaches:
- OFFSET Pagination
- Keyset (Cursor) Pagination

## 2. OFFSET Pagination
### Syntax
SELECT * FROM table ORDER BY id LIMIT 20 OFFSET 40;

### Meaning
Skip first 40 rows, return next 20 rows

### Why It Is Slow
- Database scans and discards rows
- Complexity: O(n)
- Large offset → high CPU and IO cost

## 3. Keyset Pagination
### Syntax
SELECT * FROM table WHERE id > last_id ORDER BY id LIMIT 20;

### Meaning
Start from last retrieved row and return next 20 rows

### Why It Is Fast
- Uses index to locate position directly
- Complexity: O(log n + k)
- Avoids scanning unnecessary rows

## 4. Key Differences
- OFFSET: simple, supports page number, slow for large data
- Keyset: fast, scalable, no page jump support

## 5. Use Cases
OFFSET:
- Admin systems
- Page number navigation
- Small datasets

Keyset:
- Large datasets
- Infinite scroll
- High-performance APIs

## 6. Final Summary
OFFSET = scan and skip
Keyset = seek and continue
