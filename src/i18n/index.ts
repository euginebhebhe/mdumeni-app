// src/i18n/index.ts
// Internationalisation — English and Shona
// Usage: const { t } = useTranslation();  then  t('home.greeting')
// Add Ndebele by duplicating the 'sn' block

export type Language = 'english' | 'shona' | 'ndebele';

export type TranslationKey =
  // Common
  | 'common.save' | 'common.cancel' | 'common.done' | 'common.close'
  | 'common.back' | 'common.next' | 'common.skip' | 'common.loading'
  | 'common.error' | 'common.retry' | 'common.yes' | 'common.no'
  | 'common.online' | 'common.offline' | 'common.demo_mode'
  // Home
  | 'home.title' | 'home.greeting' | 'home.soil_ph' | 'home.moisture'
  | 'home.temperature' | 'home.active_crop' | 'home.days_planted'
  | 'home.todays_task' | 'home.enter_readings' | 'home.start_real'
  | 'home.demo_banner' | 'home.pull_refresh'
  // Calendar
  | 'calendar.title' | 'calendar.tab_calendar' | 'calendar.tab_advice'
  | 'calendar.tab_pests' | 'calendar.phase' | 'calendar.days_to_harvest'
  | 'calendar.no_crop' | 'calendar.set_crop'
  // Analytics
  | 'analytics.title' | 'analytics.yield_forecast' | 'analytics.net_profit'
  | 'analytics.soil_ph' | 'analytics.progress' | 'analytics.season_history'
  | 'analytics.spending'
  // Chat
  | 'chat.title' | 'chat.online_sub' | 'chat.offline_sub'
  | 'chat.placeholder' | 'chat.offline_guide' | 'chat.offline_guide_sub'
  | 'chat.select_topic'
  // Settings
  | 'settings.title' | 'settings.farm_profile' | 'settings.app_settings'
  | 'settings.help' | 'settings.language' | 'settings.sensor_alerts'
  | 'settings.pair_sensor' | 'settings.edit_profile' | 'settings.active_crop'
  | 'settings.project_mode' | 'settings.record_yield' | 'settings.season_history'
  | 'settings.ask_ai' | 'settings.how_to_use' | 'settings.contact_extension'
  | 'settings.version' | 'settings.enter_readings'
  // Auth
  | 'auth.welcome_title' | 'auth.welcome_desc' | 'auth.create_account'
  | 'auth.login' | 'auth.phone_number' | 'auth.pin' | 'auth.confirm_pin'
  | 'auth.skip_demo' | 'auth.already_have' | 'auth.no_account'
  | 'auth.phone_placeholder' | 'auth.pin_mismatch'
  // Onboarding
  | 'onboard.welcome_title' | 'onboard.welcome_sub' | 'onboard.setup_farm'
  | 'onboard.province' | 'onboard.district' | 'onboard.region'
  | 'onboard.farm_size' | 'onboard.irrigation' | 'onboard.budget'
  | 'onboard.done_title' | 'onboard.open_app'
  // Yield recording
  | 'yield.title' | 'yield.actual_yield' | 'yield.total_cost'
  | 'yield.sale_price' | 'yield.notes' | 'yield.record_btn'
  | 'yield.ai_predicted' | 'yield.net_profit' | 'yield.roi'
  | 'yield.vs_ai' | 'yield.harvest_date'
  // Season history
  | 'history.title' | 'history.no_seasons' | 'history.no_seasons_sub'
  | 'history.record_yield_btn' | 'history.ai_accuracy'
  | 'history.total_profit' | 'history.seasons_completed'
  // Sensor
  | 'sensor.title' | 'sensor.ph' | 'sensor.moisture' | 'sensor.temp'
  | 'sensor.save' | 'sensor.all_readings' | 'sensor.status_ideal'
  | 'sensor.status_acidic' | 'sensor.status_dry' | 'sensor.status_wet'
  // Offline
  | 'offline.banner';

