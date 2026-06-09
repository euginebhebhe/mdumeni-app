// src/services/notifications.ts
// Expo Push Notifications — free, no third-party service needed
// Three triggers:
//   1. Daily task reminder (8am) — today's farming task
//   2. Sensor alert — pH or moisture crosses critical threshold
//   3. Harvest approaching — when crop is within 14 days of harvest

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { TokenStorage } from './storage';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
});

// ── Register device for push notifications ────────────────────────────────────
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('mdumeni', {
      name:             'MDUMENI Alerts',
      importance:       Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#1A5C2A',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await TokenStorage.savePushToken(token);
  return token;
}

// ── Schedule daily task reminder ──────────────────────────────────────────────
export async function scheduleDailyTaskReminder(taskTitle: string): Promise<void> {
  // Cancel any existing daily reminder first
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 MDUMENI — Today\'s task',
      body: taskTitle || 'Open MDUMENI to see today\'s farming tasks',
      data: { screen: 'Calendar' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

// ── Send immediate sensor alert ───────────────────────────────────────────────
export async function sendSensorAlert(
  field: 'soil_ph' | 'moisture_pct',
  value: number,
  severity: 'critical' | 'warning'
): Promise<void> {
  const messages = {
    soil_ph: {
      critical: `⚠ Soil pH is ${value.toFixed(1)} — critically acidic. Apply lime immediately.`,
      warning:  `Soil pH is ${value.toFixed(1)} — below optimal. Consider lime application.`,
    },
    moisture_pct: {
      critical: `⚠ Soil moisture is ${value}% — too dry. Irrigate immediately if possible.`,
      warning:  `Soil moisture is ${value}% — below recommended level. Monitor closely.`,
    },
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: severity === 'critical' ? '🚨 MDUMENI Alert' : '⚠ MDUMENI Warning',
      body:  messages[field][severity],
      data:  { screen: 'Home', field, value },
    },
    trigger: null, // Send immediately
  });
}

// ── Send harvest approaching notification ─────────────────────────────────────
export async function sendHarvestAlert(
  cropName: string,
  daysToHarvest: number
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌾 Harvest approaching',
      body:  `Your ${cropName} is ${daysToHarvest} days from harvest. Prepare storage and check grain moisture.`,
      data:  { screen: 'Calendar' },
    },
    trigger: null,
  });
}

// ── Check sensor thresholds and alert if needed ───────────────────────────────
export async function checkAndAlertSensorThresholds(
  ph: number | null,
  moisture: number | null
): Promise<void> {
  if (ph !== null) {
    if (ph < 5.0)       await sendSensorAlert('soil_ph', ph, 'critical');
    else if (ph < 5.5)  await sendSensorAlert('soil_ph', ph, 'warning');
  }
  if (moisture !== null) {
    if (moisture < 25)      await sendSensorAlert('moisture_pct', moisture, 'critical');
    else if (moisture < 35) await sendSensorAlert('moisture_pct', moisture, 'warning');
  }
}

// ── Check harvest proximity and alert ─────────────────────────────────────────
export async function checkHarvestAlert(
  cropName: string,
  daysToHarvest: number
): Promise<void> {
  if (daysToHarvest === 14 || daysToHarvest === 7 || daysToHarvest === 3) {
    await sendHarvestAlert(cropName, daysToHarvest);
  }
}
