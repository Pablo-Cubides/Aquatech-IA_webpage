/**
 * Helper ÚNICO de medición de uso (OPS-001). Envía a /api/tools/analytics.
 *
 * Privacidad: sin correo, sin IP, sin texto del usuario. Solo un identificador
 * anónimo aleatorio (localStorage) que permite contar "usuarios que repiten", y
 * se respeta Do Not Track y Global Privacy Control. El país lo añade el servidor
 * a partir de la cabecera de Vercel; el cliente no lo conoce.
 */

import {
  ANALYTICS_SCHEMA_VERSION,
  safeEventData,
  type Portal,
  type ToolEventName,
} from "./events";

const VISITOR_KEY = "aq_vid";
const SESSION_KEY = "aq_sid";
const ENDPOINT = "/api/tools/analytics";

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function storedId(storage: Storage | undefined, key: string): string | undefined {
  try {
    if (!storage) return undefined;
    let id = storage.getItem(key);
    if (!id || !/^[0-9a-f]{32}$/.test(id)) {
      id = randomId();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return undefined; // almacenamiento bloqueado: se envía sin id
  }
}

/** false si el navegador pide no ser rastreado o es un robot de automatización. */
export function isTrackingAllowed(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    doNotTrack?: string | null;
  };
  if (nav.webdriver) return false;
  if (nav.globalPrivacyControl === true) return false;
  const dnt = nav.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt !== "1" && dnt !== "yes";
}

export type ToolEventContext = { portal?: Portal };

export function sendToolEvent(
  tool: string,
  eventName: ToolEventName,
  data?: Record<string, unknown>,
  context: ToolEventContext = {},
): void {
  try {
    if (!isTrackingAllowed()) return;

    const eventData: Record<string, string | number | boolean> = {
      ...safeEventData(data),
      v: ANALYTICS_SCHEMA_VERSION,
      device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
    };
    if (context.portal) eventData.portal = context.portal;
    const vid = storedId(window.localStorage, VISITOR_KEY);
    const sid = storedId(window.sessionStorage, SESSION_KEY);
    if (vid) eventData.vid = vid;
    if (sid) eventData.sid = sid;

    const body = JSON.stringify({ tool, eventName, eventData });

    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Medir nunca debe romper la herramienta.
  }
}
