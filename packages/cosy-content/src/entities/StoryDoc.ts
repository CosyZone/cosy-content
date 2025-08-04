import { cosyLogger } from '../cosy.js';
import { SidebarItemEntity, type SidebarProvider } from './SidebarItem.js';
import { LinkUtil } from '../utils/link.js';
import { type CollectionEntry } from 'astro:content';
import { BaseDoc } from './BaseDoc.js';
import { storyRepo, type StoryEntry } from '../repos/StoryRepo.js';

/**
 * 故事文档类，配合 StoryRepo 使用
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
 */
export class StoryDoc extends BaseDoc implements SidebarProvider {
    entry: StoryEntry;

    constructor(entry: StoryEntry) {
        super();
        this.entry = entry;
    }

    static fromEntry(entry: StoryEntry) {
        return new StoryDoc(entry);
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

    async getTopDoc(): Promise<StoryDoc | null> {
        const id = this.getTopDocId();
        const doc = await storyRepo.find(id);
        return doc;
    }

    async getAncestor(level: number): Promise<StoryDoc | null> {
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
        const doc = await storyRepo.find(id);
        return doc;
    }

    async getChildren(): Promise<StoryDoc[]> {
        const debug = false;
        const children = (await storyRepo.getChildren(this.entry.id)).sort(
            (a, b) => {
                // 优先使用 order 值进行排序
                const orderA = a.getOrder();
                const orderB = b.getOrder();

                // 如果两个都有 order 值，按 order 排序
                if (orderA !== 0 && orderB !== 0) {
                    return orderA - orderB;
                }

                // 如果只有一个有 order 值，有 order 的排在前面
                if (orderA !== 0 && orderB === 0) {
                    return -1;
                }
                if (orderA === 0 && orderB !== 0) {
                    return 1;
                }

                // 如果都没有 order 值，按 id 排序
                return a.getId().localeCompare(b.getId());
            }
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
        const lang = this.getLang();
        const slug = this.getSlug();

        return LinkUtil.createUrl(`/${lang}/stories/${slug}`);
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

    isBook(): boolean {
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

    isFamous(): boolean {
        return this.entry.data.famous ?? false;
    }

    async toSidebarItem(): Promise<SidebarItemEntity> {
        const debug = false;
        const children = await this.getChildren();
        let childItems = await Promise.all(
            children
                .filter((child) => child.isNotHidden())
                .map((child) => child.toSidebarItem())
        );

        if (this.isBook()) {
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