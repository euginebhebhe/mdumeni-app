// src/hooks/useProjectMode.ts
// Manages the Demo / Real Project mode switch
// Demo mode: pre-seeded data, "DEMO" badge shown everywhere
// Real mode: farmer's own data, all features unlocked

import { useAppStore } from '@/store';
import { useSQLiteContext } from 'expo-sqlite';
import { saveProfile, setActiveCrop } from '@/db/database';

export type ProjectMode = 'demo' | 'real';

export function useProjectMode() {
  const db            = useSQLiteContext();
  const isDemoMode    = useAppStore((s) => s.isDemoMode);
  const setDemoMode   = useAppStore((s) => s.setDemoMode);
  const setProfile    = useAppStore((s) => s.setProfile);
  const setActiveCropStore = useAppStore((s) => s.setActiveCrop);
  const setOnboarding = useAppStore((s) => s.setOnboardingDone);

  const switchToDemo = async () => {
    const demoProfile = {
      agro_region:    2 as const,
      farm_size_ha:   2.4,
      has_irrigation: false,
      budget_level:   'low' as const,
      language:       'english' as const,
      province:       'Harare',
      district:       'Mount Pleasant',
      updated_at:     new Date().toISOString(),
    };
    await saveProfile(db, demoProfile);
    setProfile(demoProfile);

    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() - 35);
    await setActiveCrop(db, {
      crop_id:       'CROP_001',
      crop_name:     'Maize',
      planting_date: plantingDate.toISOString().split('T')[0],
      farm_size_ha:  2.4,
      budget_level:  'low',
      is_active:     1,
    });
    setDemoMode(true);
  };

  const switchToReal = () => {
    // Clear demo flag — onboarding will collect real data
    setDemoMode(false);
    setOnboarding(false);
  };

  return { isDemoMode, switchToDemo, switchToReal };
}
