-- ============================================================
-- MDUMENI — Zimbabwe Market Intelligence Seed Data
-- Run AFTER schema_market.sql
-- Real markets, suppliers, and baseline prices from Zimbabwe
-- ============================================================

-- ── MARKETS ───────────────────────────────────────────────────────────────────
INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

-- Open markets
('MKT_MBARE',         'Mbare Musika',              'open_market',  'Harare',              'Harare',          -17.8333,  31.0500, '+263242664000', 0,    ARRAY['cash','ecocash']),
('MKT_MUTARE',        'Mutare Market',             'open_market',  'Manicaland',          'Mutare',          -18.9707,  32.6709, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_BULAWAYO',      'Bulawayo City Market',      'open_market',  'Bulawayo',            'Bulawayo',        -20.1500,  28.5833, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_MASVINGO',      'Masvingo Market',           'open_market',  'Masvingo',            'Masvingo',        -20.0744,  30.8328, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_KWEKWE',        'Kwekwe Market',             'open_market',  'Midlands',            'Kwekwe',          -18.9167,  29.8167, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_GWERU',         'Gweru Market',              'open_market',  'Midlands',            'Gweru',           -19.4500,  29.8167, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_MARONDERA',     'Marondera Market',          'open_market',  'Mashonaland East',    'Marondera',       -18.1833,  31.5500, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_CHINHOYI',      'Chinhoyi Market',           'open_market',  'Mashonaland West',    'Chinhoyi',        -17.3667,  30.2000, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_BINDURA',       'Bindura Market',            'open_market',  'Mashonaland Central', 'Bindura',         -17.3000,  31.3333, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_CHIREDZI',      'Chiredzi Market',           'open_market',  'Masvingo',            'Chiredzi',        -21.0500,  31.6667, NULL,            0,    ARRAY['cash','ecocash']),

-- GMB depots
('MKT_GMB_HAR',       'GMB Harare Depot',          'gmb_depot',    'Harare',              'Harare',          -17.8700,  30.9700, '+263242753700', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_BUL',       'GMB Bulawayo Depot',        'gmb_depot',    'Bulawayo',            'Bulawayo',        -20.1450,  28.6010, '+263292888140', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_MAR',       'GMB Marondera Depot',       'gmb_depot',    'Mashonaland East',    'Marondera',       -18.1900,  31.5600, '+263279024280', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_MUT',       'GMB Mutare Depot',          'gmb_depot',    'Manicaland',          'Mutare',          -18.9650,  32.6600, '+263202644444', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_GWE',       'GMB Gweru Depot',           'gmb_depot',    'Midlands',            'Gweru',           -19.4500,  29.8100, '+263254223601', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_CHI',       'GMB Chinhoyi Depot',        'gmb_depot',    'Mashonaland West',    'Chinhoyi',        -17.3700,  30.2100, '+263267122490', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_BIN',       'GMB Bindura Depot',         'gmb_depot',    'Mashonaland Central', 'Bindura',         -17.3050,  31.3300, '+263271720500', 1000, ARRAY['bank_transfer','cheque','ecocash']),

-- Export buyers
('MKT_EXP_HAR1',      'Export Buyer — Afrocom',    'export_buyer', 'Harare',              'Harare',          -17.8250,  31.0333, '+263242776600', 5000, ARRAY['bank_transfer','ecocash']),
('MKT_EXP_HAR2',      'Export Buyer — ZimTrade',   'export_buyer', 'Harare',              'Harare',          -17.8190,  31.0500, '+263242702600', 10000,ARRAY['bank_transfer']),
('MKT_EXP_CHI',       'Export Buyer — Chiredzi',   'export_buyer', 'Masvingo',            'Chiredzi',        -21.0600,  31.6700, NULL,            2000, ARRAY['bank_transfer','cash'])

ON CONFLICT (id) DO NOTHING;

-- ── SUPPLIERS ─────────────────────────────────────────────────────────────────
INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

-- Windmill Farm Stores
('SUP_WINDMILL_HAR',  'Windmill Farm Stores', 'Harare',       'agro_dealer', 'Harare',              'Harare',          -17.8200, 31.0400, '+263242252252'),
('SUP_WINDMILL_MAR',  'Windmill Farm Stores', 'Marondera',    'agro_dealer', 'Mashonaland East',    'Marondera',       -18.1800, 31.5500, '+263279023100'),
('SUP_WINDMILL_CHI',  'Windmill Farm Stores', 'Chinhoyi',     'agro_dealer', 'Mashonaland West',    'Chinhoyi',        -17.3600, 30.2000, '+263267122100'),
('SUP_WINDMILL_GWE',  'Windmill Farm Stores', 'Gweru',        'agro_dealer', 'Midlands',            'Gweru',           -19.4400, 29.8100, '+263254220100'),
('SUP_WINDMILL_BUL',  'Windmill Farm Stores', 'Bulawayo',     'agro_dealer', 'Bulawayo',            'Bulawayo',        -20.1600, 28.5900, '+263292884100'),

