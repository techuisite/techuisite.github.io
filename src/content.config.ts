import { defineCollection, z } from 'astro:content';
import { blogLoader } from './utils/blog-loader';

// These values are derived by the loader. Authors only write a heading and body.
const blog = defineCollection({
  loader: blogLoader(),
  schema: z.object({
    title: z.string().min(1),
    pubDate: z.coerce.date(),
    link: z.string().url().optional(),
    image: z.string().optional(),
    description: z.string(),
    wordCount: z.number(),
  }),
});
export const collections = { blog };
