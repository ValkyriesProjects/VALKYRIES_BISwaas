-- ============================================================
-- Demo queries — run these AFTER 01-03, to sanity-check the
-- import and to show the actual lookup your backend will do.
-- ============================================================
USE `soumi-database`;

-- Sanity check: row counts
SELECT 'standards' AS table_name, COUNT(*) AS rows FROM standards
UNION ALL SELECT 'purity_grades', COUNT(*) FROM purity_grades
UNION ALL SELECT 'hallmark_components', COUNT(*) FROM hallmark_components
UNION ALL SELECT 'hallmarking_rules', COUNT(*) FROM hallmarking_rules
UNION ALL SELECT 'product_types', COUNT(*) FROM product_types;

-- ------------------------------------------------------------
-- THE demo query: user types "gold ring" -> this is the whole
-- pipeline's deterministic half in one join. No LLM involved.
-- ------------------------------------------------------------
SELECT
    pt.product_type,
    pt.metal_type,
    hr.hallmarking_required,
    hr.required_since,
    hr.huid_required,
    hr.coverage_note,
    hr.penalty_note,
    s.is_number       AS applicable_standard,
    s.official_source,
    hr.last_verified
FROM product_types pt
JOIN hallmarking_rules hr
    ON pt.metal_type = hr.metal_type AND pt.article_type = hr.article_type
JOIN standards s
    ON hr.standard_id = s.id
WHERE pt.product_type = 'gold ring';

-- Same query, parameterised version for your Flask app:
-- SELECT ... WHERE pt.product_type = %s

-- ------------------------------------------------------------
-- What purities are valid for a metal (feeds a "purity" dropdown
-- or lets you validate a user-entered purity claim)
-- ------------------------------------------------------------
SELECT purity_label, fineness_value, notes
FROM purity_grades
WHERE metal_type = 'gold'
ORDER BY fineness_value;

-- ------------------------------------------------------------
-- What marks should appear on the article (for an "explain my
-- hallmark" or "what should I see on this item" screen)
-- ------------------------------------------------------------
SELECT component_name, description, example_value
FROM hallmark_components
WHERE metal_type = 'silver';

-- ------------------------------------------------------------
-- Full evidence trail for one standard (what your citation
-- panel renders when the user clicks "show source")
-- ------------------------------------------------------------
SELECT is_number, standard_title, applicability, official_source, last_verified
FROM standards
WHERE is_number = 'IS 1417:2016';
