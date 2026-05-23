import { z } from "zod";

export const imageManifestSchema = z.object({
  model: z
    .string()
    .min(1, "model cannot be empty")
    .describe("AI model used to generate the image (e.g., 'dall-e-3', 'stable-diffusion-xl')"),

  prompt: z
    .string()
    .min(10, "prompt must be at least 10 characters — include the full prompt used")
    .describe("Exact prompt used to generate the image"),

  generatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "generatedAt must be ISO 8601: YYYY-MM-DD")
    .describe("Date the image was generated"),

  platform: z
    .string()
    .min(1, "platform cannot be empty")
    .describe("Platform/editor used (e.g., 'Claude Code', 'VS Code + Copilot', 'ChatGPT Plus', 'Antigravity')"),

  license: z
    .enum([
      "ai-generated-no-commercial-restriction",
      "cc0",
      "pexels-free",
      "original-copyright",
      "stock-licensed",
    ])
    .describe("License for this asset"),

  cloudinaryUrl: z
    .string()
    .url("cloudinaryUrl must be a valid Cloudinary URL")
    .startsWith("https://res.cloudinary.com/", "cloudinaryUrl must be a Cloudinary URL")
    .optional()
    .describe("Full Cloudinary URL after upload (empty until uploaded)"),

  altText: z
    .string()
    .min(10, "altText must be descriptive — at least 10 characters")
    .max(125, "altText must not exceed 125 characters (screen reader best practice)")
    .describe("Descriptive alt text in Spanish for accessibility"),

  attribution: z
    .string()
    .optional()
    .describe("Attribution text if required by license"),
});

export type ImageManifest = z.infer<typeof imageManifestSchema>;
