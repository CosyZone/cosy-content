import { ManualDoc } from '../entities/ManualDoc.js';
import { getCollection, type CollectionEntry } from 'astro:content';
import { BaseDB } from './BaseRepo.js';

export const COLLECTION_MANUAL = 'manuals' as const;
export type ManualEntry = CollectionEntry<typeof COLLECTION_MANUAL>;

/**
 * 手册数据库类，用于管理手册内容集合。
 *
 * 目录结构：
 * ```
 * manuals/
 * ├── zh-cn/                  # 中文版本
 * │   ├── index.md            # 手册首页
 * │   ├── getting-started.md  # 快速开始
 * │   ├── installation.md     # 安装指南
 * │   ├── configuration.md    # 配置说明
 * │   ├── advanced/           # 高级主题
 * │   │   ├── index.md
 * │   │   ├── optimization.md
 * │   │   └── troubleshooting.md
 * │   ├── api/                # API 文档
 * │   │   ├── index.md
 * │   │   ├── authentication.md
 * │   │   └── endpoints.md
 * │   ├── examples/           # 示例代码
 * │   │   ├── index.md
 * │   │   ├── basic-usage.md
 * │   │   └── advanced-usage.md
 * │   ├── components/         # 可复用组件
 * │   │   ├── CodeDemo.vue
 * │   │   └── ApiTable.vue
 * │   └── images/            # 手册相关图片
 * │       ├── logo.png
 * │       └── screenshots/
 * └── en/                    # 英文版本
 *     └── ... (同中文结构)
 * ```
 * 
 * 说明：
 * - 手册文档适合展示成体系的文档，如产品用户手册、技术框架文档等
 * - 每个语言目录下只有一个完整的手册，按章节组织
 * - 支持多级目录结构，便于组织复杂的文档内容
 * - 手册目录可作为 git 子模块独立管理
 */
class ManualRepo extends BaseDB<
    typeof COLLECTION_MANUAL,
    ManualEntry,
    ManualDoc
> {
    protected collectionName = COLLECTION_MANUAL;

    protected createDoc(entry: ManualEntry): ManualDoc {
        return new ManualDoc(entry);
    }

    /**
     * 获取指定语言的所有顶级章节，适用于在索引页面展示章节列表的情况
     *
     * @param lang - 语言代码
     * @returns 返回指定语言的顶级章节数组
     */
    async allManualsByLang(lang: string): Promise<ManualDoc[]> {
        return (await getCollection(COLLECTION_MANUAL, ({ id }: { id: string }) => {
            return id.startsWith(lang) && id.split('/').length === 2;
        })).map((entry: ManualEntry) => new ManualDoc(entry));
    }

    /**
     * 获取用于 Astro 静态路由生成的路径参数，专门配合 [lang]/manuals/[...slug].astro 使用
     *
     * @returns 返回路径参数数组
     */
    async getStaticPaths() {
        const entries = await getCollection(COLLECTION_MANUAL);
        return entries.map((entry: ManualEntry) => {
            const doc = new ManualDoc(entry);
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
     * 获取重要章节
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @param count - 返回的章节数量（默认4个）
     * @returns 返回重要章节文档数组
     */
    async getImportantManuals(lang: string, count: number = 4): Promise<ManualDoc[]> {
        return (await this.allManualsByLang(lang))
            .filter((manual) => manual.isImportant())
            .slice(0, count);
    }

    /**
     * 获取指定语言的手册内容，并根据标签过滤
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @param tag - 标签
     * @returns 返回符合条件的手册文档数组
     */
    async getManualsWithTag(lang: string, tag: string): Promise<ManualDoc[]> {
        return (await this.allManualsByLang(lang))
            .filter((manual) => manual.hasTag(tag));
    }

    /**
     * 获取指定语言的手册内容，并根据分类过滤
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @param category - 分类
     * @returns 返回符合条件的手册文档数组
     */
    async getManualsByCategory(lang: string, category: string): Promise<ManualDoc[]> {
        return (await this.allManualsByLang(lang))
            .filter((manual) => manual.getCategory() === category);
    }

    /**
     * 获取手册的完整目录结构
     *
     * @param lang - 语言代码（如 'zh-cn', 'en'）
     * @returns 返回手册的完整目录结构
     */
    async getManualStructure(lang: string): Promise<ManualDoc[]> {
        const allManuals = await getCollection(COLLECTION_MANUAL, ({ id }: { id: string }) => {
            return id.startsWith(lang);
        });

        return allManuals
            .map((entry: ManualEntry) => new ManualDoc(entry))
            .sort((a: ManualDoc, b: ManualDoc) => a.getOrder() - b.getOrder());
    }
}

// 创建并导出单例实例
export const manualRepo = new ManualRepo(); 