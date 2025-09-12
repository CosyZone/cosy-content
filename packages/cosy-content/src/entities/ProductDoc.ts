import { LinkUtil } from '../utils/link.js';
import { BaseDoc } from './BaseDoc.js';
import type { ProductEntry } from '../repos/ProductRepo.js';
import { getEntry } from 'astro:content';

export class ProductDoc extends BaseDoc {
    entry: ProductEntry;

    private constructor(entry: ProductEntry) {
        super();
        this.entry = entry;
    }

    static fromEntry(entry: ProductEntry) {
        return new ProductDoc(entry);
    }

    getSlug(): string {
        const parts = this.getId().split('/').slice(1);
        if (parts[parts.length - 1] === 'index') {
            parts.pop();
        }
        return parts.join('/');
    }

    getLink(): string {
        const productIdWithoutLang = this.entry.id.replace(`${this.getLang()}/`, '');
        return LinkUtil.createUrl(`/${this.getLang()}/products/${productIdWithoutLang}`);
    }

    // 渲染 cover.mdx 内容
    async renderCover() {
        let coverId: string;
        if (this.getId().endsWith('/index')) {
            // 如果 ID 以 /index 结尾，替换为 /cover
            coverId = this.getId().replace('/index', '/cover');
        } else {
            // 如果 ID 不以 /index 结尾（Astro 自动移除了），添加 /cover
            coverId = this.getId() + '/cover';
        }

        try {
            const coverEntry = await getEntry('products', coverId);
            if (coverEntry) {
                // 使用 render 函数直接渲染 coverEntry
                const { render } = await import('astro:content');
                return await render(coverEntry);
            }
        } catch (error) {
            // cover.mdx 不存在时返回 null
            return null;
        }
        return null;
    }
}

export default ProductDoc;

