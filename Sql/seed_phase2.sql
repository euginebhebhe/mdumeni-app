-- ============================================================
-- MDUMENI Phase 2 — Expanded Zimbabwe Market Data
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Run AFTER the original seed_market_data.sql
-- ============================================================

-- ══ NEW SUPPLIERS — all provinces ════════════════════════════════════════════

INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

-- Windmill — more branches
('SUP_WINDMILL_MUT', 'Windmill Farm Stores', 'Mutare',    'agro_dealer', 'Manicaland',          'Mutare',          -18.9707, 32.6709, '+263202644200'),
('SUP_WINDMILL_MSV', 'Windmill Farm Stores', 'Masvingo',  'agro_dealer', 'Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262100'),
('SUP_WINDMILL_BIN', 'Windmill Farm Stores', 'Bindura',   'agro_dealer', 'Mashonaland Central', 'Bindura',         -17.3000, 31.3333, '+263271720100'),
('SUP_WINDMILL_KWE', 'Windmill Farm Stores', 'Kwekwe',    'agro_dealer', 'Midlands',            'Kwekwe',          -18.9167, 29.8167, '+263255523100'),
('SUP_WINDMILL_ZVS', 'Windmill Farm Stores', 'Zvishavane','agro_dealer', 'Midlands',            'Zvishavane',      -20.3333, 30.0333, '+263251323100'),
('SUP_WINDMILL_KAR', 'Windmill Farm Stores', 'Karoi',     'agro_dealer', 'Mashonaland West',    'Karoi',           -16.8167, 29.6833, '+263261223100'),

-- Agrifoods — more branches
('SUP_AGRIFOODS_BUL','Agrifoods',  'Bulawayo',   'agro_dealer', 'Bulawayo',            'Bulawayo',        -20.1500, 28.5833, '+263292882200'),
('SUP_AGRIFOODS_GWE','Agrifoods',  'Gweru',      'agro_dealer', 'Midlands',            'Gweru',           -19.4500, 29.8167, '+263254220200'),
('SUP_AGRIFOODS_CHI','Agrifoods',  'Chinhoyi',   'agro_dealer', 'Mashonaland West',    'Chinhoyi',        -17.3667, 30.2000, '+263267122200'),
('SUP_AGRIFOODS_BIN','Agrifoods',  'Bindura',    'agro_dealer', 'Mashonaland Central', 'Bindura',         -17.3000, 31.3333, '+263271720200'),

-- ZFC — more branches
('SUP_ZFC_BUL',  'ZFC Limited', 'Bulawayo',  'fertiliser', 'Bulawayo',            'Bulawayo',        -20.1500, 28.5833, '+263292884200'),
('SUP_ZFC_GWE',  'ZFC Limited', 'Gweru',     'fertiliser', 'Midlands',            'Gweru',           -19.4500, 29.8167, '+263254223200'),
('SUP_ZFC_MUT',  'ZFC Limited', 'Mutare',    'fertiliser', 'Manicaland',          'Mutare',          -18.9707, 32.6709, '+263202644300'),
('SUP_ZFC_MSV',  'ZFC Limited', 'Masvingo',  'fertiliser', 'Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262200'),

-- Seed Co — more branches
('SUP_SEEDCO_MAR', 'Seed Co', 'Marondera',  'seed_company', 'Mashonaland East',    'Marondera',       -18.1833, 31.5500, '+263279023200'),
('SUP_SEEDCO_MUT', 'Seed Co', 'Mutare',     'seed_company', 'Manicaland',          'Mutare',          -18.9707, 32.6709, '+263202644500'),
('SUP_SEEDCO_MSV', 'Seed Co', 'Masvingo',   'seed_company', 'Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262300'),
('SUP_SEEDCO_CHI', 'Seed Co', 'Chinhoyi',   'seed_company', 'Mashonaland West',    'Chinhoyi',        -17.3667, 30.2000, '+263267122300'),

-- Farm & City — more branches
('SUP_FARMCITY_GWE','Farm & City Centre','Gweru',   'agro_dealer','Midlands',            'Gweru',           -19.4500, 29.8167, '+263254220300'),
('SUP_FARMCITY_MUT','Farm & City Centre','Mutare',  'agro_dealer','Manicaland',          'Mutare',          -18.9707, 32.6709, '+263202644600'),
('SUP_FARMCITY_MSV','Farm & City Centre','Masvingo','agro_dealer','Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262400'),

