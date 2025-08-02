import { cosyLogger } from '../cosy.js';
import { SidebarItemEntity, type SidebarProvider } from './SidebarItem.js';
import { LinkUtil } from '../utils/link.js';
import { type CollectionEntry } from 'astro:content';
import { BaseDoc } from './BaseDoc.js';
import { manualRepo, type ManualEntry } from '../repos/ManualRepo.js';

/**
 * 手册文档类，配合 ManualRepo 使用
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
 * - 每个语言（如 zh-cn, en）是一个独立的目录，存放该语言下的所有手册内容
 * - 手册内容按章节组织，支持多级目录结构
 * - 每个章节为一个 markdown 文件，文件名即为 slug
 * - 每个语言目录下可包含 components 和 images 文件夹
 * - 支持多语言手册内容，便于国际化
 * - 手册目录可作为 git 子模块独立管理
 *
 * 相关：
 * - ManualRepo：手册仓库管理类，负责手册文档的增删查改
 * - ManualDoc：手册文档实体类，封装单篇手册内容的相关操作
 *
 * 用法示例：
 * ```typescript
 * import ManualDoc from '../entities/ManualDoc';
 * import { manualRepo } from '../ManualRepo';
 *
 * // 获取所有中文手册内容
 * const manuals = await manualRepo.allManualsByLang('zh-cn');
 *
 * // 获取手册链接
 * const link = manuals[0].getLink();
 * ```
 */
export class ManualDoc extends BaseDoc implements SidebarProvider {
    entry: ManualEntry;

    constructor(entry: ManualEntry) {
        super();
        this.entry = entry;
    }

    static fromEntry(entry: ManualEntry) {
        return new ManualDoc(entry);
    }

    getAncestorIds(): string[] {
        const parts = this.entry.id.split('/');
        return parts
            .slice(0, -1)
            .map((_part: string, index: number) =>
                parts.slice(0, index + 1).join('/')
            );
    }

    getAncestorId(level: number): string {
        const ancestorIds = this.getAncestorIds();

        if (level < 1) {
            cosyLogger.error('Level must be greater than 0');
            throw new Error('Level must be greater than 0');
        }

        if (level >= this.getLevel()) {
            cosyLogger.debug('当前文档的ID：' + this.entry.id);
            cosyLogger.debug('当前文档的Level：' + this.getLevel());
            cosyLogger.debug('正在获取祖先ID，level：' + level);

            throw new Error('Level must be less than the document level');
        }

        if (ancestorIds.length < level) {
            cosyLogger.debug('当前文档的ID\n' + this.entry.id);
            cosyLogger.array('当前文档的祖先IDs', ancestorIds);
            cosyLogger.debug('正在获取祖先ID，level:\n' + level);

            throw new Error('Level must be greater than 0');
        }

        return ancestorIds[level - 1];
    }

    getParentId(): string | null {
        return this.getAncestorId(this.getLevel() - 1);
    }

    getTopDocId(): string {
        const level = this.getLevel();
        if (level <= 2) {
            return this.entry.id;
        }
        return this.getAncestorId(2);
    }

    getSlug(): string {
        return this.getId().split('/').slice(1).join('/');
    }

    getDescription(): string {
        return this.entry.data.description as string;
    }

    getOrder(): number {
        return this.entry.data.order ?? 0;
    }

    async getTopDoc(): Promise<ManualDoc | null> {
        const id = this.getTopDocId();
        const doc = await manualRepo.find(id);
        return doc;
    }

    async getAncestor(level: number): Promise<ManualDoc | null> {
        const debug = false;
        if (debug) {
            cosyLogger.info(`获取 ${this.entry.id} 的祖先文档，level: ${level}`);
        }

        if (level >= this.getLevel()) {
            if (debug) {
                cosyLogger.info(`祖先文档为自身`);
            }
            return this;
        }

        const id = this.getAncestorId(level);
        const doc = await manualRepo.find(id);
        return doc;
    }

    async getChildren(): Promise<ManualDoc[]> {
        const debug = false;
        const children = (await manualRepo.getChildren(this.entry.id)).sort(
            (a, b) => a.getOrder() - b.getOrder()
        );
        if (debug && children.length > 0) {
            cosyLogger.array(
                `${this.entry.id} 的子文档(${children.length})`,
                children.map((child) => `#${child.getOrder()} ${child.entry.id}`)
            );
        }
        return children;
    }

    getBadge(): string {
        return this.entry.data.badge ?? '';
    }

    getCategory(): string {
        return this.entry.data.category ?? '';
    }

    getTags(): string[] {
        return this.entry.data.tags ?? [];
    }

    getLink(): string {
        const debug = false;
        const id = this.getId();
        const lang = id.split('/')[0];
        const manualIdWithoutLang = id === lang ? '' : id.replace(`${lang}/`, '');

        if (debug) {
            cosyLogger.info(`获取手册文档链接，手册文档ID: ${this.entry.id}`);
        }

        return `/${lang}/manuals/${manualIdWithoutLang}`;
    }

    getDate(): Date {
        return new Date(this.entry.data.date as Date);
    }

    getDateForDisplay() {
        try {
            const dateObj = new Date(this.entry.data.date as Date);
            if (isNaN(dateObj.getTime())) {
                console.warn(`Invalid date format: ${this.entry.data.date}`);
                return 'Date unavailable: ' + this.getTitle() + ' ' + this.getLink();
            }
            return dateObj.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error(`Error formatting date: ${this.entry.data.date}`, error);
            return 'Date unavailable';
        }
    }

    async getTopSidebarItem(): Promise<SidebarItemEntity> {
        const topDoc = await this.getTopDoc();
        if (topDoc) {
            return await topDoc.toSidebarItem();
        }
        return new SidebarItemEntity({
            text: this.getTitle(),
            items: [],
            link: this.getLink(),
        });
    }

    hasTag(tag: string): boolean {
        return this.getTags().includes(tag);
    }

    hasBadge(): boolean {
        return this.getBadge() !== '';
    }

    isChapter(): boolean {
        return this.entry.id.split('/').length === 2;
    }

    isDraft(): boolean {
        return this.entry.data.draft ?? false;
    }

    isHidden(): boolean {
        return this.entry.data.hidden ?? false;
    }

    isNotHidden(): boolean {
        return !this.isHidden();
    }

    isFolder(): boolean {
        return this.entry.data.folder ?? false;
    }

    isImportant(): boolean {
        return this.entry.data.important ?? false;
    }

    async toSidebarItem(): Promise<SidebarItemEntity> {
        const debug = false;
        const children = await this.getChildren();
        let childItems = await Promise.all(
            children
                .filter((child) => child.isNotHidden())
                .map((child) => child.toSidebarItem())
        );

        if (this.isChapter()) {
            childItems = [...childItems];
        }

        const sidebarItem = new SidebarItemEntity({
            text: this.getTitle(),
            items: childItems,
            link: this.getLink(),
            badge: this.entry.data.badge,
        });

        if (debug) {
            cosyLogger.info(`${this.entry.id} 转换成侧边栏项目`);
            console.log(sidebarItem);
        }

        return sidebarItem;
    }
} 