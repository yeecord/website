import { z } from "zod";

export type PageFrontMatter = z.infer<typeof PageFrontMatterSchema>;

/**
 * Common properties allowed for all pages
 *
 * All properties are optional
 */
export const PageFrontMatterSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
});
