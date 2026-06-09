-- ============================================================
-- MDUMENI — Harare Province Complete Coverage
-- Markets, suppliers, crop prices, input prices
-- Covers: Harare CBD, Mbare, Highfield, Chitungwiza, Ruwa,
--         Norton, Epworth, Borrowdale, Avondale, Glen View,
--         Budiriro, Kuwadzana, Dzivarasekwa, Mabvuku, Tafara
-- ============================================================

-- ══ HARARE MARKETS ════════════════════════════════════════════════════════════

INSERT INTO markets (id, name, type, province, district, lat, lng, phone, min_quantity_kg, payment_methods) VALUES

-- Open markets
('MKT_MBARE_MAIN',    'Mbare Musika (Main)',        'open_market', 'Harare', 'Harare',       -17.8700, 31.0200, '+263242664000', 0,    ARRAY['cash','ecocash']),
('MKT_MBARE_VEG',     'Mbare Vegetable Market',     'open_market', 'Harare', 'Harare',       -17.8720, 31.0190, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_HIGHFIELD',     'Highfield Market',           'open_market', 'Harare', 'Harare',       -17.8900, 30.9800, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_GLENVIEW',      'Glen View Market',           'open_market', 'Harare', 'Harare',       -17.9200, 30.9700, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_CHITUNGWIZA',   'Chitungwiza Market',         'open_market', 'Harare', 'Chitungwiza',  -17.9900, 31.0700, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_RUWA',          'Ruwa Market',                'open_market', 'Harare', 'Ruwa',         -17.8900, 31.2400, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_NORTON',        'Norton Market',              'open_market', 'Harare', 'Norton',       -17.8800, 30.7000, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_EPWORTH',       'Epworth Market',             'open_market', 'Harare', 'Epworth',      -17.9300, 31.1500, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_MABVUKU',       'Mabvuku Market',             'open_market', 'Harare', 'Harare',       -17.8600, 31.1800, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_BUDIRIRO',      'Budiriro Market',            'open_market', 'Harare', 'Harare',       -17.9100, 30.9900, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_KUWADZANA',     'Kuwadzana Market',           'open_market', 'Harare', 'Harare',       -17.8800, 30.9400, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_DZIVARASEKWA',  'Dzivarasekwa Market',        'open_market', 'Harare', 'Harare',       -17.8700, 30.9500, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_TAFARA',        'Tafara Market',              'open_market', 'Harare', 'Harare',       -17.8500, 31.1600, NULL,            0,    ARRAY['cash','ecocash']),
('MKT_AVENUES',       'Avenues Fresh Produce',      'open_market', 'Harare', 'Harare',       -17.8200, 31.0450, NULL,            0,    ARRAY['cash','ecocash','bank_transfer']),

-- GMB depots — Harare
('MKT_GMB_HAR_MAIN',  'GMB Harare Main Depot',      'gmb_depot',   'Harare', 'Harare',       -17.8700, 30.9700, '+263242753700', 1000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_GMB_HAR_RUWA',  'GMB Ruwa Depot',             'gmb_depot',   'Harare', 'Ruwa',         -17.8950, 31.2450, '+263270020100', 1000, ARRAY['bank_transfer','cheque']),
('MKT_GMB_HAR_NOR',   'GMB Norton Depot',           'gmb_depot',   'Harare', 'Norton',       -17.8850, 30.7050, '+263261223300', 1000, ARRAY['bank_transfer','cheque']),

-- Cooperatives
('MKT_COOP_CHITUN',   'Chitungwiza Farmers Co-op',  'cooperative', 'Harare', 'Chitungwiza',  -17.9950, 31.0650, '+263270022100', 500,  ARRAY['cash','ecocash','bank_transfer']),
('MKT_COOP_RUWA',     'Ruwa Farmers Co-op',         'cooperative', 'Harare', 'Ruwa',         -17.8920, 31.2350, NULL,            200,  ARRAY['cash','ecocash']),

-- Export buyers — Harare
('MKT_EXP_HAR_AFC',   'Afrocom Export Harare',      'export_buyer','Harare', 'Harare',       -17.8250, 31.0333, '+263242776600', 5000, ARRAY['bank_transfer','ecocash']),
('MKT_EXP_HAR_ZT',    'ZimTrade Export Centre',     'export_buyer','Harare', 'Harare',       -17.8190, 31.0500, '+263242702600', 10000,ARRAY['bank_transfer']),
('MKT_EXP_HAR_GRAIN', 'Harare Grain Traders',       'export_buyer','Harare', 'Harare',       -17.8300, 31.0400, '+263242700900', 2000, ARRAY['bank_transfer','cheque','ecocash']),
('MKT_EXP_HAR_OIL',   'National Foods Harare',      'export_buyer','Harare', 'Harare',       -17.8150, 31.0550, '+263242701200', 5000, ARRAY['bank_transfer'])

ON CONFLICT (id) DO NOTHING;


-- ══ HARARE SUPPLIERS ══════════════════════════════════════════════════════════

INSERT INTO suppliers (id, name, branch, type, province, district, lat, lng, phone) VALUES

-- Windmill — Harare suburbs
('SUP_WINDMILL_HAR_CBD',  'Windmill Farm Stores', 'Harare CBD',      'agro_dealer', 'Harare', 'Harare',      -17.8200, 31.0400, '+263242252252'),
('SUP_WINDMILL_HAR_MSAS', 'Windmill Farm Stores', 'Msasa',           'agro_dealer', 'Harare', 'Harare',      -17.8450, 31.1100, '+263242447100'),
('SUP_WINDMILL_HAR_NOR',  'Windmill Farm Stores', 'Norton',          'agro_dealer', 'Harare', 'Norton',      -17.8800, 30.7000, '+263261223400'),
('SUP_WINDMILL_HAR_RUWA', 'Windmill Farm Stores', 'Ruwa',            'agro_dealer', 'Harare', 'Ruwa',        -17.8880, 31.2420, '+263270020200'),

-- Agrifoods — Harare
('SUP_AGRIFOODS_HAR_CBD', 'Agrifoods',            'Harare CBD',      'agro_dealer', 'Harare', 'Harare',      -17.8300, 31.0200, '+263242792100'),
('SUP_AGRIFOODS_HAR_SOUT','Agrifoods',            'Southerton',      'agro_dealer', 'Harare', 'Harare',      -17.8600, 31.0100, '+263242793100'),
('SUP_AGRIFOODS_HAR_RUWA','Agrifoods',            'Ruwa',            'agro_dealer', 'Harare', 'Ruwa',        -17.8900, 31.2410, '+263270020300'),

-- ZFC — Harare
('SUP_ZFC_HAR_CBD',       'ZFC Limited',          'Harare CBD',      'fertiliser',  'Harare', 'Harare',      -17.8100, 31.0300, '+263242704100'),
('SUP_ZFC_HAR_MSAS',      'ZFC Limited',          'Msasa',           'fertiliser',  'Harare', 'Harare',      -17.8400, 31.1050, '+263242447200'),
('SUP_ZFC_HAR_NOR',       'ZFC Limited',          'Norton',          'fertiliser',  'Harare', 'Norton',      -17.8820, 30.7020, '+263261223500'),

-- Seed Co — Harare
('SUP_SEEDCO_HAR_CBD',    'Seed Co',              'Harare CBD',      'seed_company','Harare', 'Harare',      -17.8150, 31.0350, '+263242664400'),
('SUP_SEEDCO_HAR_MSAS',   'Seed Co',              'Msasa Plant',     'seed_company','Harare', 'Harare',      -17.8380, 31.1080, '+263242447300'),
('SUP_SEEDCO_HAR_RUWA',   'Seed Co',              'Ruwa Depot',      'seed_company','Harare', 'Ruwa',        -17.8870, 31.2400, '+263270020400'),

-- Pannar — Harare
('SUP_PANNAR_HAR_CBD',    'Pannar Seeds',         'Harare CBD',      'seed_company','Harare', 'Harare',      -17.8220, 31.0420, '+263242700300'),

-- Pioneer/Corteva — Harare
('SUP_PIONEER_HAR_CBD',   'Pioneer Seeds',        'Harare CBD',      'seed_company','Harare', 'Harare',      -17.8280, 31.0380, '+263242700400'),

-- Farm & City — Harare suburbs
('SUP_FARMCITY_HAR_CBD',  'Farm & City Centre',   'Harare CBD',      'agro_dealer', 'Harare', 'Harare',      -17.8320, 31.0480, '+263242700700'),
('SUP_FARMCITY_HAR_GUNHI','Farm & City Centre',   'Gunhill',         'agro_dealer', 'Harare', 'Harare',      -17.7950, 31.0600, '+263242700701'),
('SUP_FARMCITY_HAR_AVON', 'Farm & City Centre',   'Avondale',        'agro_dealer', 'Harare', 'Harare',      -17.8050, 31.0250, '+263242700702'),

-- Agromart — Harare
('SUP_AGROMART_HAR',      'Agromart',             'Harare CBD',      'agro_dealer', 'Harare', 'Harare',      -17.8250, 31.0410, '+263242700500'),
('SUP_AGROMART_CHITUN',   'Agromart',             'Chitungwiza',     'agro_dealer', 'Harare', 'Chitungwiza', -17.9920, 31.0680, '+263270022200'),

-- Quton — Harare
('SUP_QUTON_HAR_CBD',     'Quton Seed Co',        'Harare CBD',      'seed_company','Harare', 'Harare',      -17.8200, 31.0400, '+263242700800'),

-- Tractor hire — Harare
('SUP_TRACTOR_HAR_CBD',   'Harare Mechanisation', 'Harare CBD',      'equipment',   'Harare', 'Harare',      -17.8250, 31.0450, '+263242701100'),
('SUP_TRACTOR_HAR_NOR',   'Norton Tractor Hire',  'Norton',          'equipment',   'Harare', 'Norton',      -17.8830, 30.7030, '+263261223600'),
('SUP_TRACTOR_HAR_RUWA',  'Ruwa Farm Services',   'Ruwa',            'equipment',   'Harare', 'Ruwa',        -17.8910, 31.2430, '+263270020500'),
('SUP_TRACTOR_HAR_CHIT',  'Chitungwiza Agri Svcs','Chitungwiza',     'equipment',   'Harare', 'Chitungwiza', -17.9930, 31.0700, '+263270022300'),

-- Local agro-dealers — Harare suburbs
('SUP_LOCAL_MBARE',       'Mbare Agro-Dealer',    'Mbare',           'agro_dealer', 'Harare', 'Harare',      -17.8700, 31.0200, NULL),
('SUP_LOCAL_HIGHFIELD',   'Highfield Agro-Dealer','Highfield',       'agro_dealer', 'Harare', 'Harare',      -17.8900, 30.9800, NULL),
('SUP_LOCAL_GLENVIEW',    'Glen View Agro-Dealer','Glen View',       'agro_dealer', 'Harare', 'Harare',      -17.9200, 30.9700, NULL),
('SUP_LOCAL_CHITUN',      'Chitungwiza Agro',     'Chitungwiza',     'agro_dealer', 'Harare', 'Chitungwiza', -17.9950, 31.0700, NULL),
('SUP_LOCAL_EPWORTH',     'Epworth Agro-Dealer',  'Epworth',         'agro_dealer', 'Harare', 'Epworth',     -17.9300, 31.1500, NULL),
('SUP_LOCAL_NORTON',      'Norton Agro-Dealer',   'Norton',          'agro_dealer', 'Harare', 'Norton',      -17.8800, 30.7000, NULL)

ON CONFLICT (id) DO NOTHING;


-- ══ HARARE CROP PRICES — all markets ══════════════════════════════════════════

INSERT INTO market_prices (crop_id, crop_name, market_id, price_usd_kg, quality_grade, source, price_date) VALUES

-- Sugar beans — all Harare markets
('CROP_002','Sugar beans','MKT_MBARE_MAIN',    0.74,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MBARE_VEG',     0.72,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_HIGHFIELD',      0.70,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GLENVIEW',       0.69,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_CHITUNGWIZA',    0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_RUWA',           0.71,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_NORTON',         0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EPWORTH',        0.66,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_MABVUKU',        0.69,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_BUDIRIRO',       0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_KUWADZANA',      0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_DZIVARASEKWA',   0.67,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_TAFARA',         0.69,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_AVENUES',        0.73,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_GMB_HAR_MAIN',   0.68,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_HAR_AFC',    0.81,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_HAR_ZT',     0.83,'premium', 'manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_EXP_HAR_GRAIN',  0.79,'standard','manual',CURRENT_DATE),
('CROP_002','Sugar beans','MKT_COOP_CHITUN',    0.70,'standard','manual',CURRENT_DATE),

-- Maize — all Harare markets
('CROP_001','Maize','MKT_MBARE_MAIN',    0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MBARE_VEG',     0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_HIGHFIELD',     0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GLENVIEW',      0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_CHITUNGWIZA',   0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_RUWA',          0.25,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_NORTON',        0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_EPWORTH',       0.22,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_MABVUKU',       0.24,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_BUDIRIRO',      0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_KUWADZANA',     0.23,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_HAR_MAIN',  0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_HAR_RUWA',  0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_GMB_HAR_NOR',   0.28,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_EXP_HAR_GRAIN', 0.27,'standard','manual',CURRENT_DATE),
('CROP_001','Maize','MKT_COOP_CHITUN',   0.25,'standard','manual',CURRENT_DATE),

-- Groundnuts — Harare markets
('CROP_003','Groundnuts','MKT_MBARE_MAIN',    0.75,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_MBARE_VEG',     0.73,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_HIGHFIELD',     0.71,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_CHITUNGWIZA',   0.69,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_RUWA',          0.72,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_NORTON',        0.68,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_GMB_HAR_MAIN',  0.70,'standard','manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_HAR_AFC',   0.91,'premium', 'manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_HAR_ZT',    0.88,'premium', 'manual',CURRENT_DATE),
('CROP_003','Groundnuts','MKT_EXP_HAR_GRAIN', 0.85,'standard','manual',CURRENT_DATE),

-- Tomatoes — Harare markets (high demand, higher prices)
('CROP_019','Tomatoes','MKT_MBARE_MAIN',    0.45,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_MBARE_VEG',     0.43,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_HIGHFIELD',     0.40,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_GLENVIEW',      0.38,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_CHITUNGWIZA',   0.38,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_RUWA',          0.42,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_NORTON',        0.40,'standard','manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_AVENUES',       0.50,'premium', 'manual',CURRENT_DATE),
('CROP_019','Tomatoes','MKT_BUDIRIRO',      0.38,'standard','manual',CURRENT_DATE),

-- Onions — Harare markets
('CROP_020','Onions','MKT_MBARE_MAIN',    0.55,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_MBARE_VEG',     0.52,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_HIGHFIELD',     0.48,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_CHITUNGWIZA',   0.46,'standard','manual',CURRENT_DATE),
('CROP_020','Onions','MKT_AVENUES',       0.60,'premium', 'manual',CURRENT_DATE),
('CROP_020','Onions','MKT_NORTON',        0.47,'standard','manual',CURRENT_DATE),

-- Soybeans — Harare
('CROP_009','Soybeans','MKT_GMB_HAR_MAIN',  0.48,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_MBARE_MAIN',    0.50,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_HAR_AFC',   0.55,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_HAR_OIL',   0.54,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_EXP_HAR_GRAIN', 0.52,'standard','manual',CURRENT_DATE),
('CROP_009','Soybeans','MKT_COOP_CHITUN',   0.49,'standard','manual',CURRENT_DATE),

-- Sunflower — Harare
('CROP_010','Sunflower','MKT_GMB_HAR_MAIN',  0.42,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_MBARE_MAIN',    0.38,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_EXP_HAR_OIL',   0.46,'standard','manual',CURRENT_DATE),
('CROP_010','Sunflower','MKT_EXP_HAR_GRAIN', 0.44,'standard','manual',CURRENT_DATE),

-- Sesame — Harare export buyers
('CROP_016','Sesame','MKT_EXP_HAR_AFC',   1.85,'premium', 'manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_EXP_HAR_ZT',    1.80,'premium', 'manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_MBARE_MAIN',    1.50,'standard','manual',CURRENT_DATE),
('CROP_016','Sesame','MKT_EXP_HAR_GRAIN', 1.70,'standard','manual',CURRENT_DATE),

-- Sweet potato — Harare markets
('CROP_004','Sweet potato','MKT_MBARE_MAIN',   0.35,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_MBARE_VEG',    0.33,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_HIGHFIELD',    0.30,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_CHITUNGWIZA',  0.28,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_NORTON',       0.30,'standard','manual',CURRENT_DATE),
('CROP_004','Sweet potato','MKT_AVENUES',      0.40,'premium', 'manual',CURRENT_DATE),

-- Cowpeas — Harare
('CROP_008','Cowpeas','MKT_MBARE_MAIN',    0.65,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_GMB_HAR_MAIN',  0.60,'standard','manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_EXP_HAR_GRAIN', 0.70,'premium', 'manual',CURRENT_DATE),
('CROP_008','Cowpeas','MKT_HIGHFIELD',     0.62,'standard','manual',CURRENT_DATE),

-- Sorghum — Harare
('CROP_006','Sorghum','MKT_GMB_HAR_MAIN',  0.22,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_MBARE_MAIN',    0.20,'standard','manual',CURRENT_DATE),
('CROP_006','Sorghum','MKT_CHITUNGWIZA',   0.19,'standard','manual',CURRENT_DATE),

-- Cabbages — Harare markets
('CROP_018','Cabbages','MKT_MBARE_MAIN',   0.25,'standard','manual',CURRENT_DATE),
('CROP_018','Cabbages','MKT_MBARE_VEG',    0.23,'standard','manual',CURRENT_DATE),
('CROP_018','Cabbages','MKT_HIGHFIELD',    0.20,'standard','manual',CURRENT_DATE),
('CROP_018','Cabbages','MKT_CHITUNGWIZA',  0.18,'standard','manual',CURRENT_DATE),
('CROP_018','Cabbages','MKT_AVENUES',      0.30,'premium', 'manual',CURRENT_DATE),
('CROP_018','Cabbages','MKT_NORTON',       0.20,'standard','manual',CURRENT_DATE)
;


-- ══ HARARE INPUT PRICES — every supplier ══════════════════════════════════════

INSERT INTO input_prices (product_id, product_name, category, supplier_id, price_usd, unit, unit_size, source, price_date) VALUES

-- ── FERTILISERS ──────────────────────────────────────────────────────────────

-- Compound D — all Harare suppliers
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_HAR_CBD',  17.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_HAR_MSAS', 17.40,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_HAR_NOR',  17.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_WINDMILL_HAR_RUWA', 17.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_HAR_CBD', 18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_HAR_SOUT',18.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGRIFOODS_HAR_RUWA',18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_HAR_CBD',       16.90,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_HAR_MSAS',      17.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_ZFC_HAR_NOR',       17.20,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_HAR_CBD',  18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_HAR_GUNHI',18.10,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_FARMCITY_HAR_AVON', 18.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_AGROMART_HAR',      17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_MBARE',       18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_HIGHFIELD',   18.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_CHITUN',      18.60,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_D_50','Compound D (7:14:7)','fertiliser','SUP_LOCAL_NORTON',      17.90,'bag','50kg','manual',CURRENT_DATE),

-- AN 34.5% — all Harare suppliers
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_HAR_CBD',       21.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_ZFC_HAR_MSAS',      21.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_HAR_CBD',  22.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_WINDMILL_HAR_MSAS', 22.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_AGRIFOODS_HAR_CBD', 21.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_FARMCITY_HAR_CBD',  22.50,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_AGROMART_HAR',      21.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_LOCAL_MBARE',       23.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AN_345_50','AN 34.5% Ammonium Nitrate','fertiliser','SUP_LOCAL_NORTON',      22.50,'bag','50kg','manual',CURRENT_DATE),

-- CAN 27% — Harare
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_ZFC_HAR_CBD',       19.50,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_ZFC_HAR_MSAS',      19.70,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_WINDMILL_HAR_CBD',  20.00,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_AGRIFOODS_HAR_CBD', 20.20,'bag','50kg','manual',CURRENT_DATE),
('INP_CAN_50','CAN 27% Calcium Ammonium','fertiliser','SUP_AGROMART_HAR',      20.00,'bag','50kg','manual',CURRENT_DATE),

-- Compound S — Harare
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_ZFC_HAR_CBD',       17.80,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_WINDMILL_HAR_CBD',  18.50,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_AGRIFOODS_HAR_CBD', 19.00,'bag','50kg','manual',CURRENT_DATE),
('INP_COMP_S_50','Compound S (6:28:23)','fertiliser','SUP_FARMCITY_HAR_CBD',  18.80,'bag','50kg','manual',CURRENT_DATE),

-- Urea — Harare
('INP_UREA_50','Urea 46% Nitrogen','fertiliser','SUP_ZFC_HAR_CBD',       25.00,'bag','50kg','manual',CURRENT_DATE),
('INP_UREA_50','Urea 46% Nitrogen','fertiliser','SUP_WINDMILL_HAR_CBD',  25.80,'bag','50kg','manual',CURRENT_DATE),
('INP_UREA_50','Urea 46% Nitrogen','fertiliser','SUP_AGRIFOODS_HAR_CBD', 26.00,'bag','50kg','manual',CURRENT_DATE),
('INP_UREA_50','Urea 46% Nitrogen','fertiliser','SUP_AGROMART_HAR',      25.50,'bag','50kg','manual',CURRENT_DATE),

-- Super Phosphate — Harare
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_ZFC_HAR_CBD',      14.50,'bag','50kg','manual',CURRENT_DATE),
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_WINDMILL_HAR_CBD', 15.20,'bag','50kg','manual',CURRENT_DATE),
('INP_SUPERPH_50','Super Phosphate (10:20:0)','fertiliser','SUP_AGRIFOODS_HAR_CBD',15.50,'bag','50kg','manual',CURRENT_DATE),

-- Agricultural Lime — Harare
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_HAR_CBD',       3.20,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_ZFC_HAR_MSAS',      3.30,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_HAR_CBD',  3.80,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_WINDMILL_HAR_NOR',  3.90,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_AGRIFOODS_HAR_CBD', 4.00,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_FARMCITY_HAR_CBD',  4.10,'bag','50kg','manual',CURRENT_DATE),
('INP_AGRILIME_50','Agricultural Lime','fertiliser','SUP_LOCAL_NORTON',      4.20,'bag','50kg','manual',CURRENT_DATE),

-- ── SEEDS — Harare ────────────────────────────────────────────────────────────

-- Maize seeds
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_HAR_CBD',   7.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_HAR_MSAS',  7.40,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_SEEDCO_HAR_RUWA',  7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_AGRIFOODS_HAR_CBD',7.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_WINDMILL_HAR_CBD', 7.60,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_FARMCITY_HAR_CBD', 7.90,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_AGROMART_HAR',     7.70,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_LOCAL_NORTON',     8.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_ZM521','Maize Seed ZM521 OPV','seed','SUP_LOCAL_CHITUN',     8.10,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_HAR_CBD',  12.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_SEEDCO_HAR_MSAS', 12.40,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_AGRIFOODS_HAR_CBD',13.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_WINDMILL_HAR_CBD', 12.80,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC403','Maize Seed SC403 Hybrid','seed','SUP_FARMCITY_HAR_CBD', 13.20,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_SEEDCO_HAR_CBD',  15.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_AGRIFOODS_HAR_CBD',15.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_SC627','Maize Seed SC627 Hybrid','seed','SUP_WINDMILL_HAR_CBD', 15.20,'bag','10kg','manual',CURRENT_DATE),

('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_PANNAR_HAR_CBD',   11.50,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_AGRIFOODS_HAR_CBD',12.00,'bag','10kg','manual',CURRENT_DATE),
('INP_SEED_PAN53','Maize Pannar PAN53','seed','SUP_FARMCITY_HAR_CBD', 12.20,'bag','10kg','manual',CURRENT_DATE),

-- Sugar bean seeds
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_SEEDCO_HAR_CBD',   1.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_AGRIFOODS_HAR_CBD',1.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_WINDMILL_HAR_CBD', 1.85,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_FARMCITY_HAR_CBD', 1.95,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_AGROMART_HAR',     1.90,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_1KG','Sugar Bean Chivaura','seed','SUP_LOCAL_NORTON',     2.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_PAN','Sugar Bean PAN 9216','seed','SUP_PANNAR_HAR_CBD',   2.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SB_PAN','Sugar Bean PAN 9216','seed','SUP_AGRIFOODS_HAR_CBD',2.30,'kg','1kg','manual',CURRENT_DATE),

-- Groundnut seeds
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_SEEDCO_HAR_CBD',   2.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_WINDMILL_HAR_CBD', 2.60,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_AGRIFOODS_HAR_CBD',2.65,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_GN_1KG','Groundnut Falcon','seed','SUP_AGROMART_HAR',     2.55,'kg','1kg','manual',CURRENT_DATE),

-- Soybean seeds
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_SEEDCO_HAR_CBD',   3.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_SOPRANO','Soybean Soprano','seed','SUP_AGRIFOODS_HAR_CBD',3.40,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN1867','Soybean PAN 1867','seed','SUP_PANNAR_HAR_CBD',  3.50,'kg','1kg','manual',CURRENT_DATE),

-- Sunflower seeds
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_PANNAR_HAR_CBD',   3.80,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_AGRIFOODS_HAR_CBD',4.00,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN7080','Sunflower PANNAR 7080','seed','SUP_WINDMILL_HAR_CBD', 3.90,'kg','1kg','manual',CURRENT_DATE),

-- Sorghum seeds
('INP_SEED_SG_1KG','Sorghum SV2','seed','SUP_SEEDCO_HAR_CBD',   3.50,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_PAN8625','Sorghum PAN8625','seed','SUP_PANNAR_HAR_CBD',4.20,'kg','1kg','manual',CURRENT_DATE),

-- Cotton seeds
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_QUTON_HAR_CBD', 5.20,'kg','1kg','manual',CURRENT_DATE),
('INP_SEED_QUTON824','Cotton Quton 824','seed','SUP_SEEDCO_HAR_CBD',5.00,'kg','1kg','manual',CURRENT_DATE),

-- ── CHEMICALS — Harare ────────────────────────────────────────────────────────

-- Atrazine
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_HAR_CBD',  5.50,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_WINDMILL_HAR_MSAS', 5.60,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 5.80,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_FARMCITY_HAR_CBD',  5.60,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_AGROMART_HAR',      5.70,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_NORTON',      6.00,'litre','1L','manual',CURRENT_DATE),
('INP_ATRAZINE_1L','Atrazine 500SC 1L','chemical','SUP_LOCAL_CHITUN',      6.20,'litre','1L','manual',CURRENT_DATE),

-- Glyphosate
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_WINDMILL_HAR_CBD',  4.20,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 4.50,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_FARMCITY_HAR_CBD',  4.30,'litre','1L','manual',CURRENT_DATE),
('INP_GLYPHOSATE_1L','Glyphosate 360SL 1L','chemical','SUP_AGROMART_HAR',      4.40,'litre','1L','manual',CURRENT_DATE),
('INP_ROUNDUP_1L',   'Roundup 360SL 1L',   'chemical','SUP_WINDMILL_HAR_CBD',  4.50,'litre','1L','manual',CURRENT_DATE),
('INP_ROUNDUP_1L',   'Roundup 360SL 1L',   'chemical','SUP_FARMCITY_HAR_CBD',  4.60,'litre','1L','manual',CURRENT_DATE),

-- Chlorpyrifos
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_HAR_CBD',  7.50,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_WINDMILL_HAR_MSAS', 7.60,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 7.80,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_FARMCITY_HAR_CBD',  7.60,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_AGROMART_HAR',      7.70,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_MBARE',       8.20,'litre','1L','manual',CURRENT_DATE),
('INP_CHLORPYR_1L','Chlorpyrifos 480EC 1L','chemical','SUP_LOCAL_NORTON',      8.00,'litre','1L','manual',CURRENT_DATE),

-- Emamectin (Proclaim)
('INP_EMAMECTIN_200G','Emamectin Proclaim 200g','chemical','SUP_WINDMILL_HAR_CBD',  22.00,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin Proclaim 200g','chemical','SUP_AGRIFOODS_HAR_CBD', 23.00,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin Proclaim 200g','chemical','SUP_FARMCITY_HAR_CBD',  22.50,'each','200g','manual',CURRENT_DATE),
('INP_EMAMECTIN_200G','Emamectin Proclaim 200g','chemical','SUP_AGROMART_HAR',      22.80,'each','200g','manual',CURRENT_DATE),

-- Lambda-cyhalothrin
('INP_LAMBDA_1L','Lambda-cyhalothrin 50EC 1L','chemical','SUP_WINDMILL_HAR_CBD',  9.50,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 50EC 1L','chemical','SUP_AGRIFOODS_HAR_CBD',10.00,'litre','1L','manual',CURRENT_DATE),
('INP_LAMBDA_1L','Lambda-cyhalothrin 50EC 1L','chemical','SUP_FARMCITY_HAR_CBD',  9.80,'litre','1L','manual',CURRENT_DATE),

-- Nicosulfuron
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_WINDMILL_HAR_CBD',  18.00,'litre','1L','manual',CURRENT_DATE),
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 19.00,'litre','1L','manual',CURRENT_DATE),
('INP_NICOSULF_1L','Nicosulfuron 40SC 1L','chemical','SUP_FARMCITY_HAR_CBD',  18.50,'litre','1L','manual',CURRENT_DATE),

-- Mancozeb
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_WINDMILL_HAR_CBD',  8.50,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_AGRIFOODS_HAR_CBD', 9.00,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_FARMCITY_HAR_CBD',  8.80,'each','1kg','manual',CURRENT_DATE),
('INP_MANCOZEB_1KG','Mancozeb 80WP 1kg','chemical','SUP_AGROMART_HAR',      8.70,'each','1kg','manual',CURRENT_DATE),

-- Ridomil Gold
('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_WINDMILL_HAR_CBD',  18.00,'each','1kg','manual',CURRENT_DATE),
('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_AGRIFOODS_HAR_CBD', 19.00,'each','1kg','manual',CURRENT_DATE),
('INP_RIDOMIL_1KG','Ridomil Gold MZ 1kg','chemical','SUP_FARMCITY_HAR_CBD',  18.50,'each','1kg','manual',CURRENT_DATE),

-- Copper oxychloride
('INP_COPPER_1KG','Copper Oxychloride 1kg','chemical','SUP_WINDMILL_HAR_CBD',  7.50,'each','1kg','manual',CURRENT_DATE),
('INP_COPPER_1KG','Copper Oxychloride 1kg','chemical','SUP_AGRIFOODS_HAR_CBD', 8.00,'each','1kg','manual',CURRENT_DATE),
('INP_COPPER_1KG','Copper Oxychloride 1kg','chemical','SUP_FARMCITY_HAR_CBD',  7.80,'each','1kg','manual',CURRENT_DATE),

-- Dimethoate
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_WINDMILL_HAR_CBD',  5.80,'litre','1L','manual',CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 6.00,'litre','1L','manual',CURRENT_DATE),
('INP_DIMETHOATE_1L','Dimethoate 400EC 1L','chemical','SUP_AGROMART_HAR',      5.90,'litre','1L','manual',CURRENT_DATE),

-- Dual Gold
('INP_DUALGOLD_1L','Dual Gold 960EC 1L','chemical','SUP_WINDMILL_HAR_CBD',  12.50,'litre','1L','manual',CURRENT_DATE),
('INP_DUALGOLD_1L','Dual Gold 960EC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 13.00,'litre','1L','manual',CURRENT_DATE),
('INP_DUALGOLD_1L','Dual Gold 960EC 1L','chemical','SUP_FARMCITY_HAR_CBD',  12.80,'litre','1L','manual',CURRENT_DATE),

-- Score
('INP_SCORE_250ML','Score 250EC 250ml','chemical','SUP_WINDMILL_HAR_CBD',  12.00,'each','250ml','manual',CURRENT_DATE),
('INP_SCORE_250ML','Score 250EC 250ml','chemical','SUP_AGRIFOODS_HAR_CBD', 12.50,'each','250ml','manual',CURRENT_DATE),

-- Cypermethrin
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_WINDMILL_HAR_CBD',  6.50,'litre','1L','manual',CURRENT_DATE),
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_AGRIFOODS_HAR_CBD', 6.80,'litre','1L','manual',CURRENT_DATE),
('INP_CYPERMET_1L','Cypermethrin 200EC 1L','chemical','SUP_FARMCITY_HAR_CBD',  6.70,'litre','1L','manual',CURRENT_DATE),

-- Neem (organic)
('INP_NEEM_1L','Neem Extract 1L (organic)','chemical','SUP_FARMCITY_HAR_CBD',  6.00,'litre','1L','manual',CURRENT_DATE),
('INP_NEEM_1L','Neem Extract 1L (organic)','chemical','SUP_FARMCITY_HAR_AVON', 6.20,'litre','1L','manual',CURRENT_DATE),

-- ── MACHINERY — Harare ────────────────────────────────────────────────────────

('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_HAR_CBD',  55.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_HAR_NOR',  53.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_HAR_RUWA', 56.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLOUGH','Tractor ploughing + discing','machinery','SUP_TRACTOR_HAR_CHIT', 58.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_HAR_CBD',  20.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_HAR_NOR',  19.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_PLANT','Tractor planting','machinery','SUP_TRACTOR_HAR_RUWA', 21.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_HAR_CBD',  15.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_HAR_NOR',  14.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_TRACTOR_SPRAY','Boom sprayer hire','machinery','SUP_TRACTOR_HAR_RUWA', 16.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_COMBINE_HAR',  'Combine harvester hire','machinery','SUP_TRACTOR_HAR_CBD',  45.00,'hectare','per ha','manual',CURRENT_DATE),
('INP_COMBINE_HAR',  'Combine harvester hire','machinery','SUP_TRACTOR_HAR_RUWA', 43.00,'hectare','per ha','manual',CURRENT_DATE),

('INP_SHELLER_DAY',  'Maize sheller (per bag)','machinery','SUP_TRACTOR_HAR_CBD',  0.80,'bag','per 90kg bag','manual',CURRENT_DATE),
('INP_SHELLER_DAY',  'Maize sheller (per bag)','machinery','SUP_TRACTOR_HAR_CHIT', 0.85,'bag','per 90kg bag','manual',CURRENT_DATE),

('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_HAR_CBD',  25.00,'day','per day','manual',CURRENT_DATE),
('INP_IRRIGATION_HA','Irrigation pump hire (day)','machinery','SUP_TRACTOR_HAR_NOR',  23.00,'day','per day','manual',CURRENT_DATE),
('INP_MOTO_SPRAY',   'Motorised sprayer hire','machinery','SUP_TRACTOR_HAR_CBD',    8.00,'day','per day','manual',CURRENT_DATE),

-- ── EQUIPMENT — Harare ────────────────────────────────────────────────────────

('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_HAR_CBD',  28.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_WINDMILL_HAR_MSAS', 28.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGRIFOODS_HAR_CBD', 29.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_HAR_CBD',  30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_HAR_GUNHI',30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_FARMCITY_HAR_AVON', 30.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_AGROMART_HAR',      29.50,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_MBARE',       31.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_15L','Knapsack sprayer 15L','equipment','SUP_LOCAL_NORTON',      29.00,'each','each','manual',CURRENT_DATE),

('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_WINDMILL_HAR_CBD',  38.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_FARMCITY_HAR_CBD',  39.00,'each','each','manual',CURRENT_DATE),
('INP_KNAPSACK_20L','Knapsack sprayer 20L','equipment','SUP_AGRIFOODS_HAR_CBD', 40.00,'each','each','manual',CURRENT_DATE),

('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_AGRIFOODS_HAR_CBD', 2.80,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_WINDMILL_HAR_CBD',  3.00,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_FARMCITY_HAR_CBD',  2.90,'each','each','manual',CURRENT_DATE),
('INP_HERMETIC_50','Hermetic bag PICS 50kg','equipment','SUP_AGROMART_HAR',      2.85,'each','each','manual',CURRENT_DATE),

('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_AGRIFOODS_HAR_CBD', 0.35,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_WINDMILL_HAR_CBD',  0.38,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_FARMCITY_HAR_CBD',  0.40,'each','each','manual',CURRENT_DATE),
('INP_PP_BAG_50',  'PP woven bag 50kg','equipment','SUP_LOCAL_MBARE',       0.40,'each','each','manual',CURRENT_DATE),

('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_FARMCITY_HAR_CBD',  35.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_FARMCITY_HAR_GUNHI',35.50,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_AGRIFOODS_HAR_CBD', 36.00,'each','each','manual',CURRENT_DATE),
('INP_MOISTURE_MTR','Grain moisture meter','equipment','SUP_AGROMART_HAR',      35.80,'each','each','manual',CURRENT_DATE),

('INP_SILO_1T','Metal grain silo 1 tonne','equipment','SUP_AGRIFOODS_HAR_CBD',180.00,'each','each','manual',CURRENT_DATE),
('INP_SILO_2T','Metal grain silo 2 tonne','equipment','SUP_AGRIFOODS_HAR_CBD',320.00,'each','each','manual',CURRENT_DATE)
;

-- ══ VERIFY ════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM markets   WHERE province = 'Harare';   -- should be 24
-- SELECT COUNT(*) FROM suppliers WHERE province = 'Harare';   -- should be 30+
-- SELECT COUNT(*) FROM market_prices WHERE market_id LIKE 'MKT_MBARE%' OR market_id LIKE 'MKT_HIGHFIELD%';
-- SELECT COUNT(*) FROM input_prices  WHERE supplier_id LIKE 'SUP_%HAR%';
