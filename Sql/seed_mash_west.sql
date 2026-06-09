-- ============================================================
-- MDUMENI — Mashonaland West Complete Coverage
-- Districts: Chinhoyi, Karoi, Kadoma, Chegutu, Zvimba,
--            Hurungwe, Makonde, Sanyati, Mhondoro-Ngezi
-- ============================================================

-- ══ MARKETS ═══════════════════════════════════════════════════════════════════

INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

-- Open markets
('MKT_CHINHOYI_MAIN',  'Chinhoyi Main Market',     'open_market', 'Mashonaland West', 'Chinhoyi',       -17.3667, 30.2000, NULL, 0, ARRAY['cash','ecocash']),
('MKT_KAROI_MAIN',     'Karoi Main Market',         'open_market', 'Mashonaland West', 'Hurungwe',       -16.8167, 29.6833, NULL, 0, ARRAY['cash','ecocash']),
('MKT_KADOMA_MAIN',    'Kadoma Market',             'open_market', 'Mashonaland West', 'Kadoma',         -18.3333, 29.9167, NULL, 0, ARRAY['cash','ecocash']),
('MKT_CHEGUTU_MAIN',   'Chegutu Market',            'open_market', 'Mashonaland West', 'Chegutu',        -18.1333, 30.1333, NULL, 0, ARRAY['cash','ecocash']),
('MKT_NORTON_WEST',    'Norton Market',             'open_market', 'Mashonaland West', 'Zvimba',         -17.8800, 30.7000, NULL, 0, ARRAY['cash','ecocash']),
('MKT_BANKET',         'Banket Market',             'open_market', 'Mashonaland West', 'Makonde',        -17.3833, 30.4000, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MHONDORO',       'Mhondoro Growth Point',     'open_market', 'Mashonaland West', 'Mhondoro-Ngezi', -18.1000, 29.7500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_SANYATI',        'Sanyati Growth Point',      'open_market', 'Mashonaland West', 'Sanyati',        -18.0333, 29.5667, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MUROMBEDZI',     'Murombedzi Growth Point',   'open_market', 'Mashonaland West', 'Zvimba',         -17.6167, 30.0500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_TENGWE',         'Tengwe Growth Point',       'open_market', 'Mashonaland West', 'Hurungwe',       -16.4500, 29.9833, NULL, 0, ARRAY['cash','ecocash']),
('MKT_RAFFINGORA',     'Raffingora Market',         'open_market', 'Mashonaland West', 'Zvimba',         -17.1167, 30.0333, NULL, 0, ARRAY['cash','ecocash']),

