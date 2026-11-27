import { defineCollection, reference, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAGS } from './tags';

const articleFields = (image: SchemaContext['image']) => ({
	title: z.string(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	tags: z.array(z.enum(TAGS)),
	thumbnail: image().optional(),
	draft: z.boolean().default(false),
});

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '*/index.{md,mdx}' }),
	schema: ({ image }) => z.object(articleFields(image)),
});

const reviews = defineCollection({
	loader: glob({ base: './src/content/reviews', pattern: '*/index.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			...articleFields(image),
			shelf: reference('shelf'),
		}),
});

const shelfCommon = (image: SchemaContext['image']) => ({
	title: z.string(),
	image: image(),
	finishedAt: z.coerce.date(),
	rating: z.number().int().min(1).max(5),
	recommendFor: z.string(),
	notFor: z.string(),
	link: z.url(),
});

const shelf = defineCollection({
	loader: glob({ base: './src/content/shelf', pattern: '*.yaml' }),
	schema: ({ image }) =>
		z.discriminatedUnion('type', [
			z.object({
				...shelfCommon(image),
				type: z.literal('course'),
				platform: z.string(),
				instructor: z.string(),
				hours: z.number().positive(),
			}),
			z.object({
				...shelfCommon(image),
				type: z.literal('book'),
				author: z.string(),
			}),
		]),
});

export const collections = { posts, reviews, shelf };
