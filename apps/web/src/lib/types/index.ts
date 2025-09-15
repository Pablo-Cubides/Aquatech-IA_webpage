/**
 * Tipos para el sistema de herramientas
 */

export interface Tool {
  slug: string;
  name: string;
  description: string;
  image?: string;
  icon?: string;
  type: "public" | "private";
  url: string;
  owner: string;
  version: string;
  status: "stable" | "beta" | "deprecated";
  portal: "ia" | "ambiental";
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * Tipos para autenticación y perfil de usuario
 */

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  username?: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  interests: string[];
  goals?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipos para cursos
 */

export interface Course {
  id: string;
  title: string;
  platform: string;
  url: string;
  badge?: "new" | "popular";
  portal: "ia" | "ambiental";
}

/**
 * Tipos para analítica
 */

export type AnalyticsEvent =
  | "tool_opened"
  | "tool_ready"
  | "tool_error"
  | "auth_login"
  | "auth_register"
  | "profile_saved";

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  data?: Record<string, any>;
  timestamp: Date;
}

/**
 * Tipos para mensajes postMessage iframe
 */

export interface IframeMessage {
  type: "ready" | "resize" | "error" | "ping";
  data?: {
    height?: number;
    message?: string;
  };
}

/**
 * Estados de UI comunes
 */

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface UIState {
  loading: LoadingState;
  error?: string;
}
