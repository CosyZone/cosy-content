import { StoryDoc } from '../entities/StoryDoc.js';
import { getCollection, type CollectionEntry } from 'astro:content';
import { BaseDB } from './BaseRepo.js';

export const COLLECTION_STORY = 'stories' as const;
export type StoryEntry = CollectionEntry<typeof COLLECTION_STORY>;

/**
 * 故事数据库类，用于管理故事内容集合。
 *
 * 目录结构：
 * ```
 * stories/
 * ├── zh-cn/                  # 中文版本
 * │   ├── web-development/    # 故事1
 * │   │   ├── index.md        # 故事文档
 * │   │   ├── chapter1
 * │   │   │   ├── index.md
 * │   │   │   ├── content.md
 * │   │   │   └── ...
 * │   │   └── chapter2
 * │   │       ├── index.md
 * │   │       ├── content.md
 * │   │       └── ...
 * │   └── mobile-dev/        # 故事2
 * │       ├── index.md
 * │       └── ...
 * └── en/                    # 英文版本
 *     └── ...
 * ```
 * 
 * 说明：
 * - 如果希望单个故事可以作为 git 项目管理，考虑使用 LessonRepo 代替 StoryRepo
 */
class StoryRepo extends BaseDB<
    typeof COLLECTION_STORY,
    StoryEntry,
    StoryDoc
> {
    protected collectionName = COLLECTION_STORY;

    protected createDoc(entry: StoryEntry): StoryDoc {
        return new StoryDoc(entry);
    }

    /**
     * 获取指定语言的所有顶级故事，适用于在索引页面展示故事列表的情况
     *
     * @param lang - 语言代码
     * @returns 返回指定语言的顶级故事数组
     */
    async allStoriesByLang(lang: string): Promise<StoryDoc[]> {
        return (await getCollection(COLLECTION_STORY, ({ id }: { id: string }) => {
            return id.startsWith(lang) && id.split('/').length === 2;
        })).map((entry: StoryEntry) => new StoryDoc(entry));
    }

    /**
     * 获取用于 Astro 静态路由生成的路径参数，专门配合 [lang]/stories/[...slug].astro 使用
     *
     * @returns 返回路径参数数组
     */
    async getStaticPaths() {
        const entries = await getCollection(COLLECTION_STORY);
        return entries.map((entry: StoryEntry) => {
            const doc = new StoryDoc(entry);
            const slug = doc.getSlug();
            return {
                params: {
                    lang: doc.getLang(),
                    // 当 slug 为空字符串时，设置为 undefined 以符合 Astro 可选参数的要求
                    ...(slug ? { slug } : {}),
                },
            };
        });
    }

    /**
     * 获取精选故事
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @param count - 返回的故事数量（默认4个）
     * @returns 返回精选故事文档数组
     */
    async getFamousStories(lang: string, count: number = 4): Promise<StoryDoc[]> {
        return (await this.allStoriesByLang(lang))
            .filter((story) => story.isFamous())
            .slice(0, count);
    }

    /**
     * 获取指定语言的故事，并根据标签过滤
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @param tag - 标签
     * @returns 返回符合条件的故事文档数组
     */
    async getStoriesWithTag(lang: string, tag: string): Promise<StoryDoc[]> {
        return (await this.allStoriesByLang(lang))
            .filter((story) => story.hasTag(tag));
    }
}

// 创建并导出单例实例
export const storyRepo = new StoryRepo(); 