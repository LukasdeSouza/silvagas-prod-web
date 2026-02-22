

# Fix: Points System Not Working

## Root Cause Analysis

I investigated the database and found **two critical issues** preventing points from being accumulated:

### Problem 1: order_items have no product_id
The mobile app is creating order items **without saving the `product_id`** -- it's NULL for almost all records. The trigger functions try to calculate points by joining `order_items.product_id` with `products.id`, but since `product_id` is NULL, the JOIN returns nothing and points = 0.

Example from your data:
```text
order_id: 9b7f762e...  |  product_name: "Vasilhame de Botijao 13 kg"  |  product_id: NULL
```

### Problem 2: Most products have points_value = 0
Only 3 out of 19 products have a `points_value` set (the rest are 0). So even if the JOIN worked, most orders would still earn 0 points.

Products with points configured:
- Vasilhame de Botijao 13 kg: 10 points
- Kit Regulador de Gas Delta: 5 points
- Botijao 45Kg - Entrega Normal: 10 points

### Problem 3: Duplicate triggers
There are TWO triggers doing the same thing (`update_user_points` and `give_points_on_order_complete`), which could cause double-counting once fixed.

## Fix Plan

### Step 1: Fix the trigger function to match by product_name

Since the mobile app doesn't send `product_id`, we need to update the `update_user_points` function to fall back to matching by `product_name` when `product_id` is NULL.

The key change in the SQL logic:

```text
Before:  JOIN products p ON p.id = oi.product_id
After:   JOIN products p ON (p.id = oi.product_id OR (oi.product_id IS NULL AND p.name = oi.product_name))
```

### Step 2: Remove duplicate trigger

Drop the `give_points_on_order_complete` trigger and its function to avoid double-counting. Keep only `update_user_points` which is the more complete implementation (handles both completing and cancelling).

### Step 3: Set points_value on all products (your action)

You'll need to set the `points_value` for each product that should earn points. Currently only 3 products have values. I can help you update them if you tell me how many points each product should earn.

## What Will Change

- **Database migration**: Updated `update_user_points` function with product_name fallback, dropped duplicate trigger/function
- **No code changes needed**: The frontend already displays points from the `profiles.points` column, and the trigger handles everything server-side

## What Won't Change

- The existing order flow stays the same
- The mobile app doesn't need any updates
- Points redemption logic is unaffected

