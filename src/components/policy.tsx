import React from "react";

export function PolicyHeader({
  title,
  lastUpdated,
  toc,
}: {
  title: string;
  lastUpdated: string;
  toc: { id: string; label: string }[];
}) {
  return (
    <header>
      <h1 className="text-[28px] lg:text-[40px]">{title}</h1>
      <p className="mt-2 text-[13px] text-grey">Last updated: {lastUpdated}</p>
      <nav aria-label="On this page" className="card mt-6 p-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-grey">
          On this page
        </h2>
        <ol className="mt-2 space-y-1 text-[14px]">
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="underline hover:text-grey">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}

export function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-[22px]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
        {children}
      </div>
    </section>
  );
}

export function PolicyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="card p-5 bg-white border-ink">
      <div className="text-[15px] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
