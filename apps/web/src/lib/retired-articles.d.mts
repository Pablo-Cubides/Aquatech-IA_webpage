export declare const RETIRED_ARTICLES: ReadonlyArray<{ portal: "ia" | "ambiental"; slug: string; to: string }>;
export declare function isRetiredArticle(portal: string, slug: string): boolean;
export declare function retiredArticleRedirects(): Array<{ source: string; destination: string; permanent: boolean }>;
