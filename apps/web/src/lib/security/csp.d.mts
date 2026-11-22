export declare const NONCE_CSP_PATH: RegExp;
export declare const STATIC_CSP_SOURCE: string;
export declare function buildContentSecurityPolicy(options?: { nonce?: string; isDev?: boolean }): string;
