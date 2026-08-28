-- ============================================================
-- BIS Hallmarking Discovery — Database Schema
-- Run this FIRST in MySQL Workbench.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `soumi-database`;
USE `soumi-database`;

-- ------------------------------------------------------------
-- 1. standards
-- One row per IS number. This is your evidence/citation layer —
-- every other table points back here via standard_id, so a claim
-- like "mandatory" always traces to one specific standard record.
-- (Unchanged from your original schema.sql, with last_verified added.)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS standards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_number VARCHAR(50) NOT NULL,
    standard_title VARCHAR(255) NOT NULL,
    applicability TEXT,
    required_documents TEXT,
    procedures TEXT,
    official_source TEXT,
    testing_certification TEXT,
    last_verified DATE
);

-- ------------------------------------------------------------
-- 2. purity_grades
-- Valid fineness levels per metal. Many-to-one with standards
-- (IS 1417 permits 6 gold grades — one row each, not one
-- comma-separated string, so you can query/filter by grade).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purity_grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metal_type VARCHAR(20) NOT NULL,        -- 'gold' | 'silver'
    purity_label VARCHAR(20) NOT NULL,      -- '22K', '925'
    fineness_value INT NOT NULL,            -- 916 (parts per thousand)
    standard_id INT,
    notes VARCHAR(255),
    FOREIGN KEY (standard_id) REFERENCES standards(id)
);

-- ------------------------------------------------------------
-- 3. hallmark_components
-- What marks actually appear on a hallmarked article, per metal.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hallmark_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metal_type VARCHAR(20) NOT NULL,
    component_name VARCHAR(100) NOT NULL,   -- 'BIS triangle logo'
    description TEXT,
    example_value VARCHAR(100),             -- 'AZ4F9P'
    standard_id INT,
    FOREIGN KEY (standard_id) REFERENCES standards(id)
);

-- ------------------------------------------------------------
-- 4. hallmarking_rules  ***the deterministic backbone***
-- This is the table your LLM never touches. One row per
-- (metal_type, article_type) tells you mandatory vs voluntary,
-- since when, whether HUID is required, and the penalty basis.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hallmarking_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metal_type VARCHAR(20) NOT NULL,
    article_type VARCHAR(50) NOT NULL,      -- 'jewellery' | 'bullion_coin'
    hallmarking_required VARCHAR(20) NOT NULL,  -- 'mandatory' | 'voluntary'
    required_since DATE,
    huid_required TINYINT(1) NOT NULL DEFAULT 0,
    coverage_note TEXT,                     -- district rollout / scope caveat
    penalty_note TEXT,
    standard_id INT,
    last_verified DATE,
    FOREIGN KEY (standard_id) REFERENCES standards(id)
);

-- ------------------------------------------------------------
-- 5. product_types
-- Maps a plain-language product name to (metal_type, article_type)
-- so the demo can go: "gold ring" -> gold/jewellery -> rules lookup.
-- This is your front-door mapping table — the thing a dropdown or
-- a simple keyword match populates in the demo UI.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_type VARCHAR(100) NOT NULL,     -- 'gold ring'
    metal_type VARCHAR(20) NOT NULL,
    article_type VARCHAR(50) NOT NULL,
    notes VARCHAR(255)
);
