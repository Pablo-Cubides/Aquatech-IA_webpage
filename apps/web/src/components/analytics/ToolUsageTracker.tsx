"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TOOL_EVENTS, parseToolPath } from "@/lib/analytics/events";
import { sendToolEvent } from "@/lib/analytics/track";

const INTERACTION_INTERVAL_MS = 60_000;
const MAX_ERRORS_PER_VIEW = 3;
const EXPORT_WORDS =
  /exportar|descargar|export|download|guardar|\.(csv|pdf|png|xlsx|json|gif|jpe?g|svg|txt)\b/i;
const FORMAT = /\b(csv|pdf|png|xlsx|excel|json|gif|jpe?g|svg|txt)\b/i;

function sizeBucket(bytes: number): string {
  if (bytes < 100 * 1024) return "<100KB";
  if (bytes < 1024 * 1024) return "100KB-1MB";
  if (bytes < 10 * 1024 * 1024) return "1-10MB";
  return ">10MB";
}

/**
 * Mide el uso de las 12 herramientas públicas sin tocar cada una: visita al montar
 * y, mientras la página sigue abierta, interacciones, subidas de archivo,
 * exportaciones y errores. Solo registra METADATOS (extensión, tamaño en rangos,
 * nombre del error): nunca el contenido de un campo ni de un archivo.
 */
export function ToolUsageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const parsed = parseToolPath(pathname);
    if (!parsed) return;
    const { portal, tool } = parsed;
    const context = { portal };

    sendToolEvent(tool, TOOL_EVENTS.VIEW, undefined, context);

    let lastInteraction = 0;
    let errors = 0;

    const interact = () => {
      const now = Date.now();
      if (now - lastInteraction < INTERACTION_INTERVAL_MS) return;
      lastInteraction = now;
      sendToolEvent(tool, TOOL_EVENTS.INTERACTION, undefined, context);
    };

    const inChrome = (el: Element) =>
      Boolean(el.closest("header, nav, footer, [data-analytics-ignore]"));

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest(
        "button, a, [role='button'], summary, label, input, select",
      );
      if (!control || inChrome(control)) return;

      const text =
        (control.textContent ?? "").slice(0, 80) + " " + (control.getAttribute("download") ?? "");
      if (control.hasAttribute("download") || EXPORT_WORDS.test(text)) {
        const format = FORMAT.exec(text)?.[1]?.toLowerCase();
        sendToolEvent(tool, TOOL_EVENTS.EXPORT, format ? { format } : undefined, context);
      }
      interact();
    };

    const onChange = (event: Event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        )
      )
        return;
      if (inChrome(target)) return;

      if (target instanceof HTMLInputElement && target.type === "file") {
        const file = target.files?.[0];
        if (file) {
          const ext = file.name.includes(".")
            ? file.name.split(".").pop()!.toLowerCase().slice(0, 8)
            : "none";
          sendToolEvent(
            tool,
            TOOL_EVENTS.FILE_UPLOAD,
            { ext, size: sizeBucket(file.size), files: target.files?.length ?? 1 },
            context,
          );
        }
      }
      interact();
    };

    const onError = (event: ErrorEvent) => {
      if (errors++ >= MAX_ERRORS_PER_VIEW) return;
      const name = event.error instanceof Error ? event.error.name : "Error";
      sendToolEvent(tool, TOOL_EVENTS.ERROR, { kind: "window_error", name }, context);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (errors++ >= MAX_ERRORS_PER_VIEW) return;
      const name = event.reason instanceof Error ? event.reason.name : "UnhandledRejection";
      sendToolEvent(tool, TOOL_EVENTS.ERROR, { kind: "unhandled_rejection", name }, context);
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("change", onChange, { capture: true, passive: true });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("change", onChange, { capture: true });
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [pathname]);

  return null;
}
