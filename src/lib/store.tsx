"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AttendedEntry, AuditEntry, Booking, ConcernReport, Profile, ReminderPrefs } from "./types";

export interface PendingListing {
  id: string;
  title: string;
  description: string;
  category: string;
  intent: string;
  suggestedAgeBand: string;
  deadline?: string;
  status: "pending";
  /** who reviewed it, when, and what changed — the provider-content evidence
      trail. TODO: persist server-side; local state is demo-only. */
  audit: AuditEntry[];
}

interface AppState {
  ready: boolean;
  profile: Profile;
  setProfile: (p: Profile) => void;
  saved: string[];
  toggleSaved: (eventId: string) => void;
  isSaved: (eventId: string) => boolean;
  reminders: Record<string, ReminderPrefs>;
  setReminder: (eventId: string, prefs: ReminderPrefs | null) => void;
  attended: Record<string, AttendedEntry>;
  setAttended: (eventId: string, entry: AttendedEntry | null) => void;
  bookings: Record<string, Booking>;
  book: (eventId: string, places: number) => Booking;
  cancelBooking: (eventId: string) => void;
  reports: ConcernReport[];
  addReport: (r: Omit<ConcernReport, "id" | "submittedAt">) => void;
  pendingListings: PendingListing[];
  addPendingListing: (l: Omit<PendingListing, "id" | "status" | "audit">) => void;
  organiserSignedIn: boolean;
  setOrganiserSignedIn: (v: boolean) => void;
  schoolSignedIn: boolean;
  setSchoolSignedIn: (v: boolean) => void;
  /** events a school staff member has featured for their students */
  schoolPicks: string[];
  toggleSchoolPick: (eventId: string) => void;
  /** the whole local state as JSON — powers "download my data" */
  exportData: () => string;
  /** wipe everything this device knows — powers "delete my account" */
  deleteAllData: () => void;
}

const DEFAULT_PROFILE: Profile = { showIneligible: false };

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "ontrack.v1";

interface Persisted {
  profile: Profile;
  saved: string[];
  reminders: Record<string, ReminderPrefs>;
  attended: Record<string, AttendedEntry>;
  bookings: Record<string, Booking>;
  reports: ConcernReport[];
  pendingListings: PendingListing[];
  organiserSignedIn: boolean;
  schoolSignedIn: boolean;
  schoolPicks: string[];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Record<string, ReminderPrefs>>({});
  const [attended, setAttendedState] = useState<Record<string, AttendedEntry>>({});
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [reports, setReports] = useState<ConcernReport[]>([]);
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [organiserSignedIn, setOrganiserSignedIn] = useState(false);
  const [schoolSignedIn, setSchoolSignedIn] = useState(false);
  const [schoolPicks, setSchoolPicks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Partial<Persisted>;
        if (data.profile) setProfileState({ ...DEFAULT_PROFILE, ...data.profile });
        if (Array.isArray(data.saved)) setSaved(data.saved);
        if (data.reminders) setReminders(data.reminders);
        if (data.attended) setAttendedState(data.attended);
        if (data.bookings) setBookings(data.bookings);
        if (Array.isArray(data.reports)) setReports(data.reports);
        if (Array.isArray(data.pendingListings)) setPendingListings(data.pendingListings);
        if (data.organiserSignedIn) setOrganiserSignedIn(true);
        if (data.schoolSignedIn) setSchoolSignedIn(true);
        if (Array.isArray(data.schoolPicks)) setSchoolPicks(data.schoolPicks);
      }
    } catch {
      // corrupted storage — start fresh rather than crash
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const data: Persisted = { profile, saved, reminders, attended, bookings, reports, pendingListings, organiserSignedIn, schoolSignedIn, schoolPicks };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — the app still works, it just forgets
    }
  }, [ready, profile, saved, reminders, attended, bookings, reports, pendingListings, organiserSignedIn, schoolSignedIn, schoolPicks]);

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
  const setAttended = useCallback((id: string, entry: AttendedEntry | null) => {
    setAttendedState((prev) => {
      const next = { ...prev };
      if (entry === null) delete next[id];
      else next[id] = entry;
      return next;
    });
  }, []);
  const book = useCallback((eventId: string, places: number): Booking => {
    // Reference is derived, not random-random, so it stays stable-looking in
    // a demo: OT- plus base36 of time and event id
    const ref = `OT-${(Date.now() % 46655).toString(36).toUpperCase().padStart(3, "0")}${eventId.slice(-2).toUpperCase()}${places}`;
    const booking: Booking = { ref, places, bookedAt: new Date().toISOString() };
    setBookings((prev) => ({ ...prev, [eventId]: booking }));
    // A booked event is a saved event — its deadline and date belong in the
    // Deadlines tab
    setSaved((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
    return booking;
  }, []);
  const cancelBooking = useCallback((eventId: string) => {
    setBookings((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  }, []);
  const addReport = useCallback((r: Omit<ConcernReport, "id" | "submittedAt">) => {
    setReports((prev) => [
      ...prev,
      { ...r, id: `rep_${prev.length + 1}_${new Date().getTime().toString(36)}`, submittedAt: new Date().toISOString() },
    ]);
  }, []);
  const addPendingListing = useCallback((l: Omit<PendingListing, "id" | "status" | "audit">) => {
    setPendingListings((prev) => [
      ...prev,
      {
        ...l,
        id: `lst_${prev.length + 1}_${new Date().getTime().toString(36)}`,
        status: "pending",
        audit: [
          {
            at: new Date().toISOString(),
            by: "demo organiser",
            action: "submitted",
            detail: "Awaiting onTrack editorial review before publication",
          },
        ],
      },
    ]);
  }, []);

  const exportData = useCallback(() => {
    const data: Persisted = { profile, saved, reminders, attended, bookings, reports, pendingListings, organiserSignedIn, schoolSignedIn, schoolPicks };
    return JSON.stringify(data, null, 2);
  }, [profile, saved, reminders, attended, bookings, reports, pendingListings, organiserSignedIn, schoolSignedIn, schoolPicks]);

  const toggleSchoolPick = useCallback((id: string) => {
    setSchoolPicks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const deleteAllData = useCallback(() => {
    setProfileState(DEFAULT_PROFILE);
    setSaved([]);
    setReminders({});
    setAttendedState({});
    setBookings({});
    setReports([]);
    setPendingListings([]);
    setOrganiserSignedIn(false);
    setSchoolSignedIn(false);
    setSchoolPicks([]);
    try {
      // Clear everything onTrack has ever put on this device, including the
      // age-gate flag — deletion means deletion.
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith("ontrack."))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // storage unavailable — in-memory state is already cleared
    }
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
      attended,
      setAttended,
      bookings,
      book,
      cancelBooking,
      reports,
      addReport,
      pendingListings,
      addPendingListing,
      organiserSignedIn,
      setOrganiserSignedIn,
      schoolSignedIn,
      setSchoolSignedIn,
      schoolPicks,
      toggleSchoolPick,
      exportData,
      deleteAllData,
    }),
    [
      ready,
      profile,
      setProfile,
      saved,
      toggleSaved,
      isSaved,
      reminders,
      setReminder,
      attended,
      setAttended,
      bookings,
      book,
      cancelBooking,
      reports,
      addReport,
      pendingListings,
      addPendingListing,
      organiserSignedIn,
      schoolSignedIn,
      schoolPicks,
      toggleSchoolPick,
      exportData,
      deleteAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