-- Quton Cotton Company
('SUP_QUTON_CHI',  'Quton Seed',   'Chiredzi',  'seed_company', 'Masvingo',            'Chiredzi',        -21.0500, 31.6667, '+263331222100'),
('SUP_QUTON_HAR',  'Quton Seed',   'Harare',    'seed_company', 'Harare',              'Harare',          -17.8200, 31.0400, '+263242700800'),

-- Cottco
('SUP_COTTCO_CHI', 'Cottco',       'Chiredzi',  'cooperative',  'Masvingo',            'Chiredzi',        -21.0500, 31.6667, '+263331222200'),
('SUP_COTTCO_KAR', 'Cottco',       'Karoi',     'cooperative',  'Mashonaland West',    'Karoi',           -16.8167, 29.6833, '+263261223200'),

-- Local agro-dealers — rural areas
('SUP_LOCAL_CHI',  'Chiredzi Agro-Dealer',  'Chiredzi',  'agro_dealer', 'Masvingo',            'Chiredzi',        -21.0500, 31.6667, NULL),
('SUP_LOCAL_ZVS',  'Zvishavane Agro-Dealer','Zvishavane', 'agro_dealer', 'Midlands',            'Zvishavane',      -20.3333, 30.0333, NULL),
('SUP_LOCAL_MVU',  'Mvurwi Agro-Dealer',    'Mvurwi',    'agro_dealer', 'Mashonaland Central', 'Mazowe',          -17.0500, 30.8500, NULL),
('SUP_LOCAL_KAR',  'Karoi Agro-Dealer',     'Karoi',     'agro_dealer', 'Mashonaland West',    'Karoi',           -16.8167, 29.6833, NULL),
('SUP_LOCAL_BEI',  'Beitbridge Agro-Dealer','Beitbridge','agro_dealer', 'Matabeleland South',  'Beitbridge',      -22.2167, 30.0000, NULL),

-- Tractor hire — more provinces
('SUP_TRACTOR_BUL','Bulawayo Mechanisation','Bulawayo',  'equipment', 'Bulawayo',            'Bulawayo',        -20.1500, 28.5833, '+263292880200'),
('SUP_TRACTOR_MUT','Mutare Tractor Hire',   'Mutare',    'equipment', 'Manicaland',          'Mutare',          -18.9707, 32.6709, '+263202644700'),
('SUP_TRACTOR_GWE','Gweru Mechanisation',   'Gweru',     'equipment', 'Midlands',            'Gweru',           -19.4500, 29.8167, '+263254220400'),
('SUP_TRACTOR_MSV','Masvingo Tractor Hire', 'Masvingo',  'equipment', 'Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262500')

ON CONFLICT (id) DO NOTHING;


-- ══ MORE MARKETS ══════════════════════════════════════════════════════════════

INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

('MKT_ZVISHAVANE',  'Zvishavane Market',     'open_market',  'Midlands',            'Zvishavane',      -20.3333, 30.0333, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_KAROI',       'Karoi Market',          'open_market',  'Mashonaland West',    'Karoi',           -16.8167, 29.6833, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_MVURWI',      'Mvurwi Market',         'open_market',  'Mashonaland Central', 'Mazowe',          -17.0500, 30.8500, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_BEITBRIDGE',  'Beitbridge Market',     'open_market',  'Matabeleland South',  'Beitbridge',      -22.2167, 30.0000, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_GMB_MSV',     'GMB Masvingo Depot',    'gmb_depot',    'Masvingo',            'Masvingo',        -20.0744, 30.8328, '+263239262600', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_KWE',     'GMB Kwekwe Depot',      'gmb_depot',    'Midlands',            'Kwekwe',          -18.9167, 29.8167, '+263255523200', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_EXP_BUL',     'Export Buyer — Bulawayo','export_buyer','Bulawayo',            'Bulawayo',        -20.1450, 28.6000, '+263292880300', 3000, ARRAY['bank_transfer','ecocash']),
('MKT_EXP_MUT',     'Export Buyer — Mutare', 'export_buyer', 'Manicaland',          'Mutare',          -18.9650, 32.6600, '+263202644800', 2000, ARRAY['bank_transfer'])

ON CONFLICT (id) DO NOTHING;


-- ══ EXPANDED FERTILISER PRICES — all provinces ════════════════════════════════

INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- Compound D — all provinces (price increases with distance from Harare)
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MUT', 18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MSV', 18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_BIN', 17.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_KWE', 17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_KAR', 17.90,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_BUL',18.10,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_GWE',17.90,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_CHI',17.70,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_BIN',17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_BUL',      17.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_GWE',      17.40,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_MUT',      17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_MSV',      18.00,'bag','50kg','manual',CURRENT_DATE),

-- Compound S (legume fertiliser — Compound S 6:28:23)
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_HAR', 18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_HAR',      17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_AGRIFOODS_HAR',19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_BUL', 19.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_BUL',      18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_MUT', 19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_GWE',      18.20,'bag','50kg','manual',CURRENT_DATE),

-- Compound L (tobacco base)
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_HAR',20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_ZFC_HAR',     19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_KAR',20.50,'bag','50kg','manual',CURRENT_DATE),

-- AN 34.5% — all provinces
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_MUT', 22.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_MSV', 23.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_BIN', 22.60,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_AGRIFOODS_BUL',22.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_BUL',      21.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_GWE',      21.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_MUT',      22.20,'bag','50kg','manual',CURRENT_DATE),

-- Nitram (ammonium nitrate 34.5% different brand)
('INP_NITRAM_50','Nitram 34.5% AN','fertiliser','SUP_FARMCITY_HAR',22.50,'bag','50kg','manual',CURRENT_DATE),
('INP_NITRAM_50','Nitram 34.5% AN','fertiliser','SUP_FARMCITY_BUL',23.00,'bag','50kg','manual',CURRENT_DATE),
('INP_NITRAM_50','Nitram 34.5% AN','fertiliser','SUP_FARMCITY_GWE',23.20,'bag','50kg','manual',CURRENT_DATE),
('INP_NITRAM_50','Nitram 34.5% AN','fertiliser','SUP_FARMCITY_MUT',23.50,'bag','50kg','manual',CURRENT_DATE),

-- Super Phosphate
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_ZFC_HAR',    14.50,'bag','50kg','manual',CURRENT_DATE),
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_ZFC_BUL',    15.00,'bag','50kg','manual',CURRENT_DATE),
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_WINDMILL_HAR',15.20,'bag','50kg','manual',CURRENT_DATE),
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_AGRIFOODS_HAR',15.50,'bag','50kg','manual',CURRENT_DATE),

-- Potassium chloride (MOP)
('INP_MOP_50','Muriate of Potash (MOP) 0:0:60','fertiliser','SUP_ZFC_HAR',    19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_MOP_50','Muriate of Potash (MOP) 0:0:60','fertiliser','SUP_ZFC_BUL',    19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_MOP_50','Muriate of Potash (MOP) 0:0:60','fertiliser','SUP_WINDMILL_HAR',19.80,'bag','50kg','manual',CURRENT_DATE),

-- CAN — all provinces
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_ZFC_BUL',    20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_ZFC_GWE',    19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_WINDMILL_MUT',20.50,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_AGRIFOODS_BUL',20.20,'bag','50kg','manual',CURRENT_DATE),

-- Agrilime — all provinces
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_BUL',      3.60,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_GWE',      3.40,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_MUT',      3.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_BUL', 4.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_MUT', 4.20,'bag','50kg','manual',CURRENT_DATE),


-- ══ EXPANDED SEED PRICES ══════════════════════════════════════════════════════

-- Maize seeds — all provinces
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_MAR',  7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_MUT',  7.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_MSV',  7.90,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_BUL',  7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_AGRIFOODS_BUL',8.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_WINDMILL_BUL', 7.80,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_MAR',12.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_BUL',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_GWE',13.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_MUT',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_CHI',13.00,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_SEEDCO_BUL',15.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_SEEDCO_GWE',15.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_SEEDCO_MUT',15.50,'bag','10kg','manual',CURRENT_DATE),

-- Pannar maize
('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_PANNAR_HAR',    11.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_AGRIFOODS_BUL', 12.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_AGRIFOODS_GWE', 12.20,'bag','10kg','manual',CURRENT_DATE),

