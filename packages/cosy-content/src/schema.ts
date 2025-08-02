import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

export const makeMetaCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
        }),
    });
};

export const makeLessonCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            authors: z
                .array(
                    z.object({
                        name: z.string(),
                        picture: z.string().optional(),
                    })
                )
                .optional(),
        }),
    });
};

export const makeExperimentCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            pubDate: z.date().optional(),
        }),
    });
};

export const makeCourseCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            folder: z.boolean().optional(),
            authors: z
                .array(
                    z.object({
                        name: z.string(),
                        picture: z.string().optional(),
                        url: z.string().optional(),
                    })
                )
                .optional(),
            date: z.date().optional(),
            order: z.number().optional(),
            badge: z.string().optional(),
            draft: z.boolean().optional(),
            hidden: z.boolean().optional(),
            famous: z.boolean().optional(),
            tags: z.array(z.string()).optional(),
            category: z.string().optional(),
        }),
    });
};

export const makeBlogCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            tags: z.array(z.string()).optional(),
            date: z.date().optional(),
            draft: z.boolean().optional(),
            hidden: z.boolean().optional(),
            famous: z.boolean().optional(),
            authors: z
                .array(
                    z.object({
                        name: z.string(),
                        picture: z.string().optional(),
                        url: z.string().optional(),
                    })
                )
                .optional(),
        }),
    });
};

export const makeManualCollection = (base: string) => {
    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            folder: z.boolean().optional(),
            date: z.date().optional(),
            order: z.number().optional(),
            badge: z.string().optional(),
            draft: z.boolean().optional(),
            hidden: z.boolean().optional(),
            important: z.boolean().optional(),
            tags: z.array(z.string()).optional(),
            category: z.string().optional(),
        }),
    });
};