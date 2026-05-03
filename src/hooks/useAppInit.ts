// src/hooks/useAppInit.ts
// Runs once on app startup inside SQLiteProvider
// Loads profile + active crop from SQLite into Zustand store
// Seeds demo data on very first launch so app is never empty

import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '@/store';
import {
  getProfile,
  getActiveCrop,
  getLatestReading,
  saveProfile,
  setActiveCrop as dbSetActiveCrop,
  insertReading,
} from '@/db/database';

export function useAppInit() {
  const db = useSQLiteContext();
  const setProfile    = useAppStore((s) => s.setProfile);
  const setActiveCrop = useAppStore((s) => s.setActiveCrop);
  const setSensor     = useAppStore((s) => s.setSensorReading);
  const setOnboarding = useAppStore((s) => s.setOnboardingDone);

  useEffect(() => {
    async function init() {
      try {
        // Load farmer profile
        let profile = await getProfile(db);

        // Seed demo profile on first launch
        if (!profile || !profile.district) {
          await saveProfile(db, {
            agro_region:    2,
            farm_size_ha:   2.4,
            has_irrigation: false,
            budget_level:   'low',
            language:       'english',
            province:       'Harare',
            district:       'Mount Pleasant',
          });
          profile = await getProfile(db);
          // Mark onboarding done for demo
          setOnboarding(true);
        } else {
          setOnboarding(true);
        }

        if (profile) setProfile(profile);

        // Load active crop
        let crop = await getActiveCrop(db);

        // Seed demo active crop on first launch
        if (!crop) {
          const plantingDate = new Date();
          plantingDate.setDate(plantingDate.getDate() - 35); // planted 35 days ago
          await dbSetActiveCrop(db, {
            crop_id:       'CROP_001',
            crop_name:     'Maize',
            planting_date: plantingDate.toISOString().split('T')[0],
            farm_size_ha:  2.4,
            budget_level:  'low',
            is_active:     1,
          });
          crop = await getActiveCrop(db);
        }

        if (crop) setActiveCrop(crop);

        // Load latest sensor reading
        const reading = await getLatestReading(db);

        if (reading) {
          setSensor(reading);
        } else {
          // Seed a realistic demo reading so sensor tiles show data
          const demoReading = {
            device_id:   'MDUMENI-001',
            soil_ph:     5.1,
            moisture_pct: 62,
            temp_c:      24.0,
            battery_pct: 87,
            signal_rssi: -52,
            recorded_at: new Date().toISOString(),
            is_synced:   0 as const,
          };
          await insertReading(db, demoReading);
          setSensor({ ...demoReading, id: 1 });
        }
      } catch (e) {
        console.error('App init error:', e);
      }
    }

    init();
  }, [db]);
}