-- Agrifoods
('SUP_AGRIFOODS_HAR', 'Agrifoods',           'Harare',       'agro_dealer', 'Harare',              'Harare',          -17.8300, 31.0200, '+263242792100'),
('SUP_AGRIFOODS_MAR', 'Agrifoods',           'Marondera',    'agro_dealer', 'Mashonaland East',    'Marondera',       -18.1850, 31.5450, '+263279023500'),
('SUP_AGRIFOODS_MUT', 'Agrifoods',           'Mutare',       'agro_dealer', 'Manicaland',          'Mutare',          -18.9700, 32.6600, '+263202644100'),

-- Seed Co
('SUP_SEEDCO_HAR',    'Seed Co',             'Harare',       'seed_company','Harare',              'Harare',          -17.8150, 31.0350, '+263242664400'),
('SUP_SEEDCO_BUL',    'Seed Co',             'Bulawayo',     'seed_company','Bulawayo',            'Bulawayo',        -20.1500, 28.5850, '+263292880500'),
('SUP_SEEDCO_GWE',    'Seed Co',             'Gweru',        'seed_company','Midlands',            'Gweru',           -19.4450, 29.8050, '+263254221500'),

-- Pannar
('SUP_PANNAR_HAR',    'Pannar Seeds',        'Harare',       'seed_company','Harare',              'Harare',          -17.8220, 31.0420, '+263242700300'),

-- Pioneer / Corteva
('SUP_PIONEER_HAR',   'Pioneer Seeds',       'Harare',       'seed_company','Harare',              'Harare',          -17.8280, 31.0380, '+263242700400'),

-- ZFC (Zimbabwe Fertiliser Company)
('SUP_ZFC_HAR',       'ZFC Limited',         'Harare',       'fertiliser',  'Harare',              'Harare',          -17.8100, 31.0300, '+263242704100'),
('SUP_ZFC_CHI',       'ZFC Limited',         'Chinhoyi',     'fertiliser',  'Mashonaland West',    'Chinhoyi',        -17.3650, 30.2050, '+263267122200'),

-- Farm & City
('SUP_FARMCITY_HAR',  'Farm & City Centre',  'Harare',       'agro_dealer', 'Harare',              'Harare',          -17.8320, 31.0480, '+263242700700'),
('SUP_FARMCITY_BUL',  'Farm & City Centre',  'Bulawayo',     'agro_dealer', 'Bulawayo',            'Bulawayo',        -20.1520, 28.5870, '+263292882100'),

-- Agro-dealers
('SUP_LOCAL_BIN',     'Bindura Agro-Dealer', 'Bindura',      'agro_dealer', 'Mashonaland Central', 'Bindura',         -17.3020, 31.3310, NULL),
('SUP_LOCAL_MVU',     'Mvurwi Agro-Dealer',  'Mvurwi',       'agro_dealer', 'Mashonaland Central', 'Mazowe',          -17.0500, 30.8500, NULL),

-- Tractor hire
('SUP_TRACTOR_MAR',   'Marondera Tractor Hire', 'Marondera', 'equipment',   'Mashonaland East',    'Marondera',       -18.1870, 31.5520, '+263279023900'),
('SUP_TRACTOR_HAR',   'Harare Mechanisation',   'Harare',    'equipment',   'Harare',              'Harare',          -17.8250, 31.0450, '+263242701100')

ON CONFLICT (id) DO NOTHING;

-- ── MARKET PRICES (crop sell prices today) ────────────────────────────────────
INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans
('CROP_002', 'Sugar beans', 'MKT_EXP_HAR1',  0.81, 'premium',  'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_MBARE',      0.74, 'standard', 'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_GMB_HAR',    0.68, 'standard', 'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_MARONDERA',  0.70, 'standard', 'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_MUTARE',     0.69, 'standard', 'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_BULAWAYO',   0.67, 'standard', 'manual', CURRENT_DATE),
('CROP_002', 'Sugar beans', 'MKT_GMB_BUL',    0.66, 'standard', 'manual', CURRENT_DATE),

