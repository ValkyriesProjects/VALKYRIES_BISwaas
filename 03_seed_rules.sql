-- ============================================================
-- Seed: purity_grades, hallmark_components, hallmarking_rules,
-- product_types
-- Run THIRD (after 02_seed_standards.sql — this uses subqueries
-- against standards.is_number to look up the right standard_id,
-- so row order doesn't matter and it's self-documenting).
-- ============================================================
USE `soumi-database`;

-- ------------------------------------------------------------
-- purity_grades
-- Gold grades per IS 1417:2016 (six permitted grades).
-- Silver grades: common BIS-recognised fineness values for
-- silver jewellery/articles. [VERIFY before demo — the six gold
-- grades are confirmed against IS 1417 text in `standards`; the
-- silver fineness list below is commonly cited industry-wide but
-- was not independently re-verified against IS 2112:2025 clause
-- text for this pass. Flag this to your team before quoting it
-- as a "must have" fact to a judge.]
-- ------------------------------------------------------------
INSERT INTO purity_grades (metal_type, purity_label, fineness_value, standard_id, notes) VALUES
('gold', '14K', 585, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), NULL),
('gold', '18K', 750, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), NULL),
('gold', '20K', 833, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), NULL),
('gold', '22K', 916, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), 'most common grade sold in India'),
('gold', '23K', 958, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), NULL),
('gold', '24KS', 995, (SELECT id FROM standards WHERE is_number='IS 1417:2016'), '24K special — coins/bars, too soft for most jewellery'),
('silver', '800', 800, (SELECT id FROM standards WHERE is_number='IS 2112:2025'), 'VERIFY against IS 2112:2025 clause text before citing in demo'),
('silver', '835', 835, (SELECT id FROM standards WHERE is_number='IS 2112:2025'), 'VERIFY against IS 2112:2025 clause text before citing in demo'),
('silver', '925', 925, (SELECT id FROM standards WHERE is_number='IS 2112:2025'), 'sterling silver — VERIFY against IS 2112:2025 clause text before citing in demo'),
('silver', '970', 970, (SELECT id FROM standards WHERE is_number='IS 2112:2025'), 'VERIFY against IS 2112:2025 clause text before citing in demo'),
('silver', '990', 990, (SELECT id FROM standards WHERE is_number='IS 2112:2025'), 'VERIFY against IS 2112:2025 clause text before citing in demo');

-- ------------------------------------------------------------
-- hallmark_components
-- What's physically marked on the article.
-- ------------------------------------------------------------
INSERT INTO hallmark_components (metal_type, component_name, description, example_value, standard_id) VALUES
('gold', 'BIS triangle logo', 'Official certification mark: a triangle containing a tick and the letters "BIS", laser-engraved into the metal.', NULL, (SELECT id FROM standards WHERE is_number='IS 1417:2016')),
('gold', 'Purity/fineness grade', 'Caratage plus fineness in parts per thousand, e.g. 22K916 means 22 karat, 916 parts per 1000 fine.', '22K916', (SELECT id FROM standards WHERE is_number='IS 1417:2016')),
('gold', 'HUID', 'Six-character alphanumeric Hallmark Unique Identification Number, unique per article, traceable via BIS CARE app to the jeweller and AHC.', 'AZ4F9P', (SELECT id FROM standards WHERE is_number='IS 1417:2016')),
('silver', 'BIS logo + "SILVER" word mark', 'BIS triangle logo shown together with the word "SILVER" to distinguish from gold hallmarks.', NULL, (SELECT id FROM standards WHERE is_number='IS 2112:2025')),
('silver', 'Purity/fineness grade', 'Fineness in parts per thousand, e.g. 925 for sterling silver.', '925', (SELECT id FROM standards WHERE is_number='IS 2112:2025')),
('silver', 'HUID', 'Six-character alphanumeric code, required on any silver article that is hallmarked (hallmarking itself is voluntary; the HUID is not optional once you choose to hallmark).', 'HU8J9K', (SELECT id FROM standards WHERE is_number='IS 2112:2025'));

-- ------------------------------------------------------------
-- hallmarking_rules  ***the deterministic backbone***
-- ------------------------------------------------------------
INSERT INTO hallmarking_rules
(metal_type, article_type, hallmarking_required, required_since, huid_required, coverage_note, penalty_note, standard_id, last_verified)
VALUES
('gold', 'jewellery_artefacts', 'mandatory', '2023-04-01', 1,
 'Phased rollout began 23 June 2021 (256 districts, then 288). Sale of gold jewellery/artefacts without HUID banned nationwide from 1 April 2023. District coverage for AHC infrastructure reached approximately 380 districts by March 2026 — treat "mandatory" as nationwide for sale, and check current district count for AHC availability specifically.',
 'BIS Act 2016: non-compliance can attract imprisonment up to 2 years and/or fine of Rs. 1 lakh to Rs. 5 lakh. Under BIS Rules 2018 sec. 49, a consumer sold under-purity hallmarked jewellery is entitled to 2x compensation on the purity shortfall.',
 (SELECT id FROM standards WHERE is_number='IS 1417:2016'), '2026-08-28'),

('gold', 'bullion_coin', 'voluntary', NULL, 0,
 'As of this research pass, gold bullion/coin hallmarking remains voluntary. BIS has proposed mandatory hallmarking for gold bullion and was in stakeholder consultation on draft guidelines as of the most recent source found — VERIFY current status before demo, this is the fastest-moving fact in the dataset.',
 NULL,
 (SELECT id FROM standards WHERE is_number='IS 1417:2016'), '2026-08-28'),

('silver', 'jewellery_articles', 'voluntary', '2025-09-01', 1,
 'IS 2112:2025 introduced HUID-based silver hallmarking on a voluntary basis from 1 September 2025, replacing IS 2112:2014. Government was reported to be reviewing whether to make silver hallmarking mandatory as of mid-2026 — VERIFY current status before demo.',
 NULL,
 (SELECT id FROM standards WHERE is_number='IS 2112:2025'), '2026-08-28');

-- ------------------------------------------------------------
-- product_types
-- Front-door mapping for the demo: plain product name -> the
-- (metal_type, article_type) key that hallmarking_rules uses.
-- Extend this table freely as you add demo product descriptions.
-- ------------------------------------------------------------
INSERT INTO product_types (product_type, metal_type, article_type, notes) VALUES
('gold ring', 'gold', 'jewellery_artefacts', NULL),
('gold necklace', 'gold', 'jewellery_artefacts', NULL),
('gold chain', 'gold', 'jewellery_artefacts', NULL),
('gold bangle', 'gold', 'jewellery_artefacts', NULL),
('gold earrings', 'gold', 'jewellery_artefacts', NULL),
('gold pendant', 'gold', 'jewellery_artefacts', NULL),
('gold artefact / idol', 'gold', 'jewellery_artefacts', NULL),
('gold coin', 'gold', 'bullion_coin', 'investment coin, not jewellery — different rule row'),
('gold bar', 'gold', 'bullion_coin', NULL),
('silver ring', 'silver', 'jewellery_articles', NULL),
('silver chain', 'silver', 'jewellery_articles', NULL),
('silver utensils / articles', 'silver', 'jewellery_articles', NULL),
('silver coin', 'silver', 'jewellery_articles', 'IS 2112:2025 title covers "jewellery and articles" — VERIFY whether coins fall under this or are treated separately');