-- ============================================================
-- MDUMENI — Mashonaland Central Complete Coverage
-- Districts: Bindura, Shamva, Mazowe, Guruve, Centenary,
--            Mount Darwin, Rushinga, Muzarabani
-- ============================================================

-- ══ MARKETS ═══════════════════════════════════════════════════════════════════

INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

-- Open markets
('MKT_BINDURA_MAIN',   'Bindura Main Market',       'open_market', 'Mashonaland Central', 'Bindura',      -17.3000, 31.3333, NULL, 0, ARRAY['cash','ecocash']),
('MKT_SHAMVA',         'Shamva Market',             'open_market', 'Mashonaland Central', 'Shamva',       -17.3167, 31.5500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MAZOWE',         'Mazowe Market',             'open_market', 'Mashonaland Central', 'Mazowe',       -17.4667, 30.9667, NULL, 0, ARRAY['cash','ecocash']),
('MKT_GURUVE',         'Guruve Market',             'open_market', 'Mashonaland Central', 'Guruve',       -16.6667, 30.7167, NULL, 0, ARRAY['cash','ecocash']),
('MKT_CENTENARY',      'Centenary Market',          'open_market', 'Mashonaland Central', 'Centenary',    -16.7333, 31.1167, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MOUNT_DARWIN',   'Mount Darwin Market',       'open_market', 'Mashonaland Central', 'Mount Darwin', -16.7833, 31.5833, NULL, 0, ARRAY['cash','ecocash']),
('MKT_RUSHINGA',       'Rushinga Growth Point',     'open_market', 'Mashonaland Central', 'Rushinga',     -16.4333, 32.0333, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MUZARABANI',     'Muzarabani Growth Point',   'open_market', 'Mashonaland Central', 'Muzarabani',   -16.2167, 31.3667, NULL, 0, ARRAY['cash','ecocash']),
('MKT_MVURWI_MAIN',    'Mvurwi Market',             'open_market', 'Mashonaland Central', 'Mazowe',       -17.0500, 30.8500, NULL, 0, ARRAY['cash','ecocash']),
('MKT_CONCESSION',     'Concession Market',         'open_market', 'Mashonaland Central', 'Mazowe',       -17.3833, 30.9333, NULL, 0, ARRAY['cash','ecocash']),
('MKT_DOTITO',         'Dotito Growth Point',       'open_market', 'Mashonaland Central', 'Mount Darwin', -16.5000, 31.6667, NULL, 0, ARRAY['cash','ecocash']),

-- GMB depots
('MKT_GMB_BINDURA',    'GMB Bindura Depot',         'gmb_depot',   'Mashonaland Central', 'Bindura',      -17.3050, 31.3380, '+263271720100', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_MTD',        'GMB Mount Darwin Depot',    'gmb_depot',   'Mashonaland Central', 'Mount Darwin', -16.7880, 31.5880, '+263275122100', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_CENTENARY',  'GMB Centenary Depot',       'gmb_depot',   'Mashonaland Central', 'Centenary',    -16.7380, 31.1220, '+263276122100', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_GURUVE',     'GMB Guruve Depot',          'gmb_depot',   'Mashonaland Central', 'Guruve',       -16.6720, 30.7220, '+263277122100', 1000, ARRAY['bank_transfer','cheque']),

-- Cooperatives
('MKT_COOP_BINDURA',   'Bindura Farmers Coop',      'cooperative', 'Mashonaland Central', 'Bindura',      -17.3020, 31.3350, '+263271720200', 500, ARRAY['cash','ecocash','bank_transfer']),
('MKT_COOP_MAZOWE',    'Mazowe Coop',               'cooperative', 'Mashonaland Central', 'Mazowe',       -17.4700, 30.9700, NULL,            200, ARRAY['cash','ecocash']),

-- Export buyers
('MKT_EXP_BINDURA',    'Export Buyer Bindura',      'export_buyer','Mashonaland Central', 'Bindura',      -17.2980, 31.3320, '+263271720300', 2000, ARRAY['bank_transfer','ecocash'])

ON CONFLICT (id) DO NOTHING;


-- ══ SUPPLIERS ═════════════════════════════════════════════════════════════════

INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

('SUP_WINDMILL_BIN_MAIN','Windmill Farm Stores','Bindura Main',    'agro_dealer', 'Mashonaland Central','Bindura',      -17.2990,31.3340,'+263271720400'),
('SUP_WINDMILL_SHAMVA',  'Windmill Farm Stores','Shamva',          'agro_dealer', 'Mashonaland Central','Shamva',       -17.3180,31.5520,'+263271720401'),
('SUP_WINDMILL_MTD',     'Windmill Farm Stores','Mount Darwin',    'agro_dealer', 'Mashonaland Central','Mount Darwin', -16.7850,31.5850,'+263275122200'),
('SUP_WINDMILL_MAZOWE',  'Windmill Farm Stores','Mazowe',          'agro_dealer', 'Mashonaland Central','Mazowe',       -17.4680,30.9680,'+263271720402'),
('SUP_AGRIFOODS_BIN',    'Agrifoods',           'Bindura',         'agro_dealer', 'Mashonaland Central','Bindura',      -17.3010,31.3360,'+263271720500'),
('SUP_AGRIFOODS_MTD',    'Agrifoods',           'Mount Darwin',    'agro_dealer', 'Mashonaland Central','Mount Darwin', -16.7860,31.5860,'+263275122300'),
('SUP_ZFC_BIN',          'ZFC Limited',         'Bindura',         'fertiliser',  'Mashonaland Central','Bindura',      -17.2980,31.3330,'+263271720600'),
('SUP_ZFC_CENTENARY',    'ZFC Limited',         'Centenary',       'fertiliser',  'Mashonaland Central','Centenary',    -16.7350,31.1190,'+263276122200'),
('SUP_SEEDCO_BIN',       'Seed Co',             'Bindura',         'seed_company','Mashonaland Central','Bindura',      -17.2970,31.3320,'+263271720700'),
('SUP_PANNAR_BIN',       'Pannar Seeds',        'Bindura',         'seed_company','Mashonaland Central','Bindura',      -17.2960,31.3310,'+263271720800'),
('SUP_FARMCITY_BIN',     'Farm & City Centre',  'Bindura',         'agro_dealer', 'Mashonaland Central','Bindura',      -17.3020,31.3370,'+263271720900'),
('SUP_TRACTOR_BIN',      'Bindura Mechanisation','Bindura',        'equipment',   'Mashonaland Central','Bindura',      -17.3030,31.3380,'+263271721000'),
('SUP_TRACTOR_MTD',      'Mount Darwin Farm Svcs','Mount Darwin',  'equipment',   'Mashonaland Central','Mount Darwin', -16.7870,31.5870,'+263275122400'),
('SUP_LOCAL_SHAMVA',     'Shamva Agro-Dealer',  'Shamva',          'agro_dealer', 'Mashonaland Central','Shamva',       -17.3167,31.5500,NULL),
('SUP_LOCAL_GURUVE',     'Guruve Agro-Dealer',  'Guruve',          'agro_dealer', 'Mashonaland Central','Guruve',       -16.6667,30.7167,NULL),
('SUP_LOCAL_CENTENARY',  'Centenary Agro',      'Centenary',       'agro_dealer', 'Mashonaland Central','Centenary',    -16.7333,31.1167,NULL),
('SUP_LOCAL_RUSHINGA',   'Rushinga Agro-Dealer','Rushinga',        'agro_dealer', 'Mashonaland Central','Rushinga',     -16.4333,32.0333,NULL),
('SUP_LOCAL_MUZARABANI', 'Muzarabani Agro',     'Muzarabani',      'agro_dealer', 'Mashonaland Central','Muzarabani',   -16.2167,31.3667,NULL),
('SUP_LOCAL_MVURWI',     'Mvurwi Agro-Dealer',  'Mvurwi',          'agro_dealer', 'Mashonaland Central','Mazowe',       -17.0500,30.8500,NULL),
('SUP_LOCAL_DOTITO',     'Dotito Agro-Dealer',  'Dotito',          'agro_dealer', 'Mashonaland Central','Mount Darwin', -16.5000,31.6667,NULL)

ON CONFLICT (id) DO NOTHING;


-- ══ CROP PRICES ═══════════════════════════════════════════════════════════════

INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans
('CROP_002','Sugar beans','MKT_BINDURA_MAIN',  0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_SHAMVA',         0.65,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MAZOWE',         0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GURUVE',         0.63,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_CENTENARY',      0.62,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MOUNT_DARWIN',   0.61,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_RUSHINGA',       0.58,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MUZARABANI',     0.56,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MVURWI_MAIN',    0.66,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_CONCESSION',     0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_DOTITO',         0.59,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_BINDURA',    0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_MTD',        0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_CENTENARY',  0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_BINDURA',    0.75,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_COOP_BINDURA',   0.67,'standard','manual',CURRENT_DATE),

-- Maize
('CROP_001','Maize','MKT_BINDURA_MAIN',  0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_SHAMVA',        0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MAZOWE',        0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GURUVE',        0.22,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_CENTENARY',     0.21,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MOUNT_DARWIN',  0.21,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_RUSHINGA',      0.19,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MUZARABANI',    0.18,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MVURWI_MAIN',   0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_CONCESSION',    0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_BINDURA',   0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_MTD',       0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_CENTENARY', 0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_GURUVE',    0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_COOP_BINDURA',  0.25,'standard','manual',CURRENT_DATE),

-- Tobacco — key crop
('CROP_012','Tobacco','MKT_BINDURA_MAIN',  2.10,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_CENTENARY',     2.15,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_MOUNT_DARWIN',  2.05,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_GURUVE',        2.00,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_GMB_BINDURA',   2.10,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_EXP_BINDURA',   2.35,'premium', 'manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_COOP_BINDURA',  2.15,'standard','manual',CURRENT_DATE),
('CROP_012','Tobacco','MKT_SHAMVA',        2.00,'standard','manual',CURRENT_DATE),

-- Groundnuts
('CROP_003','Groundnuts','MKT_BINDURA_MAIN', 0.69,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MAZOWE',       0.68,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MVURWI_MAIN',  0.67,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_CENTENARY',    0.64,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MOUNT_DARWIN', 0.62,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GMB_BINDURA',  0.68,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_BINDURA',  0.85,'premium', 'manual',CURRENT_DATE),

-- Soybeans
('CROP_009','Soybeans','MKT_BINDURA_MAIN', 0.47,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_MAZOWE',       0.46,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_GMB_BINDURA',  0.47,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_BINDURA',  0.52,'standard','manual',CURRENT_DATE),

-- Sunflower
('CROP_010','Sunflower','MKT_BINDURA_MAIN', 0.39,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_GMB_BINDURA',  0.42,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_EXP_BINDURA',  0.44,'standard','manual',CURRENT_DATE),

-- Cotton
('CROP_011','Cotton','MKT_CENTENARY',    0.36,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_GURUVE',       0.35,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_MOUNT_DARWIN', 0.35,'standard','manual',CURRENT_DATE),
('CROP_011','Cotton','MKT_GMB_BINDURA',  0.37,'standard','manual',CURRENT_DATE),

-- Sorghum
('CROP_006','Sorghum','MKT_GURUVE',       0.19,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MOUNT_DARWIN', 0.18,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MUZARABANI',   0.17,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_GMB_BINDURA',  0.22,'standard','manual',CURRENT_DATE),

-- Pearl millet
('CROP_007','Pearl millet','MKT_GURUVE',       0.16,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_MUZARABANI',   0.15,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_RUSHINGA',     0.15,'standard','manual',CURRENT_DATE),
('CROP_007','Pearl millet','MKT_MOUNT_DARWIN', 0.17,'standard','manual',CURRENT_DATE),

-- Tomatoes
('CROP_019','Tomatoes','MKT_BINDURA_MAIN', 0.42,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MAZOWE',       0.40,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_SHAMVA',       0.38,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_CONCESSION',   0.41,'standard','manual',CURRENT_DATE),

-- Sweet potato
('CROP_004','Sweet potato','MKT_BINDURA_MAIN', 0.30,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_MAZOWE',       0.29,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_CENTENARY',    0.27,'standard','manual',CURRENT_DATE),

-- Cowpeas
('CROP_008','Cowpeas','MKT_BINDURA_MAIN',  0.60,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_CENTENARY',     0.56,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_MOUNT_DARWIN',  0.54,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_GMB_BINDURA',   0.58,'standard','manual',CURRENT_DATE)
;


-- ══ INPUT PRICES ══════════════════════════════════════════════════════════════

INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- Compound D
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_BIN_MAIN',17.30,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_SHAMVA',  17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MTD',     18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_MAZOWE',  17.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_BIN',    18.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_MTD',    19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_BIN',          17.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_CENTENARY',    17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_BIN',     18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_SHAMVA',     19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_GURUVE',     20.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_CENTENARY',  19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_RUSHINGA',   22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MUZARABANI', 23.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MVURWI',     18.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_DOTITO',     21.00,'bag','50kg','manual',CURRENT_DATE),

-- AN 34.5%
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_ZFC_BIN',          21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_ZFC_CENTENARY',    22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_WINDMILL_BIN_MAIN',22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_WINDMILL_MTD',     23.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_AGRIFOODS_BIN',    21.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_LOCAL_GURUVE',     25.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_LOCAL_RUSHINGA',   27.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5%','fertiliser','SUP_LOCAL_MUZARABANI', 28.00,'bag','50kg','manual',CURRENT_DATE),

-- CAN
('INP_CAN_50','CAN 27%','fertiliser','SUP_ZFC_BIN',          19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_WINDMILL_BIN_MAIN',20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27%','fertiliser','SUP_AGRIFOODS_BIN',    20.50,'bag','50kg','manual',CURRENT_DATE),

-- Compound L — tobacco
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_ZFC_BIN',          19.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_BIN_MAIN',20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_WINDMILL_MTD',     21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_AGRIFOODS_BIN',    21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_ZFC_CENTENARY',    20.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_LOCAL_CENTENARY',  22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_L_50','Compound L (tobacco base)','fertiliser','SUP_LOCAL_GURUVE',     23.00,'bag','50kg','manual',CURRENT_DATE),

-- Agricultural Lime
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_BIN',          3.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_BIN_MAIN',3.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_AGRIFOODS_BIN',    4.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_SHAMVA',     4.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_GURUVE',     5.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_MUZARABANI', 5.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_RUSHINGA',   5.50,'bag','50kg','manual',CURRENT_DATE),

-- Seeds — Maize
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_SEEDCO_BIN',      7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_AGRIFOODS_BIN',   7.90,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_WINDMILL_BIN_MAIN',7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_SHAMVA',    8.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_GURUVE',    9.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_CENTENARY', 9.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_RUSHINGA',  10.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_MUZARABANI',11.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize ZM521 OPV','seed','SUP_LOCAL_DOTITO',    10.00,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_SEEDCO_BIN',      12.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_AGRIFOODS_BIN',   13.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_WINDMILL_BIN_MAIN',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_LOCAL_CENTENARY', 14.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize SC403 Hybrid','seed','SUP_LOCAL_GURUVE',    15.00,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_SEEDCO_BIN',    15.20,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize SC627 Hybrid','seed','SUP_AGRIFOODS_BIN', 15.80,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_PAN53','Maize PAN53','seed','SUP_PANNAR_BIN',     11.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize PAN53','seed','SUP_AGRIFOODS_BIN',  12.20,'bag','10kg','manual',CURRENT_DATE),

-- Seeds — Sugar beans
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_SEEDCO_BIN',      1.85,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_AGRIFOODS_BIN',   1.95,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_WINDMILL_BIN_MAIN',1.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_SHAMVA',    2.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_GURUVE',    2.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_RUSHINGA',  2.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_MUZARABANI',3.00,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Groundnuts
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_SEEDCO_BIN',      2.55,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_WINDMILL_BIN_MAIN',2.65,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_LOCAL_CENTENARY',  2.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_LOCAL_GURUVE',     3.10,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Soybean
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_BIN',    3.30,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_AGRIFOODS_BIN', 3.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN1867','seed','SUP_PANNAR_BIN',    3.60,'kg','1kg','manual',CURRENT_DATE),

-- Seeds — Sunflower
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_PANNAR_BIN',     3.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PAN7080','seed','SUP_AGRIFOODS_BIN',  4.10,'kg','1kg','manual',CURRENT_DATE),

-- Chemicals
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_BIN_MAIN',5.70,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_BIN',    6.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_FARMCITY_BIN',     5.80,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_SHAMVA',     6.80,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_GURUVE',     7.50,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_CENTENARY',  7.20,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_RUSHINGA',   8.50,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_MUZARABANI', 9.00,'litre','1L','manual',CURRENT_DATE),

('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_BIN_MAIN',7.70,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGRIFOODS_BIN',    8.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_SHAMVA',     9.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_GURUVE',    10.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_RUSHINGA',  11.00,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_MUZARABANI',12.00,'litre','1L','manual',CURRENT_DATE),

('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_WINDMILL_BIN_MAIN',4.40,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_AGRIFOODS_BIN',    4.70,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_LOCAL_GURUVE',     5.50,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_LOCAL_MUZARABANI', 6.50,'litre','1L','manual',CURRENT_DATE),

('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_WINDMILL_BIN_MAIN',22.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_AGRIFOODS_BIN',    23.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_LOCAL_GURUVE',     27.00,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin 200g','chemical','SUP_LOCAL_MUZARABANI', 29.00,'each','200g','manual',CURRENT_DATE),

('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_WINDMILL_BIN_MAIN',9.80,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_AGRIFOODS_BIN',   10.20,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 1L','chemical','SUP_LOCAL_CENTENARY', 11.50,'litre','1L','manual',CURRENT_DATE),

('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_WINDMILL_BIN_MAIN',8.80,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_AGRIFOODS_BIN',    9.30,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_LOCAL_GURUVE',    11.00,'each','1kg','manual',CURRENT_DATE),

('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_WINDMILL_BIN_MAIN',6.00,'litre','1L','manual',CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_AGRIFOODS_BIN',    6.30,'litre','1L','manual',CURRENT_DATE),

('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_WINDMILL_BIN_MAIN',18.80,'litre','1L','manual',CURRENT_DATE),
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_AGRIFOODS_BIN',    19.80,'litre','1L','manual',CURRENT_DATE),

-- Machinery
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_BIN',  55.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_MTD',  60.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_BIN',  20.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT', 'Tractor planting',           'machinery','SUP_TRACTOR_MTD',  23.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',          'machinery','SUP_TRACTOR_BIN',  15.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY', 'Boom sprayer hire',          'machinery','SUP_TRACTOR_MTD',  17.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR',   'Combine harvester hire',     'machinery','SUP_TRACTOR_BIN',  44.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_SHELLER_DAY',   'Maize sheller',              'machinery','SUP_TRACTOR_BIN',   0.82,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire',       'machinery','SUP_TRACTOR_BIN',  24.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA', 'Irrigation pump hire',       'machinery','SUP_TRACTOR_MTD',  28.00,'day','per day','manual',CURRENT_DATE),

-- Equipment
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_BIN_MAIN',29.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGRIFOODS_BIN',    30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_BIN',     31.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_SHAMVA',     33.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_GURUVE',     36.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_RUSHINGA',   40.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_MUZARABANI', 42.00,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_AGRIFOODS_BIN',  2.90,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50', 'Hermetic bag PICS 50kg','equipment','SUP_WINDMILL_BIN_MAIN',3.10,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_AGRIFOODS_BIN',   0.38,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',   'PP woven bag 50kg',    'equipment','SUP_WINDMILL_BIN_MAIN',0.40,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_FARMCITY_BIN',   36.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter', 'equipment','SUP_AGRIFOODS_BIN',  37.00,'each','each','manual',CURRENT_DATE)
;

-- ══ VERIFY ════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM markets   WHERE province = 'Mashonaland Central';
-- SELECT COUNT(*) FROM suppliers WHERE province = 'Mashonaland Central';
-- SELECT COUNT(*) FROM market_prices WHERE market_id LIKE 'MKT_BINDURA%' OR market_id LIKE 'MKT_CENTENARY%';
-- SELECT COUNT(*) FROM input_prices  WHERE supplier_id LIKE 'SUP_%BIN%' OR supplier_id LIKE 'SUP_LOCAL_GURUVE%';