-- Sorghum seeds
('INP_SEED_SG_1KG','Sorghum Seed SV2','seed','SUP_SEEDCO_BUL',    3.70,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SG_1KG','Sorghum Seed SV2','seed','SUP_SEEDCO_GWE',    3.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN8625','Sorghum Pannar PAN8625','seed','SUP_PANNAR_HAR',4.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN8625','Sorghum Pannar PAN8625','seed','SUP_AGRIFOODS_BUL',4.50,'kg','1kg','manual',CURRENT_DATE),

-- Groundnut seeds
('INP_SEED_GN_1KG','Groundnut Seed Falcon','seed','SUP_SEEDCO_BUL', 2.70,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Seed Falcon','seed','SUP_AGRIFOODS_BUL',2.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_NATAL', 'Groundnut Natal Common', 'seed','SUP_LOCAL_CHI', 1.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_NATAL', 'Groundnut Natal Common', 'seed','SUP_AGRIFOODS_BUL',2.00,'kg','1kg','manual',CURRENT_DATE),

-- Soybean seeds
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_HAR',    3.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_BUL',    3.40,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN 1867','seed','SUP_PANNAR_HAR',   3.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN 1867','seed','SUP_AGRIFOODS_BUL',3.70,'kg','1kg','manual',CURRENT_DATE),

-- Cotton seeds
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_QUTON_CHI',   5.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_QUTON_HAR',   5.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SZ9314',  'Cotton SZ9314',   'seed','SUP_LOCAL_KAR',  4.80,'kg','1kg','manual',CURRENT_DATE),

-- Sugar bean seeds — more provinces
('INP_SEED_SB_1KG','Sugar Bean Seed Chivaura','seed','SUP_SEEDCO_BUL',  1.95,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Seed Chivaura','seed','SUP_SEEDCO_GWE',  2.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Seed Chivaura','seed','SUP_SEEDCO_MUT',  2.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Seed Chivaura','seed','SUP_SEEDCO_CHI',  1.95,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_PAN','Sugar Bean PAN 9216',     'seed','SUP_PANNAR_HAR',  2.20,'kg','1kg','manual',CURRENT_DATE),

-- Sunflower seeds
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_PANNAR_HAR',    3.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_AGRIFOODS_BUL', 4.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_AGRIFOODS_GWE', 4.10,'kg','1kg','manual',CURRENT_DATE),


-- ══ EXPANDED CHEMICAL PRICES ══════════════════════════════════════════════════

-- Herbicides
('INP_ROUNDUP_1L','Roundup 360SL 1L (Glyphosate)','chemical','SUP_WINDMILL_BUL',4.80,'litre','1L','manual',CURRENT_DATE),
('INP_ROUNDUP_1L','Roundup 360SL 1L (Glyphosate)','chemical','SUP_WINDMILL_MUT',5.00,'litre','1L','manual',CURRENT_DATE),
('INP_ROUNDUP_1L','Roundup 360SL 1L (Glyphosate)','chemical','SUP_AGRIFOODS_BUL',5.20,'litre','1L','manual',CURRENT_DATE),
('INP_ROUNDUP_1L','Roundup 360SL 1L (Glyphosate)','chemical','SUP_FARMCITY_BUL',5.10,'litre','1L','manual',CURRENT_DATE),

('INP_DUALGOLD_1L','Dual Gold 960EC 1L (Metolachlor)','chemical','SUP_WINDMILL_HAR',12.50,'litre','1L','manual',CURRENT_DATE),
('INP_DUALGOLD_1L','Dual Gold 960EC 1L (Metolachlor)','chemical','SUP_AGRIFOODS_HAR',13.00,'litre','1L','manual',CURRENT_DATE),
('INP_DUALGOLD_1L','Dual Gold 960EC 1L (Metolachlor)','chemical','SUP_WINDMILL_BUL',13.20,'litre','1L','manual',CURRENT_DATE),

-- Insecticides
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_WINDMILL_HAR', 6.50,'litre','1L','manual',CURRENT_DATE),
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_WINDMILL_BUL', 6.80,'litre','1L','manual',CURRENT_DATE),
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_AGRIFOODS_BUL',7.00,'litre','1L','manual',CURRENT_DATE),
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_FARMCITY_HAR', 6.80,'litre','1L','manual',CURRENT_DATE),

('INP_ABAMECT_1L', 'Abamectin 18EC 1L','chemical','SUP_WINDMILL_HAR',  14.00,'litre','1L','manual',CURRENT_DATE),
('INP_ABAMECT_1L', 'Abamectin 18EC 1L','chemical','SUP_AGRIFOODS_HAR', 14.50,'litre','1L','manual',CURRENT_DATE),
('INP_ABAMECT_1L', 'Abamectin 18EC 1L','chemical','SUP_WINDMILL_BUL',  14.80,'litre','1L','manual',CURRENT_DATE),

-- Fungicides
('INP_COPPER_1KG', 'Copper Oxychloride 50WP 1kg','chemical','SUP_WINDMILL_HAR', 7.50,'each','1kg','manual',CURRENT_DATE),
('INP_COPPER_1KG', 'Copper Oxychloride 50WP 1kg','chemical','SUP_AGRIFOODS_HAR',8.00,'each','1kg','manual',CURRENT_DATE),
('INP_COPPER_1KG', 'Copper Oxychloride 50WP 1kg','chemical','SUP_WINDMILL_BUL', 8.20,'each','1kg','manual',CURRENT_DATE),

('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_WINDMILL_HAR', 18.00,'each','1kg','manual',CURRENT_DATE),
('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_AGRIFOODS_HAR',19.00,'each','1kg','manual',CURRENT_DATE),
('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_FARMCITY_HAR', 18.50,'each','1kg','manual',CURRENT_DATE),

('INP_SCORE_250ML','Score 250EC 250ml (Difenoconazole)','chemical','SUP_WINDMILL_HAR',12.00,'each','250ml','manual',CURRENT_DATE),
('INP_SCORE_250ML','Score 250EC 250ml (Difenoconazole)','chemical','SUP_AGRIFOODS_HAR',12.50,'each','250ml','manual',CURRENT_DATE),

-- Chemicals — more provinces
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_BUL', 5.80,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_MUT', 6.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_BUL',6.20,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_GWE',6.00,'litre','1L','manual',CURRENT_DATE),

