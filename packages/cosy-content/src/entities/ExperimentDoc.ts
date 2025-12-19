import type { ExperimentEntry } from '../repos/ExperimentRepo.js';
import { experimentRepo } from '../repos/ExperimentRepo.js';
import { cosyLogger } from '../cosy.js';
import { SidebarItemEntity, type SidebarProvider } from './SidebarItem.js';
import { LinkUtil } from '../utils/link.js';
import type { IHeadingType } from '../types/heading.js';
import { BaseDoc } from './BaseDoc.js';

/**
 * 实验文档类，配合 ExperimentRepo 使用
 *
 * 目录结构：
 * ```
 * experiments/
 * ├── safari_itp/              # 实验1
 * │   ├── en/                  # 英文版本
 * │   │   ├── index.mdx        # 实验文档
 * │   │   ├── 1.mdx
 * │   │   ├── 2.mdx
 * │   │   └── 3.mdx
 * │   └── zh-cn/               # 中文版本
 * │       ├── index.mdx
 * │       ├── 1.mdx
 * │       ├── 2.mdx
 * │       └── 3.mdx
 * └── ...                      # 其他实验
 * ```
 */
export class ExperimentDoc extends BaseDoc implements SidebarProvider {
  entry: ExperimentEntry;

  constructor(entry: ExperimentEntry) {
    super();
    this.entry = entry;
  }

  isBook(): boolean {
    return this.entry.id.split('/').length === 2;
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

  override getLang(): string {
    const debug = false;
    const parts = this.entry.id.split('/');
    const lang = parts[1];
    if (debug) {
      cosyLogger.info(`获取 ${this.entry.id} 的语言: ${lang}`);
    }
    return lang;
  }

  getSlug(): string {
    const parts = this.getId().split('/');
    // 对于 experiments，ID 格式是 circle-math-tour/zh-cn 或 circle-math-tour/zh-cn/1
    // lang 在 parts[1]，slug 应该是去掉 lang 后的部分（parts[0] + parts.slice(2)）
    return [parts[0], ...parts.slice(2)].filter(Boolean).join('/');
  }

  getDescription(): string {
    return this.entry.data.description as string;
  }

  async getBookId(): Promise<string> {
    return this.getTopDocId();
  }

  async getBook(): Promise<ExperimentDoc | null> {
    const bookId = await this.getBookId();
    return await experimentRepo.find(bookId);
  }

  getLink(): string {
    const lang = this.getLang();
    const slug = this.getSlug();

    return LinkUtil.createUrl(`/${lang}/experiments/${slug}`);
  }

  getHTML(): string {
    const debug = false;
    if (debug) {
      cosyLogger.info(`获取 ${this.entry.id} 的 HTML`);
    }
    return this.entry.rendered?.html || '';
  }

  getHeadings(): IHeadingType[] {
    const debug = false;
    if (debug) {
      cosyLogger.info(`获取 ${this.entry.id} 的 headings`);
    }
    return (this.entry.rendered?.metadata?.headings as IHeadingType[]) || [];
  }

  async getTopDoc(): Promise<ExperimentDoc | null> {
    const bookId = await this.getBookId();
    return await experimentRepo.find(bookId);
  }

  async getChildren(): Promise<ExperimentDoc[]> {
    return await experimentRepo.getChildren(this.entry.id);
  }

  async getDescendants(): Promise<ExperimentDoc[]> {
    return await experimentRepo.getDescendantDocs(this.entry.id);
  }

  async toSidebarItem(): Promise<SidebarItemEntity> {
    const debug = false;
    const children = await this.getChildren();
    let childItems = await Promise.all(
      children.map((child) => child.toSidebarItem())
    );
    if (this.isBook()) {
      childItems = [...childItems];
    }
    if (debug) {
      cosyLogger.info(`${this.entry.id} 的侧边栏项目`);
      console.log(childItems);
    }
    return new SidebarItemEntity({
      text: this.getTitle(),
      items: childItems,
      link: this.getLink(),
    });
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
}
