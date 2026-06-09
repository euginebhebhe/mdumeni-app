-- ============================================================
-- MDUMENI — Mashonaland East Complete Coverage
-- Districts: Marondera, Mutoko, Mudzi, UMP, Goromonzi,
--            Murewa, Wedza, Chikomba, Hwedza, Ruwa
-- ============================================================

-- ══ MARKETS ═══════════════════════════════════════════════════════════════════

INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

-- Open markets
('MKT_MARONDERA_MAIN', 'Marondera Market',       'open_market', 'Mashonaland East', 'Marondera', -18.1833, 31.5500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MUTOKO',         'Mutoko Market',           'open_market', 'Mashonaland East', 'Mutoko',    -17.3833, 32.2167, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MUREWA',         'Murewa Market',           'open_market', 'Mashonaland East', 'Murewa',    -17.6500, 31.7833, NULL, 0, ARRAY['cash','ecocash']),
('MKT_WEDZA',          'Wedza Market',            'open_market', 'Mashonaland East', 'Wedza',     -18.6167, 31.5667, NULL, 0, ARRAY['cash','ecocash']),
('MKT_CHIKOMBA',       'Chivhu Market',           'open_market', 'Mashonaland East', 'Chikomba',  -19.0167, 30.8833, NULL, 0, ARRAY['cash','ecocash']),
('MKT_HWEDZA',         'Hwedza Market',           'open_market', 'Mashonaland East', 'Hwedza',    -18.6000, 31.6333, NULL, 0, ARRAY['cash','ecocash']),
('MKT_GOROMONZI',      'Goromonzi Market',        'open_market', 'Mashonaland East', 'Goromonzi', -17.9833, 31.3667, NULL, 0, ARRAY['cash','ecocash']),
('MKT_RUWA_EAST',      'Ruwa Farmers Market',     'open_market', 'Mashonaland East', 'Ruwa',      -17.8900, 31.2400, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MACHEKE',        'Macheke Market',          'open_market', 'Mashonaland East', 'Marondera', -18.1333, 31.8500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_SADZA',          'Sadza Growth Point',      'open_market', 'Mashonaland East', 'Chikomba',  -19.1000, 31.0000, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MUDZI',          'Mudzi Market',            'open_market', 'Mashonaland East', 'Mudzi',     -16.3833, 32.4000, NULL, 0, ARRAY['cash','ecocash']),
('MKT_UMP',            'Uzumba Growth Point',     'open_market', 'Mashonaland East', 'UMP',       -16.6500, 32.0500, NULL, 0, ARRAY['cash','ecocash']),

-- GMB depots
('MKT_GMB_MAR_MAIN',   'GMB Marondera Depot',    'gmb_depot',   'Mashonaland East', 'Marondera', -18.1900, 31.5600, '+263279024280', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_MUTOKO',     'GMB Mutoko Depot',       'gmb_depot',   'Mashonaland East', 'Mutoko',    -17.3900, 32.2200, '+263272122100', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_CHIKOMBA',   'GMB Chivhu Depot',       'gmb_depot',   'Mashonaland East', 'Chikomba',  -19.0200, 30.8900, '+263279224100', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_MUREWA',     'GMB Murewa Depot',       'gmb_depot',   'Mashonaland East', 'Murewa',    -17.6600, 31.7900, '+263279124100', 1000, ARRAY['bank_transfer','cheque']),

-- Cooperatives
('MKT_COOP_MAR',       'Marondera Farmers Coop', 'cooperative', 'Mashonaland East', 'Marondera', -18.1850, 31.5480, '+263279023800', 500, ARRAY['cash','ecocash','bank_transfer']),
('MKT_COOP_GOROMONZI', 'Goromonzi Coop',         'cooperative', 'Mashonaland East', 'Goromonzi', -17.9900, 31.3700, NULL,            200, ARRAY['cash','ecocash']),

-- Export buyers
('MKT_EXP_MAR',        'Marondera Export Buyer', 'export_buyer','Mashonaland East', 'Marondera', -18.1800, 31.5520, '+263279023900', 3000, ARRAY['bank_transfer','ecocash'])

ON CONFLICT (id) DO NOTHING;


-- ══ SUPPLIERS ═════════════════════════════════════════════════════════════════

INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

('SUP_WINDMILL_MAR_MAIN','Windmill Farm Stores','Marondera Main',   'agro_dealer', 'Mashonaland East','Marondera',-18.1800,31.5500,'+263279023100'),
('SUP_WINDMILL_MAR_EAST','Windmill Farm Stores','Marondera East',   'agro_dealer', 'Mashonaland East','Marondera',-18.1850,31.5600,'+263279023101'),
('SUP_WINDMILL_MUTOKO',  'Windmill Farm Stores','Mutoko',           'agro_dealer', 'Mashonaland East','Mutoko',   -17.3850,32.2180,'+263272122200'),
('SUP_WINDMILL_CHIVHU',  'Windmill Farm Stores','Chivhu',           'agro_dealer', 'Mashonaland East','Chikomba', -19.0180,30.8850,'+263279224200'),
('SUP_AGRIFOODS_MAR',    'Agrifoods',           'Marondera',        'agro_dealer', 'Mashonaland East','Marondera',-18.1850,31.5450,'+263279023500'),
('SUP_AGRIFOODS_MUTOKO', 'Agrifoods',           'Mutoko',           'agro_dealer', 'Mashonaland East','Mutoko',   -17.3870,32.2160,'+263272122300'),
('SUP_ZFC_MAR',          'ZFC Limited',         'Marondera',        'fertiliser',  'Mashonaland East','Marondera',-18.1820,31.5520,'+263279023600'),
('SUP_SEEDCO_MAR_MAIN',  'Seed Co',             'Marondera',        'seed_company','Mashonaland East','Marondera',-18.1833,31.5500,'+263279023200'),
('SUP_PANNAR_MAR',       'Pannar Seeds',        'Marondera',        'seed_company','Mashonaland East','Marondera',-18.1840,31.5510,'+263279023700'),
('SUP_FARMCITY_MAR',     'Farm & City Centre',  'Marondera',        'agro_dealer', 'Mashonaland East','Marondera',-18.1860,31.5490,'+263279023400'),
('SUP_TRACTOR_MAR_MAIN', 'Marondera Tractor Hire','Marondera',      'equipment',   'Mashonaland East','Marondera',-18.1870,31.5520,'+263279023900'),
('SUP_TRACTOR_CHIVHU',   'Chivhu Farm Services','Chivhu',           'equipment',   'Mashonaland East','Chikomba', -19.0200,30.8900,'+263279224300'),
('SUP_LOCAL_MUTOKO',     'Mutoko Agro-Dealer',  'Mutoko',           'agro_dealer', 'Mashonaland East','Mutoko',   -17.3833,32.2167,NULL),
('SUP_LOCAL_MUREWA',     'Murewa Agro-Dealer',  'Murewa',           'agro_dealer', 'Mashonaland East','Murewa',   -17.6500,31.7833,NULL),
('SUP_LOCAL_WEDZA',      'Wedza Agro-Dealer',   'Wedza',            'agro_dealer', 'Mashonaland East','Wedza',    -18.6167,31.5667,NULL),
('SUP_LOCAL_MACHEKE',    'Macheke Agro-Dealer', 'Macheke',          'agro_dealer', 'Mashonaland East','Marondera',-18.1333,31.8500,NULL),
('SUP_LOCAL_MUDZI',      'Mudzi Agro-Dealer',   'Mudzi',            'agro_dealer', 'Mashonaland East','Mudzi',    -16.3833,32.4000,NULL),
('SUP_LOCAL_UMP',        'Uzumba Agro-Dealer',  'Uzumba',           'agro_dealer', 'Mashonaland East','UMP',      -16.6500,32.0500,NULL)

ON CONFLICT (id) DO NOTHING;


-- ══ CROP PRICES ═══════════════════════════════════════════════════════════════

INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans
('CROP_002','Sugar beans','MKT_MARONDERA_MAIN', 0.70,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MUTOKO',          0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MUREWA',          0.66,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_WEDZA',           0.64,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_CHIKOMBA',        0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_HWEDZA',          0.63,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GOROMONZI',       0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_RUWA_EAST',       0.69,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MACHEKE',         0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_SADZA',           0.62,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MUDZI',           0.60,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_UMP',             0.59,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_MAR_MAIN',    0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_MUTOKO',      0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_MAR',         0.76,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_COOP_MAR',        0.69,'standard','manual',CURRENT_DATE),

-- Maize
('CROP_001','Maize','MKT_MARONDERA_MAIN', 0.26,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MUTOKO',         0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MUREWA',         0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_WEDZA',          0.22,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_CHIKOMBA',       0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GOROMONZI',      0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_RUWA_EAST',      0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MACHEKE',        0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MUDZI',          0.22,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_MAR_MAIN',   0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_MUTOKO',     0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_CHIKOMBA',   0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_MUREWA',     0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_COOP_MAR',       0.26,'standard','manual',CURRENT_DATE),

-- Groundnuts
('CROP_003','Groundnuts','MKT_MARONDERA_MAIN', 0.72,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MUTOKO',         0.68,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MUREWA',         0.66,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_WEDZA',          0.65,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GOROMONZI',      0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GMB_MAR_MAIN',   0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_MAR',        0.88,'premium', 'manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MUDZI',          0.63,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_UMP',            0.61,'standard','manual',CURRENT_DATE),

-- Soybeans
('CROP_009','Soybeans','MKT_MARONDERA_MAIN', 0.49,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GMB_MAR_MAIN',   0.48,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GOROMONZI',      0.47,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_MAR',        0.54,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_RUWA_EAST',      0.48,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_COOP_MAR',       0.47,'standard','manual',CURRENT_DATE),

-- Tomatoes
('CROP_019','Tomatoes','MKT_MARONDERA_MAIN', 0.44,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MUTOKO',         0.38,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MUREWA',         0.36,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_GOROMONZI',      0.42,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_RUWA_EAST',      0.43,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MACHEKE',        0.40,'standard','manual',CURRENT_DATE),

-- Sunflower
('CROP_010','Sunflower','MKT_MARONDERA_MAIN', 0.40,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GMB_MAR_MAIN',   0.42,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_EXP_MAR',        0.45,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_CHIKOMBA',       0.38,'standard','manual',CURRENT_DATE),

-- Sweet potato
('CROP_004','Sweet potato','MKT_MARONDERA_MAIN', 0.33,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_MUTOKO',         0.28,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_MUREWA',         0.27,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_GOROMONZI',      0.31,'standard','manual',CURRENT_DATE),

-- Sorghum
('CROP_006','Sorghum','MKT_MARONDERA_MAIN', 0.21,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MUTOKO',         0.19,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MUDZI',          0.18,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_GMB_MAR_MAIN',   0.22,'standard','manual',CURRENT_DATE),

-- Cowpeas
('CROP_008','Cowpeas','MKT_MARONDERA_MAIN', 0.62,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_MUTOKO',         0.58,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_MUREWA',         0.56,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_GMB_MAR_MAIN',   0.60,'standard','manual',CURRENT_DATE),

-- Onions
('CROP_020','Onions','MKT_MARONDERA_MAIN', 0.50,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_GOROMONZI',      0.48,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_RUWA_EAST',      0.49,'standard','manual',CURRENT_DATE),

-- Sesame
('CROP_016','Sesame','MKT_MARONDERA_MAIN', 1.55,'standard','manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_EXP_MAR',        1.75,'premium', 'manual',CURRENT_DATE)
;


-- ══ INPUT PRICES ══════════════════════════════════════════════════════════════

INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- Compound D — all Mashonaland East suppliers
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MAR_MAIN',17.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MAR_EAST',17.30,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MUTOKO',  17.90,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_CHIVHU',  18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_MAR',    18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_MUTOKO', 19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_MAR',          16.90,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_MAR',     18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MUTOKO',     19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MUREWA',     19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_WEDZA',      20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MACHEKE',    18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MUDZI',      21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_UMP',        21.50,'bag','50kg','manual',CURRENT_DATE),

-- AN 34.5%
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_MAR',         21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_MAR_MAIN',22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_MUTOKO',  22.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_AGRIFOODS_MAR',    21.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_FARMCITY_MAR',     22.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_LOCAL_MUREWA',     24.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_LOCAL_MUDZI',      25.00,'bag','50kg','manual',CURRENT_DATE),

-- CAN
('INP_CAN_50','CAN 27%','fertiliser','SUP_ZFC_MAR',         19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_WINDMILL_MAR_MAIN',20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_AGRIFOODS_MAR',    20.50,'bag','50kg','manual',CURRENT_DATE),

-- Compound S
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_MAR',         18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_MAR_MAIN',18.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_AGRIFOODS_MAR',    19.20,'bag','50kg','manual',CURRENT_DATE),

-- Agricultural Lime
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_MAR',          3.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_MAR_MAIN', 3.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_AGRIFOODS_MAR',     4.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_MUTOKO',      4.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_MUREWA',      4.80,'bag','50kg','manual',CURRENT_DATE),

-- Seeds — Maize
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_SEEDCO_MAR_MAIN',  7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_AGRIFOODS_MAR',    7.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_WINDMILL_MAR_MAIN',7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_MUTOKO',     8.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_MUREWA',     8.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_MUDZI',      9.00,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_SEEDCO_MAR_MAIN',  12.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_AGRIFOODS_MAR',    13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_WINDMILL_MAR_MAIN',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_WINDMILL_MUTOKO',  13.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_LOCAL_MUTOKO',     14.00,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_SEEDCO_MAR_MAIN',  15.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_AGRIFOODS_MAR',    15.50,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_PAN53','Maize PAN53','seed','SUP_PANNAR_MAR',     11.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize PAN53','seed','SUP_AGRIFOODS_MAR',  12.20,'bag','10kg','manual',CURRENT_DATE),

-- Seeds — Sugar beans
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_SEEDCO_MAR_MAIN',  1.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_AGRIFOODS_MAR',    1.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_WINDMILL_MAR_MAIN',1.85,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_MUTOKO',     2.10,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_MUREWA',     2.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_MUDZI',      2.40,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_PAN','Sugar Bean PAN 9216','seed','SUP_PANNAR_MAR',       2.30,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Groundnuts
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_SEEDCO_MAR_MAIN',  2.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_WINDMILL_MAR_MAIN',2.60,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_LOCAL_MUREWA',     2.80,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Soybean
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_MAR_MAIN',3.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_AGRIFOODS_MAR',  3.40,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN1867','seed','SUP_PANNAR_MAR',     3.60,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Sunflower
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_PANNAR_MAR',     3.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_AGRIFOODS_MAR',  4.10,'kg','1kg','manual',CURRENT_DATE),

-- Chemicals
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_MAR_MAIN',5.60,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_MAR',    5.90,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_FARMCITY_MAR',     5.70,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_MUTOKO',     6.50,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_MUREWA',     6.80,'litre','1L','manual',CURRENT_DATE),

('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_MAR_MAIN',7.60,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGRIFOODS_MAR',    7.90,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_MUTOKO',     8.50,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_MUREWA',     9.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_MUDZI',      9.50,'litre','1L','manual',CURRENT_DATE),

('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_WINDMILL_MAR_MAIN',4.30,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_AGRIFOODS_MAR',    4.60,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_LOCAL_MUTOKO',     5.20,'litre','1L','manual',CURRENT_DATE),

('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_WINDMILL_MAR_MAIN',22.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_AGRIFOODS_MAR',    23.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_LOCAL_MUTOKO',     25.00,'each','200g','manual',CURRENT_DATE),

('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_WINDMILL_MAR_MAIN',9.80,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_AGRIFOODS_MAR',   10.20,'litre','1L','manual',CURRENT_DATE),

('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_WINDMILL_MAR_MAIN',8.70,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_AGRIFOODS_MAR',    9.20,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_LOCAL_MUTOKO',    10.00,'each','1kg','manual',CURRENT_DATE),

('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_WINDMILL_MAR_MAIN',6.00,'litre','1L','manual',CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_AGRIFOODS_MAR',    6.20,'litre','1L','manual',CURRENT_DATE),

('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_WINDMILL_MAR_MAIN',18.50,'litre','1L','manual',CURRENT_DATE),
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_AGRIFOODS_MAR',    19.50,'litre','1L','manual',CURRENT_DATE),

-- Machinery
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_MAR_MAIN',55.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_CHIVHU',  58.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_MAR_MAIN',20.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_CHIVHU',  22.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',           'machinery','SUP_TRACTOR_MAR_MAIN',15.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR',   'Combine harvester hire',      'machinery','SUP_TRACTOR_MAR_MAIN',42.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_SHELLER_DAY',   'Maize sheller',               'machinery','SUP_TRACTOR_MAR_MAIN', 0.80,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire',        'machinery','SUP_TRACTOR_MAR_MAIN',24.00,'day','per day','manual',CURRENT_DATE),

-- Equipment
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_MAR_MAIN',28.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGRIFOODS_MAR',    29.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_MAR',     30.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_MUTOKO',     32.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_MUREWA',     33.00,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_AGRIFOODS_MAR',  2.90,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_WINDMILL_MAR_MAIN',3.10,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_AGRIFOODS_MAR',   0.38,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_WINDMILL_MAR_MAIN',0.40,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_FARMCITY_MAR',   36.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_AGRIFOODS_MAR',  37.00,'each','each','manual',CURRENT_DATE)
;

-- ══ VERIFY ════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM markets   WHERE province = 'Mashonaland East';
-- SELECT COUNT(*) FROM suppliers WHERE province = 'Mashonaland East';
-- SELECT COUNT(*) FROM market_prices  WHERE market_id LIKE 'MKT_MAR%' OR market_id LIKE 'MKT_MUTOKO%';
-- SELECT COUNT(*) FROM input_prices   WHERE supplier_id LIKE 'SUP_%MAR%' OR supplier_id LIKE 'SUP_%MUTOKO%';