('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_BUL',8.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_MUT',8.20,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGRIFOODS_BUL',8.50,'litre','1L','manual',CURRENT_DATE),


-- ══ MACHINERY — all provinces ═════════════════════════════════════════════════

('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_BUL',58.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_MUT',60.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_GWE',57.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_MSV',62.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_BUL',22.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_MUT',23.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_GWE',21.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_MSV',24.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_BUL',16.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_MUT',17.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_GWE',15.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_MSV',18.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_COMBINE_HAR','Combine harvester hire','machinery','SUP_TRACTOR_HAR',45.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR','Combine harvester hire','machinery','SUP_TRACTOR_MAR',42.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR','Combine harvester hire','machinery','SUP_TRACTOR_BUL',48.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR','Combine harvester hire','machinery','SUP_TRACTOR_GWE',46.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_SHELLER_DAY','Maize sheller (per 90kg bag)','machinery','SUP_TRACTOR_BUL',0.85,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_SHELLER_DAY','Maize sheller (per 90kg bag)','machinery','SUP_TRACTOR_GWE',0.80,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_SHELLER_DAY','Maize sheller (per 90kg bag)','machinery','SUP_TRACTOR_MUT',0.90,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_SHELLER_DAY','Maize sheller (per 90kg bag)','machinery','SUP_TRACTOR_MSV',0.90,'bag','per 90kg bag','manual',CURRENT_DATE),

('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_BUL',26.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_GWE',24.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_MUT',28.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_MSV',30.00,'day','per day','manual',CURRENT_DATE),

-- Motorised sprayer hire
('INP_MOTO_SPRAY', 'Motorised knapsack sprayer hire','machinery','SUP_TRACTOR_HAR', 8.00,'day','per day','manual',CURRENT_DATE),
('INP_MOTO_SPRAY', 'Motorised knapsack sprayer hire','machinery','SUP_TRACTOR_MAR', 7.50,'day','per day','manual',CURRENT_DATE),
('INP_MOTO_SPRAY', 'Motorised knapsack sprayer hire','machinery','SUP_TRACTOR_BUL', 8.50,'day','per day','manual',CURRENT_DATE),


-- ══ EXPANDED EQUIPMENT ════════════════════════════════════════════════════════

-- Knapsack sprayers
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_BUL',30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_MUT',31.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGRIFOODS_BUL',32.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_BUL',31.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_GWE',31.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_WINDMILL_HAR',38.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_WINDMILL_BUL',40.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_FARMCITY_HAR',39.00,'each','each','manual',CURRENT_DATE),

-- Storage bags
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_AGRIFOODS_BUL',3.00,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_WINDMILL_BUL',3.20,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_FARMCITY_BUL',3.10,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_AGRIFOODS_HAR',0.35,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_WINDMILL_HAR', 0.38,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_AGRIFOODS_BUL',0.40,'each','each','manual',CURRENT_DATE),

