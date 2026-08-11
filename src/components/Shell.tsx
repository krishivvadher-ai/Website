"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { ChatWidget } from "./chat/ChatWidget";

const TABS = [
  { href: "/browse", label: "Browse", icon: BrowseIcon },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/saved", label: "Saved", icon: SavedIcon },
  { href: "/deadlines", label: "Deadlines", icon: DeadlinesIcon },
  { href: "/you", label: "You", icon: YouIcon },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const isMap = pathname === "/map";

  return (
    <div className="min-h-dvh flex flex-col">
      <DesktopHeader />
      <main className={`flex-1 ${isDesktop === false && !isMap ? "pb-[76px]" : ""}`}>{children}</main>
      {!isMap && <Footer />}
      <ChatWidget />
      {/* The bottom tab bar is not rendered at all on desktop — not just hidden */}
      {isDesktop === false && <MobileTabBar />}
    </div>
  );
}

function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className="hidden lg:block sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/" className="font-display font-bold text-2xl tracking-tight lowercase">
          ontrack
        </Link>
        <nav className="flex items-center gap-6 text-[14px] font-medium" aria-label="Main">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`py-1 border-b-2 transition-colors ${
                pathname.startsWith(t.href) ? "border-ink" : "border-transparent text-grey hover:text-ink"
              }`}
              aria-current={pathname.startsWith(t.href) ? "page" : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <form
          className="ml-auto flex-1 max-w-[360px]"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            router.push(`/browse${q ? `?q=${encodeURIComponent(String(q))}` : ""}`);
          }}
        >
          <label htmlFor="header-search" className="sr-only">
            Search events
          </label>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search events, venues, places"
            className="w-full h-10 px-4 rounded-full border border-line bg-white text-[14px] placeholder:text-grey"
          />
        </form>
        <Link
          href="/organiser"
          className="text-[14px] font-medium text-grey hover:text-ink whitespace-nowrap"
        >
          For organisers
        </Link>
      </div>
    </header>
  );
}

function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-line tabbar-safe"
      aria-label="Main"
    >
      <div className="h-14 grid grid-cols-5">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] ${
                active ? "text-ink" : "text-grey"
              }`}
            >
              <Icon active={active} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-paper mt-16">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display font-bold text-2xl lowercase">ontrack</p>
          <p className="mt-3 text-[14px] text-paper/70 measure">
            One place to find and track things worth doing — Hertfordshire and the London commuter
            belt.
          </p>
        </div>
        <nav className="text-[14px] grid gap-2" aria-label="Footer">
          <Link href="/browse" className="hover:underline">
            Browse events
          </Link>
          <Link href="/map" className="hover:underline">
            Map
          </Link>
          <Link href="/deadlines" className="hover:underline">
            Deadlines
          </Link>
          <Link href="/organiser" className="hover:underline">
            List an event
          </Link>
        </nav>
        <div className="text-[14px] text-paper/70">
          <p>Free for everyone under 25. No paywall, no ads in your feed.</p>
          <p className="mt-2">© {new Date().getFullYear()} onTrack</p>
        </div>
      </div>
    </footer>
  );
}

function BrowseIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill={active ? "currentColor" : "none"} />
      <path d="M9 4v14M15 6v14" stroke={active ? "var(--color-paper)" : "currentColor"} strokeWidth="2" />
    </svg>
  );
}
function SavedIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}
function DeadlinesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill={active ? "currentColor" : "none"} />
      <path d="M3 9h18M8 3v4M16 3v4" stroke={active ? "var(--color-paper)" : "currentColor"} strokeWidth="2" />
    </svg>
  );
}
function YouIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill={active ? "currentColor" : "none"} />
      <path d="M4 21c1.5-4 5-5 8-5s6.5 1 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
