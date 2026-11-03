"use client";
// Interactive grade lookup, file selection or accessible detail disclosure.
import { useId, useState, useRef } from "react";
import { Info } from "lucide-react";
export default function GradeDetail({
  title,
  comment,
}: {
  title: string;
  comment: string;
}) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          buttonRef.current?.focus();
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Ver detalle de ${title}`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-cyan-200 transition hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
      >
        <Info aria-hidden="true" className="h-5 w-5" />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          tabIndex={0}
          className="absolute bottom-full right-0 z-50 mb-2 block max-h-72 w-[min(85vw,32rem)] overflow-y-auto rounded-xl border border-cyan-100/25 bg-slate-950 p-4 text-left text-sm font-normal leading-relaxed text-slate-100 shadow-xl outline-offset-2"
        >
          <span className="mb-2 block font-semibold text-cyan-100">
            {title}
          </span>
          <span className="whitespace-pre-wrap">{comment}</span>
        </span>
      ) : null}
    </span>
  );
}
