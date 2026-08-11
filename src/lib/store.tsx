"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Profile, ReminderPrefs } from "./types";

interface AppState {
  ready: boolean;
  profile: Profile;
  setProfile: (p: Profile) => void;
  saved: string[];
  toggleSaved: (eventId: string) => void;
  isSaved: (eventId: string) => boolean;
  reminders: Record<string, ReminderPrefs>;
  setReminder: (eventId: string, prefs: ReminderPrefs | null) => void;
  organiserSignedIn: boolean;
  setOrganiserSignedIn: (v: boolean) => void;
}

const DEFAULT_PROFILE: Profile = { showIneligible: false };

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "ontrack.v1";

interface Persisted {
  profile: Profile;
  saved: string[];
  reminders: Record<string, ReminderPrefs>;
  organiserSignedIn: boolean;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Record<string, ReminderPrefs>>({});
  const [organiserSignedIn, setOrganiserSignedIn] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Partial<Persisted>;
        if (data.profile) setProfileState({ ...DEFAULT_PROFILE, ...data.profile });
        if (Array.isArray(data.saved)) setSaved(data.saved);
        if (data.reminders) setReminders(data.reminders);
        if (data.organiserSignedIn) setOrganiserSignedIn(true);
      }
    } catch {
      // corrupted storage — start fresh rather than crash
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const data: Persisted = { profile, saved, reminders, organiserSignedIn };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — the app still works, it just forgets
    }
  }, [ready, profile, saved, reminders, organiserSignedIn]);

  const setProfile = useCallback((p: Profile) => setProfileState(p), []);
  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);
  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);
  const setReminder = useCallback((id: string, prefs: ReminderPrefs | null) => {
    setReminders((prev) => {
      const next = { ...prev };
      if (prefs === null) delete next[id];
      else next[id] = prefs;
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      profile,
      setProfile,
      saved,
      toggleSaved,
      isSaved,
      reminders,
      setReminder,
      organiserSignedIn,
      setOrganiserSignedIn,
    }),
    [ready, profile, setProfile, saved, toggleSaved, isSaved, reminders, setReminder, organiserSignedIn]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