-- GMB depots
('MKT_GMB_CHINHOYI',   'GMB Chinhoyi Depot',        'gmb_depot',   'Mashonaland West', 'Chinhoyi',       -17.3700, 30.2050, '+263267122400', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_KAROI',      'GMB Karoi Depot',           'gmb_depot',   'Mashonaland West', 'Hurungwe',       -16.8200, 29.6900, '+263261223700', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_KADOMA',     'GMB Kadoma Depot',          'gmb_depot',   'Mashonaland West', 'Kadoma',         -18.3380, 29.9200, '+263268122400', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_CHEGUTU',    'GMB Chegutu Depot',         'gmb_depot',   'Mashonaland West', 'Chegutu',        -18.1380, 30.1380, '+263253122400', 1000, ARRAY['bank_transfer','cheque']),

-- Cooperatives
('MKT_COOP_CHINHOYI',  'Chinhoyi Farmers Coop',     'cooperative', 'Mashonaland West', 'Chinhoyi',       -17.3680, 30.2020, '+263267122500', 500, ARRAY['cash','ecocash','bank_transfer']),
('MKT_COOP_KAROI',     'Karoi Tobacco Farmers Coop','cooperative', 'Mashonaland West', 'Hurungwe',       -16.8180, 30.6880, NULL,            200, ARRAY['cash','ecocash']),
('MKT_COOP_CHEGUTU',   'Chegutu Farmers Coop',      'cooperative', 'Mashonaland West', 'Chegutu',        -18.1350, 30.1350, NULL,            200, ARRAY['cash','ecocash']),

-- Export buyers
('MKT_EXP_CHINHOYI',   'Export Buyer Chinhoyi',     'export_buyer','Mashonaland West', 'Chinhoyi',       -17.3650, 30.1980, '+263267122600', 3000, ARRAY['bank_transfer','ecocash']),
('MKT_EXP_KAROI',      'Export Buyer Karoi',        'export_buyer','Mashonaland West', 'Hurungwe',       -16.8150, 29.6850, '+263261223800', 2000, ARRAY['bank_transfer'])

ON CONFLICT (id) DO NOTHING;


-- ══ SUPPLIERS ═════════════════════════════════════════════════════════════════

INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

('SUP_WINDMILL_CHN_MAIN','Windmill Farm Stores','Chinhoyi Main',    'agro_dealer', 'Mashonaland West','Chinhoyi',       -17.3660,30.2010,'+263267122100'),
('SUP_WINDMILL_CHN_EAST','Windmill Farm Stores','Chinhoyi East',    'agro_dealer', 'Mashonaland West','Chinhoyi',       -17.3680,30.2080,'+263267122101'),
('SUP_WINDMILL_KAROI',   'Windmill Farm Stores','Karoi',            'agro_dealer', 'Mashonaland West','Hurungwe',       -16.8170,29.6840,'+263261223100'),
('SUP_WINDMILL_KADOMA',  'Windmill Farm Stores','Kadoma',           'agro_dealer', 'Mashonaland West','Kadoma',         -18.3340,29.9180,'+263268122100'),
('SUP_WINDMILL_CHEGUTU', 'Windmill Farm Stores','Chegutu',          'agro_dealer', 'Mashonaland West','Chegutu',        -18.1340,30.1340,'+263253122100'),
('SUP_AGRIFOODS_CHN',    'Agrifoods',           'Chinhoyi',         'agro_dealer', 'Mashonaland West','Chinhoyi',       -17.3670,30.2030,'+263267122200'),
('SUP_AGRIFOODS_KADOMA', 'Agrifoods',           'Kadoma',           'agro_dealer', 'Mashonaland West','Kadoma',         -18.3350,29.9160,'+263268122200'),
('SUP_AGRIFOODS_KAROI',  'Agrifoods',           'Karoi',            'agro_dealer', 'Mashonaland West','Hurungwe',       -16.8180,29.6860,'+263261223200'),
('SUP_ZFC_CHN',          'ZFC Limited',         'Chinhoyi',         'fertiliser',  'Mashonaland West','Chinhoyi',       -17.3650,30.1990,'+263267122300'),
('SUP_ZFC_KADOMA',       'ZFC Limited',         'Kadoma',           'fertiliser',  'Mashonaland West','Kadoma',         -18.3360,29.9190,'+263268122300'),
('SUP_ZFC_KAROI',        'ZFC Limited',         'Karoi',            'fertiliser',  'Mashonaland West','Hurungwe',       -16.8190,29.6870,'+263261223300'),
('SUP_SEEDCO_CHN',       'Seed Co',             'Chinhoyi',         'seed_company','Mashonaland West','Chinhoyi',       -17.3640,30.2000,'+263267122700'),
('SUP_SEEDCO_KADOMA',    'Seed Co',             'Kadoma',           'seed_company','Mashonaland West','Kadoma',         -18.3330,29.9170,'+263268122700'),
('SUP_PANNAR_CHN',       'Pannar Seeds',        'Chinhoyi',         'seed_company','Mashonaland West','Chinhoyi',       -17.3655,30.2015,'+263267122800'),
('SUP_FARMCITY_CHN',     'Farm & City Centre',  'Chinhoyi',         'agro_dealer', 'Mashonaland West','Chinhoyi',       -17.3675,30.2025,'+263267122900'),
('SUP_FARMCITY_KADOMA',  'Farm & City Centre',  'Kadoma',           'agro_dealer', 'Mashonaland West','Kadoma',         -18.3345,30.9175,'+263268122900'),
('SUP_COTTCO_KAROI',     'Cottco',              'Karoi',            'cooperative', 'Mashonaland West','Hurungwe',       -16.8160,29.6820,'+263261223400'),
('SUP_TRACTOR_CHN',      'Chinhoyi Mechanisation','Chinhoyi',       'equipment',   'Mashonaland West','Chinhoyi',       -17.3685,30.2035,'+263267123000'),
('SUP_TRACTOR_KADOMA',   'Kadoma Farm Services','Kadoma',           'equipment',   'Mashonaland West','Kadoma',         -18.3355,29.9185,'+263268123000'),
('SUP_TRACTOR_KAROI',    'Karoi Tractor Hire',  'Karoi',            'equipment',   'Mashonaland West','Hurungwe',       -16.8195,29.6875,'+263261223500'),
('SUP_LOCAL_BANKET',     'Banket Agro-Dealer',  'Banket',           'agro_dealer', 'Mashonaland West','Makonde',        -17.3833,30.4000,NULL),
('SUP_LOCAL_MHONDORO',   'Mhondoro Agro-Dealer','Mhondoro',         'agro_dealer', 'Mashonaland West','Mhondoro-Ngezi', -18.1000,29.7500,NULL),
('SUP_LOCAL_SANYATI',    'Sanyati Agro-Dealer', 'Sanyati',          'agro_dealer', 'Mashonaland West','Sanyati',        -18.0333,29.5667,NULL),
('SUP_LOCAL_TENGWE',     'Tengwe Agro-Dealer',  'Tengwe',           'agro_dealer', 'Mashonaland West','Hurungwe',       -16.4500,29.9833,NULL),
('SUP_LOCAL_RAFFINGORA', 'Raffingora Agro',     'Raffingora',       'agro_dealer', 'Mashonaland West','Zvimba',         -17.1167,30.0333,NULL)

ON CONFLICT (id) DO NOTHING;


-- ══ CROP PRICES ═══════════════════════════════════════════════════════════════

INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans
('CROP_002','Sugar beans','MKT_CHINHOYI_MAIN', 0.69,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_KAROI_MAIN',    0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_KADOMA_MAIN',   0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_CHEGUTU_MAIN',  0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_NORTON_WEST',   0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_BANKET',        0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MHONDORO',      0.63,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_SANYATI',       0.62,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MUROMBEDZI',    0.64,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_TENGWE',        0.61,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_RAFFINGORA',    0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_CHINHOYI',  0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_KAROI',     0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_KADOMA',    0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_CHINHOYI',  0.76,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_KAROI',     0.74,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_COOP_CHINHOYI', 0.68,'standard','manual',CURRENT_DATE),

-- Maize
('CROP_001','Maize','MKT_CHINHOYI_MAIN', 0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_KAROI_MAIN',    0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_KADOMA_MAIN',   0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_CHEGUTU_MAIN',  0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_NORTON_WEST',   0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_BANKET',        0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MHONDORO',      0.22,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_SANYATI',       0.21,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_TENGWE',        0.21,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_CHINHOYI',  0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_KAROI',     0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_KADOMA',    0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_CHEGUTU',   0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_COOP_CHINHOYI', 0.26,'standard','manual',CURRENT_DATE),

-- Tobacco — key crop for this province
('CROP_012','Tobacco','MKT_CHINHOYI_MAIN',  2.20,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_KAROI_MAIN',     2.15,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_GMB_CHINHOYI',   2.10,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_EXP_CHINHOYI',   2.40,'premium', 'manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_EXP_KAROI',      2.35,'premium', 'manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_COOP_KAROI',     2.20,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_TENGWE',         2.00,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_BANKET',         2.10,'standard','manual',CURRENT_DATE),

-- Cotton — major crop
('CROP_011','Cotton','MKT_CHINHOYI_MAIN',  0.38,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_KAROI_MAIN',     0.37,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_KADOMA_MAIN',    0.37,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_SANYATI',        0.36,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_MHONDORO',       0.36,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_GMB_CHINHOYI',   0.38,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_EXP_KAROI',      0.42,'premium', 'manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_COOP_KAROI',     0.38,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_TENGWE',         0.35,'standard','manual',CURRENT_DATE),

-- Groundnuts
('CROP_003','Groundnuts','MKT_CHINHOYI_MAIN', 0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_KAROI_MAIN',    0.67,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_KADOMA_MAIN',   0.69,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_BANKET',        0.65,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GMB_CHINHOYI',  0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_CHINHOYI',  0.87,'premium', 'manual',CURRENT_DATE),

-- Soybeans
('CROP_009','Soybeans','MKT_CHINHOYI_MAIN', 0.48,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GMB_CHINHOYI',  0.47,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_CHINHOYI',  0.53,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_CHEGUTU_MAIN',  0.47,'standard','manual',CURRENT_DATE),

-- Sunflower
('CROP_010','Sunflower','MKT_CHINHOYI_MAIN', 0.40,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GMB_CHINHOYI',  0.42,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_EXP_CHINHOYI',  0.45,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_KADOMA_MAIN',   0.39,'standard','manual',CURRENT_DATE),

-- Sorghum
('CROP_006','Sorghum','MKT_KAROI_MAIN',    0.20,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_SANYATI',       0.18,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MHONDORO',      0.18,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_GMB_KAROI',     0.22,'standard','manual',CURRENT_DATE),

-- Tomatoes
('CROP_019','Tomatoes','MKT_CHINHOYI_MAIN', 0.42,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_KADOMA_MAIN',   0.40,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_CHEGUTU_MAIN',  0.39,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_NORTON_WEST',   0.41,'standard','manual',CURRENT_DATE),

-- Sweet potato
('CROP_004','Sweet potato','MKT_CHINHOYI_MAIN', 0.31,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_KAROI_MAIN',    0.29,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_KADOMA_MAIN',   0.30,'standard','manual',CURRENT_DATE),

-- Cowpeas
('CROP_008','Cowpeas','MKT_CHINHOYI_MAIN', 0.61,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_KAROI_MAIN',    0.58,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_GMB_CHINHOYI',  0.60,'standard','manual',CURRENT_DATE),

-- Sesame
('CROP_016','Sesame','MKT_EXP_CHINHOYI',  1.78,'premium', 'manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_CHINHOYI_MAIN', 1.50,'standard','manual',CURRENT_DATE)
;


-- ══ INPUT PRICES ══════════════════════════════════════════════════════════════

INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- Compound D
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_CHN_MAIN',17.40,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_CHN_EAST',17.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_KAROI',   18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_KADOMA',  17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_CHEGUTU', 17.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_CHN',    18.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_KADOMA', 18.40,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_KAROI',  19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_CHN',          17.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_KADOMA',       17.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_KAROI',        17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_CHN',     18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_KADOMA',  18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_BANKET',     19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MHONDORO',   20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_SANYATI',    20.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_TENGWE',     21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_RAFFINGORA', 19.50,'bag','50kg','manual',CURRENT_DATE),

-- AN 34.5%
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_ZFC_CHN',         21.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_ZFC_KADOMA',      21.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_ZFC_KAROI',       22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_WINDMILL_CHN_MAIN',22.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_WINDMILL_KAROI',  23.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_AGRIFOODS_CHN',   21.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_LOCAL_SANYATI',   25.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_LOCAL_TENGWE',    25.50,'bag','50kg','manual',CURRENT_DATE),

-- CAN
('INP_CAN_50','CAN 27%','fertiliser','SUP_ZFC_CHN',         19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_ZFC_KADOMA',      20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_WINDMILL_CHN_MAIN',20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_AGRIFOODS_CHN',   20.50,'bag','50kg','manual',CURRENT_DATE),

-- Compound L — tobacco base (key for this province)
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_CHN_MAIN',20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_KAROI',   20.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_ZFC_CHN',          19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_ZFC_KAROI',        20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_AGRIFOODS_CHN',    21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_AGRIFOODS_KAROI',  21.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_LOCAL_BANKET',     22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_LOCAL_TENGWE',     23.00,'bag','50kg','manual',CURRENT_DATE),

-- Compound S
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_CHN',         18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_CHN_MAIN',18.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_AGRIFOODS_CHN',   19.40,'bag','50kg','manual',CURRENT_DATE),

-- Agricultural Lime
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_CHN',          3.30,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_KADOMA',       3.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_KAROI',        3.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_CHN_MAIN',3.90,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_KAROI',   4.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_AGRIFOODS_CHN',    4.10,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_BANKET',     4.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_TENGWE',     5.00,'bag','50kg','manual',CURRENT_DATE),

-- Seeds — Maize
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_SEEDCO_CHN',      7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_SEEDCO_KADOMA',   7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_AGRIFOODS_CHN',   7.90,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_WINDMILL_CHN_MAIN',7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_WINDMILL_KAROI',  8.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_BANKET',    8.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_SANYATI',   9.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_TENGWE',    9.50,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_SEEDCO_CHN',      12.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_AGRIFOODS_CHN',   13.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_WINDMILL_CHN_MAIN',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_LOCAL_BANKET',    14.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_LOCAL_SANYATI',   14.50,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_SEEDCO_CHN',    15.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_AGRIFOODS_CHN', 15.80,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_PAN53','Maize PAN53','seed','SUP_PANNAR_CHN',     11.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize PAN53','seed','SUP_AGRIFOODS_CHN',  12.20,'bag','10kg','manual',CURRENT_DATE),

-- Seeds — Cotton (key crop)
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_COTTCO_KAROI',   5.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_WINDMILL_KAROI', 5.30,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_AGRIFOODS_KAROI',5.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_LOCAL_SANYATI',  5.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_LOCAL_TENGWE',   6.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SZ9314',  'Cotton SZ9314',   'seed','SUP_COTTCO_KAROI',   4.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SZ9314',  'Cotton SZ9314',   'seed','SUP_WINDMILL_KAROI', 5.00,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Sugar beans
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_SEEDCO_CHN',      1.85,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_AGRIFOODS_CHN',   1.95,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_WINDMILL_CHN_MAIN',1.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_BANKET',    2.10,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_SANYATI',   2.30,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_TENGWE',    2.50,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Soybean
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_CHN',    3.30,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_AGRIFOODS_CHN', 3.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN1867','seed','SUP_PANNAR_CHN',    3.60,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Groundnuts
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_SEEDCO_CHN',      2.55,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_WINDMILL_CHN_MAIN',2.65,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_LOCAL_BANKET',    2.90,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Sunflower
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_PANNAR_CHN',     3.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_AGRIFOODS_CHN',  4.10,'kg','1kg','manual',CURRENT_DATE),

-- Chemicals
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_CHN_MAIN',5.70,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_KAROI',   6.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_CHN',    6.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_FARMCITY_CHN',     5.80,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_BANKET',     6.50,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_SANYATI',    7.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_TENGWE',     7.50,'litre','1L','manual',CURRENT_DATE),

('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_CHN_MAIN',7.70,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_KAROI',   8.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGRIFOODS_CHN',    8.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_SANYATI',    9.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_TENGWE',     9.50,'litre','1L','manual',CURRENT_DATE),

('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_WINDMILL_CHN_MAIN',4.40,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_AGRIFOODS_CHN',    4.70,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_LOCAL_BANKET',     5.20,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_LOCAL_TENGWE',     5.80,'litre','1L','manual',CURRENT_DATE),

('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_WINDMILL_CHN_MAIN',22.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_AGRIFOODS_CHN',    23.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_LOCAL_SANYATI',    26.00,'each','200g','manual',CURRENT_DATE),

('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_WINDMILL_CHN_MAIN',9.80,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_AGRIFOODS_CHN',   10.20,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_LOCAL_KAROI',     11.00,'litre','1L','manual',CURRENT_DATE),

('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_WINDMILL_CHN_MAIN',8.80,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_AGRIFOODS_CHN',    9.30,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_LOCAL_BANKET',    10.50,'each','1kg','manual',CURRENT_DATE),

('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_WINDMILL_CHN_MAIN',6.00,'litre','1L','manual',CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_AGRIFOODS_CHN',    6.30,'litre','1L','manual',CURRENT_DATE),

('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_WINDMILL_CHN_MAIN',18.80,'litre','1L','manual',CURRENT_DATE),
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_AGRIFOODS_CHN',    19.80,'litre','1L','manual',CURRENT_DATE),

-- Machinery
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_CHN',   56.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_KADOMA',55.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_KAROI', 58.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_CHN',   21.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_KADOMA',20.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_KAROI', 22.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',          'machinery','SUP_TRACTOR_CHN',   15.50,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',          'machinery','SUP_TRACTOR_KAROI', 16.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR',   'Combine harvester hire',     'machinery','SUP_TRACTOR_CHN',   44.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR',   'Combine harvester hire',     'machinery','SUP_TRACTOR_KADOMA',43.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_SHELLER_DAY',   'Maize sheller',              'machinery','SUP_TRACTOR_CHN',    0.82,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_SHELLER_DAY',   'Maize sheller',              'machinery','SUP_TRACTOR_KAROI',  0.85,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire',       'machinery','SUP_TRACTOR_CHN',   24.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire',       'machinery','SUP_TRACTOR_KAROI', 26.00,'day','per day','manual',CURRENT_DATE),

-- Equipment
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_CHN_MAIN',29.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_KAROI',   30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGRIFOODS_CHN',    30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_CHN',     31.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_BANKET',     33.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_SANYATI',    35.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_TENGWE',     36.00,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_AGRIFOODS_CHN',  2.90,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_WINDMILL_CHN_MAIN',3.10,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_AGRIFOODS_CHN',   0.38,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_WINDMILL_CHN_MAIN',0.40,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_FARMCITY_CHN',   36.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_AGRIFOODS_CHN',  37.00,'each','each','manual',CURRENT_DATE)
;

-- ══ VERIFY ════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM markets   WHERE province = 'Mashonaland West';
-- SELECT COUNT(*) FROM suppliers WHERE province = 'Mashonaland West';
-- SELECT COUNT(*) FROM market_prices WHERE market_id LIKE 'MKT_CHINHOYI%' OR market_id LIKE 'MKT_KAROI%';
-- SELECT COUNT(*) FROM input_prices  WHERE supplier_id LIKE 'SUP_%CHN%' OR supplier_id LIKE 'SUP_%KAROI%';