-- Maize (white)
('CROP_001', 'Maize',       'MKT_GMB_HAR',    0.28, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_GMB_BUL',    0.28, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_GMB_MAR',    0.28, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_MBARE',      0.25, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_BULAWAYO',   0.24, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_MARONDERA',  0.26, 'standard', 'manual', CURRENT_DATE),
('CROP_001', 'Maize',       'MKT_GWERU',      0.25, 'standard', 'manual', CURRENT_DATE),

-- Groundnuts
('CROP_003', 'Groundnuts',  'MKT_EXP_HAR1',   0.91, 'premium',  'manual', CURRENT_DATE),
('CROP_003', 'Groundnuts',  'MKT_EXP_HAR2',   0.88, 'premium',  'manual', CURRENT_DATE),
('CROP_003', 'Groundnuts',  'MKT_MBARE',       0.75, 'standard', 'manual', CURRENT_DATE),
('CROP_003', 'Groundnuts',  'MKT_GMB_HAR',     0.70, 'standard', 'manual', CURRENT_DATE),
('CROP_003', 'Groundnuts',  'MKT_BULAWAYO',    0.72, 'standard', 'manual', CURRENT_DATE),
('CROP_003', 'Groundnuts',  'MKT_GWERU',       0.68, 'standard', 'manual', CURRENT_DATE),

-- Sorghum
('CROP_006', 'Sorghum',     'MKT_GMB_HAR',     0.22, 'standard', 'manual', CURRENT_DATE),
('CROP_006', 'Sorghum',     'MKT_MBARE',       0.20, 'standard', 'manual', CURRENT_DATE),
('CROP_006', 'Sorghum',     'MKT_MARONDERA',   0.21, 'standard', 'manual', CURRENT_DATE),
('CROP_006', 'Sorghum',     'MKT_BULAWAYO',    0.19, 'standard', 'manual', CURRENT_DATE),

-- Cowpeas
('CROP_008', 'Cowpeas',     'MKT_MBARE',       0.65, 'standard', 'manual', CURRENT_DATE),
('CROP_008', 'Cowpeas',     'MKT_GMB_HAR',     0.60, 'standard', 'manual', CURRENT_DATE),
('CROP_008', 'Cowpeas',     'MKT_BULAWAYO',    0.62, 'standard', 'manual', CURRENT_DATE),

-- Soybeans
('CROP_009', 'Soybeans',    'MKT_EXP_HAR1',   0.55, 'standard', 'manual', CURRENT_DATE),
('CROP_009', 'Soybeans',    'MKT_GMB_HAR',     0.48, 'standard', 'manual', CURRENT_DATE),
('CROP_009', 'Soybeans',    'MKT_MBARE',       0.50, 'standard', 'manual', CURRENT_DATE),

-- Sunflower
('CROP_010', 'Sunflower',   'MKT_GMB_HAR',     0.42, 'standard', 'manual', CURRENT_DATE),
('CROP_010', 'Sunflower',   'MKT_MBARE',       0.38, 'standard', 'manual', CURRENT_DATE),
('CROP_010', 'Sunflower',   'MKT_BULAWAYO',    0.40, 'standard', 'manual', CURRENT_DATE),

-- Sweet potato
('CROP_004', 'Sweet potato','MKT_MBARE',       0.35, 'standard', 'manual', CURRENT_DATE),
('CROP_004', 'Sweet potato','MKT_BULAWAYO',    0.30, 'standard', 'manual', CURRENT_DATE),
('CROP_004', 'Sweet potato','MKT_GWERU',       0.32, 'standard', 'manual', CURRENT_DATE),

-- Tomatoes
('CROP_019', 'Tomatoes',    'MKT_MBARE',       0.45, 'standard', 'manual', CURRENT_DATE),
('CROP_019', 'Tomatoes',    'MKT_MUTARE',      0.42, 'standard', 'manual', CURRENT_DATE),
('CROP_019', 'Tomatoes',    'MKT_BULAWAYO',    0.40, 'standard', 'manual', CURRENT_DATE),
('CROP_019', 'Tomatoes',    'MKT_MARONDERA',   0.44, 'standard', 'manual', CURRENT_DATE),

-- Onions
('CROP_020', 'Onions',      'MKT_MBARE',       0.55, 'standard', 'manual', CURRENT_DATE),
('CROP_020', 'Onions',      'MKT_BULAWAYO',    0.50, 'standard', 'manual', CURRENT_DATE),
('CROP_020', 'Onions',      'MKT_GWERU',       0.48, 'standard', 'manual', CURRENT_DATE),

-- Cabbages
('CROP_018', 'Cabbages',    'MKT_MBARE',       0.25, 'standard', 'manual', CURRENT_DATE),
('CROP_018', 'Cabbages',    'MKT_BULAWAYO',    0.22, 'standard', 'manual', CURRENT_DATE),
('CROP_018', 'Cabbages',    'MKT_GWERU',       0.20, 'standard', 'manual', CURRENT_DATE),

-- Pearl millet
('CROP_007', 'Pearl millet','MKT_GMB_BUL',     0.18, 'standard', 'manual', CURRENT_DATE),
('CROP_007', 'Pearl millet','MKT_BULAWAYO',    0.16, 'standard', 'manual', CURRENT_DATE),

-- Cotton (seed cotton)
('CROP_011', 'Cotton',      'MKT_GMB_HAR',     0.38, 'standard', 'manual', CURRENT_DATE),
('CROP_011', 'Cotton',      'MKT_CHIREDZI',    0.37, 'standard', 'manual', CURRENT_DATE),

-- Sesame
('CROP_016', 'Sesame',      'MKT_EXP_HAR1',   1.85, 'premium',  'manual', CURRENT_DATE),
('CROP_016', 'Sesame',      'MKT_MBARE',       1.50, 'standard', 'manual', CURRENT_DATE)
;

-- ── INPUT PRICES ──────────────────────────────────────────────────────────────
INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- ── FERTILISERS ──────────────────────────────────────────────────────────────
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_WINDMILL_MAR',  17.20, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_WINDMILL_HAR',  17.80, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_AGRIFOODS_HAR', 18.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_AGRIFOODS_MAR', 17.20, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_ZFC_HAR',       16.90, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_WINDMILL_BUL',  17.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_D_50',   'Compound D (7:14:7)',       'fertiliser', 'SUP_FARMCITY_HAR',  18.00, 'bag',   '50kg', 'manual', CURRENT_DATE),

('INP_COMP_C_50',   'Compound C (5:18:12+Zn)',  'fertiliser', 'SUP_WINDMILL_HAR',  18.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_C_50',   'Compound C (5:18:12+Zn)',  'fertiliser', 'SUP_AGRIFOODS_HAR', 19.00, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_COMP_C_50',   'Compound C (5:18:12+Zn)',  'fertiliser', 'SUP_ZFC_HAR',       17.80, 'bag',   '50kg', 'manual', CURRENT_DATE),

('INP_AN_345_50',   'AN 34.5% Ammonium Nitrate','fertiliser', 'SUP_WINDMILL_HAR',  22.00, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AN_345_50',   'AN 34.5% Ammonium Nitrate','fertiliser', 'SUP_AGRIFOODS_HAR', 21.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AN_345_50',   'AN 34.5% Ammonium Nitrate','fertiliser', 'SUP_ZFC_HAR',       21.00, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AN_345_50',   'AN 34.5% Ammonium Nitrate','fertiliser', 'SUP_WINDMILL_MAR',  22.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AN_345_50',   'AN 34.5% Ammonium Nitrate','fertiliser', 'SUP_WINDMILL_BUL',  22.20, 'bag',   '50kg', 'manual', CURRENT_DATE),

('INP_CAN_50',      'CAN 27% Calcium Ammonium', 'fertiliser', 'SUP_ZFC_HAR',       19.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_CAN_50',      'CAN 27% Calcium Ammonium', 'fertiliser', 'SUP_WINDMILL_HAR',  20.00, 'bag',   '50kg', 'manual', CURRENT_DATE),

('INP_UREA_50',     'Urea 46% Nitrogen',        'fertiliser', 'SUP_ZFC_HAR',       25.00, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_UREA_50',     'Urea 46% Nitrogen',        'fertiliser', 'SUP_WINDMILL_HAR',  25.80, 'bag',   '50kg', 'manual', CURRENT_DATE),

('INP_AGRILIME_50', 'Agricultural Lime',        'fertiliser', 'SUP_AGRIFOODS_HAR',  3.50, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AGRILIME_50', 'Agricultural Lime',        'fertiliser', 'SUP_WINDMILL_HAR',   3.80, 'bag',   '50kg', 'manual', CURRENT_DATE),
('INP_AGRILIME_50', 'Agricultural Lime',        'fertiliser', 'SUP_ZFC_HAR',         3.20, 'bag',   '50kg', 'manual', CURRENT_DATE),

-- ── SEEDS ────────────────────────────────────────────────────────────────────
('INP_SEED_ZM521',  'Maize Seed ZM521 OPV',     'seed', 'SUP_SEEDCO_HAR',   7.50, 'bag',  '10kg', 'manual', CURRENT_DATE),
('INP_SEED_ZM521',  'Maize Seed ZM521 OPV',     'seed', 'SUP_AGRIFOODS_HAR',7.80, 'bag',  '10kg', 'manual', CURRENT_DATE),
('INP_SEED_ZM521',  'Maize Seed ZM521 OPV',     'seed', 'SUP_WINDMILL_HAR', 7.60, 'bag',  '10kg', 'manual', CURRENT_DATE),

('INP_SEED_SC403',  'Maize Seed SC403 Hybrid',  'seed', 'SUP_SEEDCO_HAR',  12.50, 'bag',  '10kg', 'manual', CURRENT_DATE),
('INP_SEED_SC403',  'Maize Seed SC403 Hybrid',  'seed', 'SUP_AGRIFOODS_HAR',13.00,'bag',  '10kg', 'manual', CURRENT_DATE),
('INP_SEED_SC403',  'Maize Seed SC403 Hybrid',  'seed', 'SUP_WINDMILL_HAR', 12.80,'bag',  '10kg', 'manual', CURRENT_DATE),

('INP_SEED_SC627',  'Maize Seed SC627 Hybrid',  'seed', 'SUP_SEEDCO_HAR',  15.00, 'bag',  '10kg', 'manual', CURRENT_DATE),
('INP_SEED_SC627',  'Maize Seed SC627 Hybrid',  'seed', 'SUP_AGRIFOODS_HAR',15.50,'bag',  '10kg', 'manual', CURRENT_DATE),

('INP_SEED_SB_1KG', 'Sugar Bean Seed Chivaura', 'seed', 'SUP_SEEDCO_HAR',   1.80, 'kg',   '1kg',  'manual', CURRENT_DATE),
('INP_SEED_SB_1KG', 'Sugar Bean Seed Chivaura', 'seed', 'SUP_AGRIFOODS_HAR',1.90, 'kg',   '1kg',  'manual', CURRENT_DATE),
('INP_SEED_SB_1KG', 'Sugar Bean Seed Chivaura', 'seed', 'SUP_WINDMILL_HAR', 1.85, 'kg',   '1kg',  'manual', CURRENT_DATE),

('INP_SEED_GN_1KG', 'Groundnut Seed Falcon',    'seed', 'SUP_SEEDCO_HAR',   2.50, 'kg',   '1kg',  'manual', CURRENT_DATE),
('INP_SEED_GN_1KG', 'Groundnut Seed Falcon',    'seed', 'SUP_WINDMILL_HAR', 2.60, 'kg',   '1kg',  'manual', CURRENT_DATE),

('INP_SEED_SG_1KG', 'Sorghum Seed SV2',         'seed', 'SUP_SEEDCO_HAR',   3.50, 'kg',   '1kg',  'manual', CURRENT_DATE),
('INP_SEED_SG_1KG', 'Sorghum Seed SV2',         'seed', 'SUP_AGRIFOODS_HAR',3.60, 'kg',   '1kg',  'manual', CURRENT_DATE),

('INP_SEED_SB_PAN', 'Sugar Bean PAN 9216',      'seed', 'SUP_PANNAR_HAR',   2.20, 'kg',   '1kg',  'manual', CURRENT_DATE),
('INP_SEED_MZ_PAN', 'Maize Pannar PAN53',        'seed', 'SUP_PANNAR_HAR',  11.50, 'bag',  '10kg', 'manual', CURRENT_DATE),

-- ── CHEMICALS (herbicides, insecticides, fungicides) ──────────────────────────
('INP_ATRAZINE_1L', 'Atrazine 500SC 1L',        'chemical', 'SUP_WINDMILL_HAR',  5.50, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_ATRAZINE_1L', 'Atrazine 500SC 1L',        'chemical', 'SUP_AGRIFOODS_HAR', 5.80, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_ATRAZINE_1L', 'Atrazine 500SC 1L',        'chemical', 'SUP_FARMCITY_HAR',  5.60, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L',     'chemical', 'SUP_WINDMILL_HAR',  4.20, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L',     'chemical', 'SUP_AGRIFOODS_HAR', 4.50, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_NICOSULF_1L', 'Nicosulfuron 40SC 1L',     'chemical', 'SUP_WINDMILL_HAR', 18.00, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_NICOSULF_1L', 'Nicosulfuron 40SC 1L',     'chemical', 'SUP_AGRIFOODS_HAR',19.00, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_CHLORPYR_1L', 'Chlorpyrifos 480EC 1L',    'chemical', 'SUP_WINDMILL_HAR',  7.50, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_CHLORPYR_1L', 'Chlorpyrifos 480EC 1L',    'chemical', 'SUP_AGRIFOODS_HAR', 7.80, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_CHLORPYR_1L', 'Chlorpyrifos 480EC 1L',    'chemical', 'SUP_FARMCITY_HAR',  7.60, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_EMAMECTIN_200G','Emamectin (Proclaim) 200g','chemical',  'SUP_WINDMILL_HAR', 22.00, 'each',  '200g','manual', CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin (Proclaim) 200g','chemical',  'SUP_AGRIFOODS_HAR',23.00,'each',  '200g','manual', CURRENT_DATE),

('INP_DIMETHOATE_1L','Dimethoate 400EC 1L',     'chemical', 'SUP_WINDMILL_HAR',  5.80, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L',     'chemical', 'SUP_AGRIFOODS_HAR', 6.00, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg',        'chemical', 'SUP_WINDMILL_HAR',  8.50, 'each',  '1kg', 'manual', CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg',        'chemical', 'SUP_AGRIFOODS_HAR', 9.00, 'each',  '1kg', 'manual', CURRENT_DATE),

('INP_LAMBDA_1L',   'Lambda-cyhalothrin 50EC 1L','chemical', 'SUP_WINDMILL_HAR',  9.50, 'litre', '1L',  'manual', CURRENT_DATE),
('INP_LAMBDA_1L',   'Lambda-cyhalothrin 50EC 1L','chemical', 'SUP_AGRIFOODS_HAR',10.00, 'litre', '1L',  'manual', CURRENT_DATE),

('INP_NEEM_1L',     'Neem Extract 1L (organic)', 'chemical', 'SUP_FARMCITY_HAR',  6.00, 'litre', '1L',  'manual', CURRENT_DATE),

-- ── MACHINERY ────────────────────────────────────────────────────────────────
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_MAR', 55.00, 'hectare', 'per ha', 'manual', CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_HAR', 60.00, 'hectare', 'per ha', 'manual', CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',          'machinery','SUP_TRACTOR_MAR', 20.00, 'hectare', 'per ha', 'manual', CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',          'machinery','SUP_TRACTOR_MAR', 15.00, 'hectare', 'per ha', 'manual', CURRENT_DATE),
('INP_SHELLER_DAY',   'Maize sheller (day rate)',   'machinery','SUP_TRACTOR_MAR',  0.80, 'bag',     'per 90kg bag', 'manual', CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire (day)', 'machinery','SUP_TRACTOR_HAR', 25.00, 'day',     'per day', 'manual', CURRENT_DATE),

-- ── EQUIPMENT ────────────────────────────────────────────────────────────────
('INP_KNAPSACK_15L', 'Knapsack sprayer 15L',       'equipment','SUP_WINDMILL_HAR', 28.00, 'each',  'each',  'manual', CURRENT_DATE),
('INP_KNAPSACK_15L', 'Knapsack sprayer 15L',       'equipment','SUP_FARMCITY_HAR', 30.00, 'each',  'each',  'manual', CURRENT_DATE),
('INP_HERMETIC_50',  'Hermetic bag PICS 50kg',     'equipment','SUP_AGRIFOODS_HAR', 2.80, 'each',  'each',  'manual', CURRENT_DATE),
('INP_HERMETIC_50',  'Hermetic bag PICS 50kg',     'equipment','SUP_WINDMILL_HAR',  3.00, 'each',  'each',  'manual', CURRENT_DATE),
('INP_MOISTURE_MTR', 'Grain moisture meter',        'equipment','SUP_FARMCITY_HAR', 35.00, 'each',  'each',  'manual', CURRENT_DATE)
;

-- ── VERIFY ────────────────────────────────────────────────────────────────────
-- After running, verify:
-- SELECT COUNT(*) FROM markets;     -- should be 20
-- SELECT COUNT(*) FROM suppliers;   -- should be 22
-- SELECT COUNT(*) FROM market_prices; -- should be 60+
-- SELECT COUNT(*) FROM input_prices;  -- should be 60+
-- SELECT * FROM best_crop_prices_today LIMIT 5;
-- SELECT * FROM cheapest_inputs_today WHERE category = 'fertiliser' LIMIT 5;
