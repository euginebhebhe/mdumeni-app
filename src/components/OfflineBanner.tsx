// src/components/OfflineBanner.tsx
// Slim banner shown at top of every screen when device is offline
// Disappears automatically when connection is restored

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors } from '@/constants/theme';

export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  const { t }    = useTranslation();
  if (isOnline) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>Offline — using cached data and on-device AI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EF9F27',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  icon: { fontSize: 12 },
  text: { fontSize: 11, fontWeight: '600', color: '#fff' },
});