const translations: Record<Language, Record<TranslationKey, string>> = {
  english: {
    // Common
    'common.save':    'Save',
    'common.cancel':  'Cancel',
    'common.done':    'Done',
    'common.close':   'Close',
    'common.back':    'Back',
    'common.next':    'Next',
    'common.skip':    'Skip',
    'common.loading': 'Loading...',
    'common.error':   'Something went wrong',
    'common.retry':   'Try again',
    'common.yes':     'Yes',
    'common.no':      'No',
    'common.online':  'Online',
    'common.offline': 'Offline',
    'common.demo_mode': 'Demo mode',
    // Home
    'home.title':        'Dashboard',
    'home.greeting':     'Good morning',
    'home.soil_ph':      'Soil pH',
    'home.moisture':     'Moisture',
    'home.temperature':  'Temperature',
    'home.active_crop':  'Active crop',
    'home.days_planted': 'Day {{days}} of growing season',
    'home.todays_task':  "Today's task",
    'home.enter_readings': '✏️  Enter soil readings manually',
    'home.start_real':   'Start real →',
    'home.demo_banner':  'Showing pre-loaded farm data. Start a real project to use your own farm.',
    'home.pull_refresh': 'Pull to refresh',
    // Calendar
    'calendar.title':        'Calendar',
    'calendar.tab_calendar': 'Calendar',
    'calendar.tab_advice':   'Crop advice',
    'calendar.tab_pests':    'Pests',
    'calendar.phase':        'Phase {{num}}: {{name}}',
    'calendar.days_to_harvest': '{{days}} days to harvest',
    'calendar.no_crop':      'No active crop set',
    'calendar.set_crop':     'Set your crop in Settings',
    // Analytics
    'analytics.title':          'Analytics',
    'analytics.yield_forecast':  'Yield forecast',
    'analytics.net_profit':      'Net profit est.',
    'analytics.soil_ph':         'Avg soil pH',
    'analytics.progress':        'Season progress',
    'analytics.season_history':  'Season history',
    'analytics.spending':        'Input spending',
    // Chat
    'chat.title':         'MDUMENI Assistant',
    'chat.online_sub':    '🟢 Online · Ask anything',
    'chat.offline_sub':   '🔴 Offline · Browse guide below',
    'chat.placeholder':   'Ask any farming question...',
    'chat.offline_guide': 'Offline farming guide',
    'chat.offline_guide_sub': '486 questions · Tap a topic then tap a question',
    'chat.select_topic':  'Select a topic above',
    // Settings
    'settings.title':          'Settings & Help',
    'settings.farm_profile':   'Farm profile',
    'settings.app_settings':   'App settings',
    'settings.help':           'Help & Support',
    'settings.language':       'Language',
    'settings.sensor_alerts':  'Sensor alerts',
    'settings.pair_sensor':    'Pair sensor device',
    'settings.edit_profile':   'Edit farm profile',
    'settings.active_crop':    'Active crop & planting date',
    'settings.project_mode':   'Project mode',
    'settings.record_yield':   'Record harvest yield',
    'settings.season_history': 'Season history',
    'settings.ask_ai':         'Ask AI assistant',
    'settings.how_to_use':     'How to use MDUMENI',
    'settings.contact_extension': 'Contact extension officer',
    'settings.version':        'App version',
    'settings.enter_readings': 'Enter readings manually',
    // Auth
    'auth.welcome_title':   'Save your farm data',
    'auth.welcome_desc':    'Create an account so your crop history and soil readings are saved — even if you change phones.',
    'auth.create_account':  'Create account →',
    'auth.login':           'Login',
    'auth.phone_number':    'Phone number',
    'auth.pin':             'Your 4-digit PIN',
    'auth.confirm_pin':     'Confirm your PIN',
    'auth.skip_demo':       'Skip — use demo mode',
    'auth.already_have':    'I already have an account',
    'auth.no_account':      "No account yet? Register",
    'auth.phone_placeholder': 'e.g. 0771234567',
    'auth.pin_mismatch':    'PINs do not match',
    // Onboarding
    'onboard.welcome_title': 'Your digital farming guide',
    'onboard.welcome_sub':   'AI-powered crop recommendations based on your real soil conditions',
    'onboard.setup_farm':    'Set up my farm →',
    'onboard.province':      'Province',
    'onboard.district':      'District',
    'onboard.region':        'Agro-ecological region',
    'onboard.farm_size':     'Farm size (hectares)',
    'onboard.irrigation':    'Irrigation available',
    'onboard.budget':        'Input budget level',
    'onboard.done_title':    'Farm set up!',
    'onboard.open_app':      'Open MDUMENI →',
    // Yield
    'yield.title':        'Record harvest',
    'yield.actual_yield': 'Actual yield (kg)',
    'yield.total_cost':   'Total input cost (USD)',
    'yield.sale_price':   'Sale price per kg (USD)',
    'yield.notes':        'Notes (optional)',
    'yield.record_btn':   'Record harvest →',
    'yield.ai_predicted': 'AI predicted yield',
    'yield.net_profit':   'Net profit',
    'yield.roi':          'ROI',
    'yield.vs_ai':        'vs AI prediction',
    'yield.harvest_date': 'Harvest date',
    // History
    'history.title':             'Season history',
    'history.no_seasons':        'No seasons recorded yet',
    'history.no_seasons_sub':    'When you record your harvest yield, it will appear here.',
    'history.record_yield_btn':  '+ Record actual yield',
    'history.ai_accuracy':       'AI accuracy',
    'history.total_profit':      'Total profit',
    'history.seasons_completed': 'Seasons completed',
    // Sensor
    'sensor.title':        'Enter soil readings',
    'sensor.ph':           'Soil pH',
    'sensor.moisture':     'Soil moisture %',
    'sensor.temp':         'Soil temperature °C',
    'sensor.save':         'Update readings & run AI →',
    'sensor.all_readings': 'Enter all three readings',
    'sensor.status_ideal': 'Ideal for most crops',
    'sensor.status_acidic': 'Acidic — lime recommended',
    'sensor.status_dry':   'Too dry — irrigate',
    'sensor.status_wet':   'Waterlogged — improve drainage',
    // Offline
    'offline.banner': 'Offline — using cached data and on-device AI',
  },

  shona: {
    // Common
    'common.save':    'Sevha',
    'common.cancel':  'Dhimura',
    'common.done':    'Yapera',
    'common.close':   'Vhara',
    'common.back':    'Dzokera',
    'common.next':    'Enderera',
    'common.skip':    'Pinda',
    'common.loading': 'Kutarisira...',
    'common.error':   'Pane dambudziko',
    'common.retry':   'Edza zvakare',
    'common.yes':     'Hongu',
    'common.no':      'Kwete',
    'common.online':  'Online',
    'common.offline': 'Hauna intanethi',
    'common.demo_mode': 'Nzira yeDemo',
    // Home
    'home.title':        'Peji Huru',
    'home.greeting':     'Mangwanani akanaka',
    'home.soil_ph':      'pH yevhu',
    'home.moisture':     'Mvura muvhu',
    'home.temperature':  'Kupisa kwevhu',
    'home.active_crop':  'Goho rinorima',
    'home.days_planted': 'Zuva {{days}} rokukura',
    'home.todays_task':  'Basa reZuva Ranhasi',
    'home.enter_readings': '✏️  Pinda mavhiringi emvura',
    'home.start_real':   'Tanga chaiko →',
    'home.demo_banner':  'Iyi ndiyo demo data. Tanga purojekiti yechokwadi kushandisa farumu yako chaiko.',
    'home.pull_refresh': 'Dhonza kuvandudza',
    // Calendar
    'calendar.title':        'Kerendari',
    'calendar.tab_calendar': 'Kerendari',
    'calendar.tab_advice':   'Mazano eGoho',
    'calendar.tab_pests':    'Matekenyure',
    'calendar.phase':        'Chikamu {{num}}: {{name}}',
    'calendar.days_to_harvest': 'Mazuva {{days}} kusvika kukohwa',
    'calendar.no_crop':      'Hapana goho risati ragadzirwa',
    'calendar.set_crop':     'Gadzira goho paSetting',
    // Analytics
    'analytics.title':         'Ongororo',
    'analytics.yield_forecast': 'Kutarisirwa kwechibereko',
    'analytics.net_profit':     'Mubhadharo unofungidzirwa',
    'analytics.soil_ph':        'pH yevhu pachiripo',
    'analytics.progress':       'Kufambira kwemwaka',
    'analytics.season_history': 'Nhoroondo yemwaka',
    'analytics.spending':       'Mari yakashandiswa',
    // Chat
    'chat.title':         'Mubatsiri weMDUMENI',
    'chat.online_sub':    '🟢 Online · Bvunza chero chinhu',
    'chat.offline_sub':   '🔴 Hauna intanethi · Tsvaga pasi',
    'chat.placeholder':   'Bvunza mubvunzo upi neipi wekurima...',
    'chat.offline_guide': 'Gwaro rekurima risina intanethi',
    'chat.offline_guide_sub': 'Mibvunzo 486 · Dzvanya chikamu wobva wadzvanya mubvunzo',
    'chat.select_topic':  'Sarudza chikamu pamusoro',
    // Settings
    'settings.title':          'Magadziriro uye Rubatsiro',
    'settings.farm_profile':   'Rondedzero yeFarumu',
    'settings.app_settings':   'Magadziriro eApp',
    'settings.help':           'Rubatsiro',
    'settings.language':       'Mutauro',
    'settings.sensor_alerts':  'Zvirango zveSensor',
    'settings.pair_sensor':    'Batanidza sensor',
    'settings.edit_profile':   'Gadzira rondedzero yeFarumu',
    'settings.active_crop':    'Goho nesvondo yakadyarwa',
    'settings.project_mode':   'Nzira yePurojekiti',
    'settings.record_yield':   'Nyora chibereko chekohwa',
    'settings.season_history': 'Nhoroondo yemwaka',
    'settings.ask_ai':         'Bvunza mubatsiri weAI',
    'settings.how_to_use':     'Kuita sei neMDUMENI',
    'settings.contact_extension': 'Taura neExtension officer',
    'settings.version':        'Vhezheni yeApp',
    'settings.enter_readings': 'Pinda mavhiringi neruoko',
    // Auth
    'auth.welcome_title':   'Chengetedza data yefarumu yako',
    'auth.welcome_desc':    'Gadzira account kuti nhoroondo yako yemigwagwa uye mavhiringi evhu achengetedzwe — kunyange ukachinja runhare rwako.',
    'auth.create_account':  'Gadzira account →',
    'auth.login':           'Pinda',
    'auth.phone_number':    'Nhamba yefoni',
    'auth.pin':             'PIN yako yenhamba 4',
    'auth.confirm_pin':     'Simbidza PIN yako',
    'auth.skip_demo':       'Pinda — shandisa demo',
    'auth.already_have':    'Ndine account kare',
    'auth.no_account':      "Hapana account? Nyoresa",
    'auth.phone_placeholder': 'sekuita 0771234567',
    'auth.pin_mismatch':    'PIN hadzienzani',
    // Onboarding
    'onboard.welcome_title': 'Mudhumeni wako wepafoni',
    'onboard.welcome_sub':   'AI inokupa mazano egoho akaenderana nechokwadi chevhu chako',
    'onboard.setup_farm':    'Gadzira farumu yangu →',
    'onboard.province':      'Dunhu',
    'onboard.district':      'Nzvimbo',
    'onboard.region':        'Nharaunda yeZvirimo',
    'onboard.farm_size':     'Saizi yeFarumu (mahekita)',
    'onboard.irrigation':    'Mvura yekudiridza iripo',
    'onboard.budget':        'Mhando yekushandisa nguva',
    'onboard.done_title':    'Farumu yakagadzirwa!',
    'onboard.open_app':      'Vhura MDUMENI →',
    // Yield
    'yield.title':        'Nyora kohwa',
    'yield.actual_yield': 'Chibereko chakawanikwa (kg)',
    'yield.total_cost':   'Mutengo wose wemari (USD)',
    'yield.sale_price':   'Mutengo wekutengesa kg (USD)',
    'yield.notes':        'Zvinyorwa (hazvina basa)',
    'yield.record_btn':   'Nyora kohwa →',
    'yield.ai_predicted': 'AI yakafungidzira',
    'yield.net_profit':   'Mubhadharo',
    'yield.roi':          'Chibereko cheMari',
    'yield.vs_ai':        'vs AI',
    'yield.harvest_date': 'Zuva rekukohwa',
    // History
    'history.title':             'Nhoroondo yemwaka',
    'history.no_seasons':        'Hapana mwaka wakarekodwa',
    'history.no_seasons_sub':    'Kana ukanyora kohwa yako, ichaonekwa pano.',
    'history.record_yield_btn':  '+ Nyora chibereko chakawanikwa',
    'history.ai_accuracy':       'Kurangana kweAI',
    'history.total_profit':      'Mubhadharo wose',
    'history.seasons_completed': 'Mimwaka yapera',
    // Sensor
    'sensor.title':        'Pinda mavhiringi evhu',
    'sensor.ph':           'pH yevhu',
    'sensor.moisture':     'Mvura muvhu %',
    'sensor.temp':         'Kupisa kwevhu °C',
    'sensor.save':         'Vandudza mavhiringi uende ku AI →',
    'sensor.all_readings': 'Pinda mavhiringi ese matatu',
    'sensor.status_ideal': 'Zvakanaka zvikuru kurimwa',
    'sensor.status_acidic': 'Acidity — lime inodikanwa',
    'sensor.status_dry':   'Chakaoma — diridza',
    'sensor.status_wet':   'Mvura yakawanda — gadzira kuburikidza',
    // Offline
    'offline.banner': 'Hauna intanethi — kushandisa data yakachengeterwa neAI yepafoni',
  },

  ndebele: {
    // For now, Ndebele falls back to English
    // Full Ndebele translation to be added in v1.1
    'common.save':    'Londoloza',
    'common.cancel':  'Khansela',
    'common.done':    'Kwenziwe',
    'common.close':   'Vala',
    'common.back':    'Buyela',
    'common.next':    'Qhubeka',
    'common.skip':    'Dlula',
    'common.loading': 'Ilayisha...',
    'common.error':   'Kukhona iphutha',
    'common.retry':   'Zama futhi',
    'common.yes':     'Yebo',
    'common.no':      'Cha',
    'common.online':  'Ku-inthanethi',
    'common.offline': 'Akukho inthanethi',
    'common.demo_mode': 'Indlela ye-Demo',
    'home.title':        'Ikhasi Elikhulu',
    'home.greeting':     'Sawubona',
    'home.soil_ph':      'I-pH yomhlabathi',
    'home.moisture':     'Umanzi womhlabathi',
    'home.temperature':  'Ukushisa komhlabathi',
    'home.active_crop':  'Isivuno esikhula',
    'home.days_planted': 'Usuku {{days}} lokukhula',
    'home.todays_task':  'Umsebenzi Walamuhla',
    'home.enter_readings': '✏️  Faka izifundo zomhlabathi',
    'home.start_real':   'Qala eqinisileyo →',
    'home.demo_banner':  'Lokhu yidata ye-demo. Qala iprojecthi yangempela ukusebenzisa ipulazi lakho.',
    'home.pull_refresh': 'Donsa ukuhlaziya',
    // All other keys fall back to English — full translation in v1.1
    'calendar.title':        'Ikhalenda',
    'calendar.tab_calendar': 'Ikhalenda',
    'calendar.tab_advice':   'Iseluleko Sesivuno',
    'calendar.tab_pests':    'Izinambuzane',
    'calendar.phase':        'Isigaba {{num}}: {{name}}',
    'calendar.days_to_harvest': 'Izinsuku {{days}} kuze kuvunwe',
    'calendar.no_crop':      'Akukho sivuno esibekiwe',
    'calendar.set_crop':     'Beka isivuno kuzilungiselelo',
    'analytics.title':         'Ukuhlaziya',
    'analytics.yield_forecast': 'Isibikezelo sesivuno',
    'analytics.net_profit':     'Inzuzo ehlelelwe',
    'analytics.soil_ph':        'I-pH yomhlabathi',
    'analytics.progress':       'Inqubekelaphambili yesizini',
    'analytics.season_history': 'Umlando wesizini',
    'analytics.spending':       'Izindleko zokufakwa',
    'chat.title':         'Umsizi weMDUMENI',
    'chat.online_sub':    '🟢 Ku-inthanethi · Buza noma yini',
    'chat.offline_sub':   '🔴 Akukho inthanethi · Bhrowuza phansi',
    'chat.placeholder':   'Buza umbuzo noma owuni wolimo...',
    'chat.offline_guide': 'Umhlahlandlela wolimo ongenanthanethi',
    'chat.offline_guide_sub': 'Imibuzo engu-486 · Chofoza isihloko khona uchofoza umbuzo',
    'chat.select_topic':  'Khetha isihloko ngenhla',
    'settings.title':          'Izilungiselelo neSisekelo',
    'settings.farm_profile':   'Iphrofayili yePulazi',
    'settings.app_settings':   'Izilungiselelo ze-App',
    'settings.help':           'Usizo',
    'settings.language':       'Ulimi',
    'settings.sensor_alerts':  'Izexwayiso ze-Sensor',
    'settings.pair_sensor':    'Hlanganisa i-sensor',
    'settings.edit_profile':   'Hlela iphrofayili yepulazi',
    'settings.active_crop':    'Isivuno nosuku lokuhlwanyela',
    'settings.project_mode':   'Indlela yeProjecthi',
    'settings.record_yield':   'Qopha isivuno sokuvuna',
    'settings.season_history': 'Umlando wesizini',
    'settings.ask_ai':         'Buza umsizi we-AI',
    'settings.how_to_use':     'Ukusebenzisa MDUMENI kanjani',
    'settings.contact_extension': 'Xhumana ne-extension officer',
    'settings.version':        'Inguqulo ye-App',
    'settings.enter_readings': 'Faka izifundo ngesandla',
    'auth.welcome_title':   'Gcina idata yepulazi lakho',
    'auth.welcome_desc':    'Dala i-akhawunti ukuze umlando wakho wezivuno kanye nezifundo zomhlabathi zigcinwe.',
    'auth.create_account':  'Dala i-akhawunti →',
    'auth.login':           'Ngena',
    'auth.phone_number':    'Inombolo yefoni',
    'auth.pin':             'I-PIN yakho yezinombolo ezi-4',
    'auth.confirm_pin':     'Qinisekisa i-PIN yakho',
    'auth.skip_demo':       'Eqa — sebenzisa i-demo',
    'auth.already_have':    'Nginalenye i-akhawunti',
    'auth.no_account':      "Awunayo i-akhawunti? Bhalisa",
    'auth.phone_placeholder': 'isib. 0771234567',
    'auth.pin_mismatch':    'Ama-PIN awafani',
    'onboard.welcome_title': 'UMdhumeni wakho wefoni',
    'onboard.welcome_sub':   'I-AI ikunika izeluleko zezivuno ezisekelwe ezimweni zemvelo zomhlabathi wakho',
    'onboard.setup_farm':    'Lungisa ipulazi lami →',
    'onboard.province':      'Isifundazwe',
    'onboard.district':      'Isigodi',
    'onboard.region':        'Isifunda Sezolimo',
    'onboard.farm_size':     'Usayizi wePulazi (amahekitha)',
    'onboard.irrigation':    'Ukucenga kuyatholakala',
    'onboard.budget':        'Izinga lezindleko',
    'onboard.done_title':    'Ipulazi likhona!',
    'onboard.open_app':      'Vula MDUMENI →',
    'yield.title':        'Qopha ukuvuna',
    'yield.actual_yield': 'Isivuno sangempela (kg)',
    'yield.total_cost':   'Izindleko eziphelele (USD)',
    'yield.sale_price':   'Intengo yokuthengisa nge-kg (USD)',
    'yield.notes':        'Amanothi (akhethekile)',
    'yield.record_btn':   'Qopha ukuvuna →',
    'yield.ai_predicted': 'I-AI ibikezele',
    'yield.net_profit':   'Inzuzo emsulwa',
    'yield.roi':          'Inzuzo yeMali',
    'yield.vs_ai':        'vs AI',
    'yield.harvest_date': 'Usuku lokuvuna',
    'history.title':             'Umlando wesizini',
    'history.no_seasons':        'Akukho sizini equphiwe',
    'history.no_seasons_sub':    'Uma uqopha isivuno sakho, kuzovela lapha.',
    'history.record_yield_btn':  '+ Qopha isivuno sangempela',
    'history.ai_accuracy':       'Ukuchaneka kwe-AI',
    'history.total_profit':      'Inzuzo ephelele',
    'history.seasons_completed': 'Izimi ezifeziwe',
    'sensor.title':        'Faka izifundo zomhlabathi',
    'sensor.ph':           'I-pH yomhlabathi',
    'sensor.moisture':     'Umanzi womhlabathi %',
    'sensor.temp':         'Ukushisa komhlabathi °C',
    'sensor.save':         'Buyekeza izifundo uqhubeke ne-AI →',
    'sensor.all_readings': 'Faka izifundo ezitathu',
    'sensor.status_ideal': 'Kuhle kakhulu ukuhlwanyela',
    'sensor.status_acidic': 'Umchakide — i-lime iyadingeka',
    'sensor.status_dry':   'Omile kakhulu — singathelela',
    'sensor.status_wet':   'Manzi kakhulu — thuthukisa ukuchosheka',
    'offline.banner': 'Akukho inthanethi — kusebenzisa idata egciniwe ne-AI yefoni',
  },
};

/** Translate a key, replacing {{variable}} placeholders */
export function t(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const str = translations[lang]?.[key] ?? translations.english[key] ?? key;
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
    str
  );
}
