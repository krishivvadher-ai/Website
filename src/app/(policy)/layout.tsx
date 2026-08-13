import React from "react";

// Quiet shared layout for policy pages: left-aligned, prose capped at 65
// characters, no decoration. The content is the design.
export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 lg:py-16">
      <div className="[&_p]:max-w-[65ch] [&_li]:max-w-[65ch] [&_td]:align-top">{children}</div>
    </div>
  );
}