-- Moisture meters
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_FARMCITY_BUL',37.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_FARMCITY_GWE',38.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_FARMCITY_MUT',39.00,'each','each','manual',CURRENT_DATE),

-- Grain silos (small farm)
('INP_SILO_1T',    'Metal grain silo 1 tonne','equipment','SUP_AGRIFOODS_HAR',180.00,'each','each','manual',CURRENT_DATE),
('INP_SILO_2T',    'Metal grain silo 2 tonne','equipment','SUP_AGRIFOODS_HAR',320.00,'each','each','manual',CURRENT_DATE)
;


-- ══ EXPANDED CROP PRICES — more markets ═══════════════════════════════════════

INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans — more markets
('CROP_002','Sugar beans','MKT_GMB_MSV',  0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_KWE',  0.66,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_BUL',  0.77,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_MUT',  0.75,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_ZVISHAVANE',0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_KAROI',    0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MVURWI',   0.69,'standard','manual',CURRENT_DATE),

-- Maize — more markets
('CROP_001','Maize','MKT_GMB_MSV',  0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_KWE',  0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_ZVISHAVANE',0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_KAROI',    0.26,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MVURWI',   0.27,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_BEITBRIDGE',0.30,'standard','manual',CURRENT_DATE),

-- Groundnuts — more markets
('CROP_003','Groundnuts','MKT_EXP_BUL',  0.88,'premium','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_MUT',  0.85,'premium','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MASVINGO', 0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_ZVISHAVANE',0.68,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GMB_KWE',  0.68,'standard','manual',CURRENT_DATE),

-- Sorghum — more markets
('CROP_006','Sorghum','MKT_GMB_MSV',   0.22,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_GMB_KWE',   0.21,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_ZVISHAVANE',0.19,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_BEITBRIDGE',0.23,'standard','manual',CURRENT_DATE),

-- Soybeans — more markets
('CROP_009','Soybeans','MKT_EXP_BUL',  0.52,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GMB_MSV',  0.47,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GMB_KWE',  0.46,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_BULAWAYO', 0.49,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GWERU',    0.48,'standard','manual',CURRENT_DATE),

-- Cotton — more markets
('CROP_011','Cotton','MKT_GMB_MSV',  0.37,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_GMB_KWE',  0.37,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_KAROI',    0.36,'standard','manual',CURRENT_DATE),

-- Sunflower — more markets
('CROP_010','Sunflower','MKT_EXP_BUL', 0.43,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GMB_MSV', 0.41,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GMB_KWE', 0.40,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GWERU',   0.39,'standard','manual',CURRENT_DATE),

-- Sesame — more markets
('CROP_016','Sesame','MKT_EXP_BUL',  1.70,'premium','manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_EXP_MUT',  1.65,'premium','manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_BULAWAYO', 1.40,'standard','manual',CURRENT_DATE),

-- Cowpeas — more markets
('CROP_008','Cowpeas','MKT_EXP_BUL',  0.68,'premium','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_BULAWAYO', 0.60,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_GWERU',    0.58,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_MASVINGO', 0.55,'standard','manual',CURRENT_DATE),

-- Tomatoes — more markets
('CROP_019','Tomatoes','MKT_GWERU',    0.38,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MASVINGO', 0.36,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_BINDURA',  0.43,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_CHINHOYI', 0.41,'standard','manual',CURRENT_DATE),

-- Onions — more markets
('CROP_020','Onions','MKT_GWERU',    0.46,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_MASVINGO', 0.44,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_MUTARE',   0.50,'standard','manual',CURRENT_DATE),

-- Sweet potato — more markets
('CROP_004','Sweet potato','MKT_MASVINGO', 0.28,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_MUTARE',   0.33,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_BINDURA',  0.34,'standard','manual',CURRENT_DATE),

-- Pearl millet — more markets
('CROP_007','Pearl millet','MKT_GMB_MSV',   0.18,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_MASVINGO',  0.16,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_ZVISHAVANE',0.15,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_BEITBRIDGE',0.17,'standard','manual',CURRENT_DATE)
;

-- ══ VERIFY ════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM suppliers;      -- should be 50+
-- SELECT COUNT(*) FROM markets;        -- should be 28+
-- SELECT COUNT(*) FROM market_prices;  -- should be 120+
-- SELECT COUNT(*) FROM input_prices;   -- should be 200+
-- SELECT DISTINCT province FROM suppliers ORDER BY province;
