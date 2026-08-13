"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SUGGESTED_QUESTIONS } from "@/lib/helpContent";
import { useIsDesktop } from "@/lib/useMediaQuery";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

// Support chat: a narrow tool with a defined job, not a companion.
// Floating button bottom-right on desktop, above the tab bar on mobile.
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  // Keep the map screen clear on mobile
  if (isDesktop === false && pathname === "/map") return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }, { role: "assistant", text: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            text: next[next.length - 1].text + chunk,
          };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "assistant",
          text: "Something went wrong on our side. Try again, or email the team at onTrack@gmail.com.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  };

  const panelClasses = isDesktop
    ? "fixed bottom-24 right-6 z-50 w-[400px] h-[600px] max-h-[calc(100dvh-8rem)]"
    : "fixed inset-0 z-50";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className={`print-hide fixed z-50 right-4 lg:right-6 ${
          isDesktop === false ? "bottom-[72px]" : "bottom-6"
        } w-14 h-14 rounded-full bg-ink text-signal flex items-center justify-center border-2 border-paper`}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5h16v11H9l-5 4V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className={`${panelClasses} bg-paper border border-line lg:rounded-2xl flex flex-col overflow-hidden`} role="dialog" aria-label="Support chat">
          <header className="bg-ink text-paper px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-[16px]">Help</p>
              <p className="text-[12px] text-paper/70">
                Answers about eligibility, deadlines, refunds and finding things.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Always visible, not revealed after failure */}
              <a
                href="/contact"
                className="pill bg-paper text-ink px-3 py-1.5 whitespace-nowrap"
              >
                Talk to a person
              </a>
              {isDesktop === false && (
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="w-11 h-11 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </header>

          <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div>
                <p className="text-[14px] text-grey">Pick one, or ask your own:</p>
                <div className="mt-3 grid gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="text-left text-[14px] card px-4 py-3 hover:border-ink transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] whitespace-pre-wrap ${
                  m.role === "user" ? "ml-auto bg-ink text-paper" : "bg-white border border-line"
                }`}
              >
                {m.text || <span className="skeleton inline-block w-24 h-3" />}
              </div>
            ))}
          </div>

          <form
            className="p-3 border-t border-line flex gap-2 bg-paper"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about deadlines, refunds, eligibility…"
              className="flex-1 h-11 px-4 rounded-full border border-line bg-white text-[14px]"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="min-w-[44px] h-11 px-4 rounded-full bg-signal text-ink border border-ink font-semibold text-[14px] disabled:opacity-40"
            >
              Send
            </button>
          </form>
          <p className="px-4 pb-3 text-[11px] text-grey bg-paper">
            Chats are logged for quality and deleted within 90 days. Never share personal
            details here.
          </p>
        </div>
      )}
    </>
  );
}
