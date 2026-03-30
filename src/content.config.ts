import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.string(),
		pubDate: z.string().optional(), // ISO date for sorting: "2026-03-27"
		author: z.string(),
		image: z.string().optional(),
	}),
});

export const collections = { blog };
