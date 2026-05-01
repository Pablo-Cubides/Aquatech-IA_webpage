/**
 * Schema for AI-generated image manifests.
 * Canonical version: docs/contracts/image-manifest.zod.ts
 * Constitution §7.4: every AI-generated image needs a .image-manifest.json
 */

import { z } from "zod";

export const imageManifestSchema = z.object({
  model: z.string().min(1),
  prompt: z.string().min(10),
  generatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  platform: z.string().min(1),
  license: z.enum([
    "ai-generated-no-commercial-restriction",
    "cc0",
    "pexels-free",
    "original-copyright",
    "stock-licensed",
  ]),
  cloudinaryUrl: z
    .string()
    .url()
    .startsWith("https://res.cloudinary.com/")
    .optional(),
  altText: z.string().min(10).max(125),
  attribution: z.string().optional(),
});

export type ImageManifest = z.infer<typeof imageManifestSchema>;
