import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// 导出基础 schema 供用户扩展使用
export const storyBaseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    folder: z.boolean().optional(),
    date: z.date().optional(),
    order: z.number().optional(),
    badge: z.string().optional(),
    draft: z.boolean().optional(),
    hidden: z.boolean().optional(),
});

export const courseBaseSchema = z.object({
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
});

export const blogBaseSchema = z.object({
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
});

export const manualBaseSchema = z.object({
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
});

export const productBaseSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    badge: z.string().optional(),
    date: z.date().optional(),
    draft: z.boolean().optional(),
    hidden: z.boolean().optional(),
    famous: z.boolean().optional(),
});

export const metaBaseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
});

export const lessonBaseSchema = z.object({
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
});

export const experimentBaseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.date().optional(),
    order: z.number().optional(),
    badge: z.string().optional(),
    draft: z.boolean().optional(),
    hidden: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export const makeMetaCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? metaBaseSchema.extend(customFields)
        : metaBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeLessonCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? lessonBaseSchema.extend(customFields)
        : lessonBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeExperimentCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? experimentBaseSchema.extend(customFields)
        : experimentBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeCourseCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? courseBaseSchema.extend(customFields)
        : courseBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeBlogCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? blogBaseSchema.extend(customFields)
        : blogBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeManualCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? manualBaseSchema.extend(customFields)
        : manualBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeStoryCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? storyBaseSchema.extend(customFields)
        : storyBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};

export const makeProductCollection = (base: string, customFields?: z.ZodRawShape) => {
    const schema = customFields
        ? productBaseSchema.extend(customFields)
        : productBaseSchema;

    return defineCollection({
        loader: glob({
            pattern: '**/*.{md,mdx}',
            base,
        }),
        schema,
    });
};