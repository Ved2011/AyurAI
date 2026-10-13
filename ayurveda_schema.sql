-- ============================================================================
-- Ayurveda Food Compatibility Database Schema (Viruddha Ahara Engine)
-- Designed for scale: 3M+ food items, zero combination pre-computation
-- All pair evaluations are performed dynamically at query time in O(1)
-- ============================================================================

CREATE TABLE IF NOT EXISTS food_items (
    id VARCHAR(128) PRIMARY KEY,
    name TEXT NOT NULL,
    ingredients_raw TEXT,
    potency VARCHAR(32),                     -- e.g. 'hot', 'cold', 'neutral' (Virya)
    tastes VARCHAR(128),                     -- Comma-separated: 'sweet,sour,pungent,salty,bitter,astringent' (Rasa)
    is_dairy BOOLEAN DEFAULT FALSE,          -- Kshira category
    is_fermented BOOLEAN DEFAULT FALSE,      -- Sandhana / Kinva category
    is_nightshade BOOLEAN DEFAULT FALSE,     -- Solanaceae family
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Primary performance index on potency as requested
CREATE INDEX IF NOT EXISTS idx_food_items_potency ON food_items (potency);

-- Secondary indexing to accelerate property-based lookups & filter queries
CREATE INDEX IF NOT EXISTS idx_food_items_flags ON food_items (is_dairy, is_fermented, is_nightshade);
