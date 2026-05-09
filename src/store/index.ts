// src/store/index.ts
// Zustand global store — single source of truth for all shared app state
// Uses immer-style subscribeWithSelector for targeted re-renders

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  SensorReading,
  FarmerProfile,
  ActiveCrop,
  SessionResponse,
  CalendarAlert,
} from '@/types';

// ── Store shape ───────────────────────────────────────────────────────────────
interface AppState {
  // Network
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;

  // Sensor
  sensorReading: SensorReading | null;
  sensorConnected: boolean;
  sensorDeviceId: string | null;
  setSensorReading: (r: SensorReading) => void;
  setSensorConnected: (connected: boolean, deviceId?: string) => void;

  // Farmer profile (loaded from SQLite on app start)
  profile: FarmerProfile | null;
  setProfile: (p: FarmerProfile) => void;
  updateProfile: (partial: Partial<FarmerProfile>) => void;

  // Active crop
  activeCrop: ActiveCrop | null;
  setActiveCrop: (c: ActiveCrop | null) => void;

  // Session data from /session API
  session: SessionResponse | null;
  sessionLoading: boolean;
  sessionError: string | null;
  lastSessionAt: string | null;
  setSession: (s: SessionResponse) => void;
  setSessionLoading: (v: boolean) => void;
  setSessionError: (e: string | null) => void;

  // Derived — active alerts (from session.daily_calendar.alerts)
  activeAlerts: CalendarAlert[];

  // Onboarding complete?
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;

  // Demo vs real project mode
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;

  // Auth — farmer identity
  authToken:  string | null;
  farmerId:   string | null;
  setAuthToken: (token: string, farmerId: string) => void;
  clearAuth:  () => void;

  // Calendar sub-tab
  calendarTab: 'calendar' | 'advice' | 'pests';
  setCalendarTab: (t: 'calendar' | 'advice' | 'pests') => void;

  // Chat history (in-memory for session — not persisted)
  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;
}

export interface ChatMessage {
  id:        string;
  role:      'user' | 'assistant';
  content:   string;
  timestamp: string;
  farmData?: Record<string, unknown>;  // injected context chips
}

// ── Store implementation ──────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Network
    isOnline: true,
    setIsOnline: (v) => set({ isOnline: v }),

    // Sensor
    sensorReading:   null,
    sensorConnected: false,
    sensorDeviceId:  null,
    setSensorReading: (r) => set({ sensorReading: r }),
    setSensorConnected: (connected, deviceId) =>
      set({ sensorConnected: connected, sensorDeviceId: deviceId ?? null }),

    // Profile
    profile: null,
    setProfile: (p) => set({ profile: p }),
    updateProfile: (partial) =>
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...partial } : null,
      })),

    // Active crop
    activeCrop: null,
    setActiveCrop: (c) => set({ activeCrop: c }),

    // Session
    session:       null,
    sessionLoading: false,
    sessionError:  null,
    lastSessionAt: null,
    setSession: (s) =>
      set({
        session:       s,
        sessionError:  null,
        lastSessionAt: new Date().toISOString(),
        activeAlerts:  s.daily_calendar?.alerts ?? [],
      }),
    setSessionLoading: (v) => set({ sessionLoading: v }),
    setSessionError:   (e) => set({ sessionError: e }),

    // Alerts — derived from session
    activeAlerts: [],

    // Onboarding
    onboardingDone: false,
    setOnboardingDone: (v) => set({ onboardingDone: v }),

    // Demo mode
    isDemoMode: true,
    setDemoMode: (v) => set({ isDemoMode: v }),

    // Auth
    authToken:  null,
    farmerId:   null,
    setAuthToken: (token, farmerId) => set({ authToken: token, farmerId }),
    clearAuth:  () => set({ authToken: null, farmerId: null }),

    // Calendar tab
    calendarTab: 'calendar',
    setCalendarTab: (t) => set({ calendarTab: t }),

    // Chat
    chatMessages: [],
    addChatMessage: (m) =>
      set((state) => ({ chatMessages: [...state.chatMessages, m] })),
    clearChat: () => set({ chatMessages: [] }),
  }))
);

// ── Selector hooks — prevents unnecessary re-renders ─────────────────────────
export const useSensor       = () => useAppStore((s) => s.sensorReading);
export const useProfile      = () => useAppStore((s) => s.profile);
export const useActiveCrop   = () => useAppStore((s) => s.activeCrop);
export const useSession      = () => useAppStore((s) => s.session);
export const useAlerts       = () => useAppStore((s) => s.activeAlerts);
export const useIsOnline     = () => useAppStore((s) => s.isOnline);
export const useCalendarTab  = () => useAppStore((s) => s.calendarTab);
export const useChatMessages = () => useAppStore((s) => s.chatMessages);

// ── Critical alert count — for nav badge ─────────────────────────────────────
export const useCriticalAlertCount = () =>
  useAppStore((s) => s.activeAlerts.filter((a) => a.severity === 'critical').length);
