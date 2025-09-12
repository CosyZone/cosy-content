import { type CollectionEntry } from 'astro:content';
import { BaseDB } from './BaseRepo.js';
import { ProductDoc } from '../entities/ProductDoc.js';

export const COLLECTION_PRODUCT = 'products' as const;
export type ProductEntry = CollectionEntry<typeof COLLECTION_PRODUCT>;

class ProductRepo extends BaseDB<typeof COLLECTION_PRODUCT, ProductEntry, ProductDoc> {
    protected collectionName = COLLECTION_PRODUCT;

    protected createDoc(entry: ProductEntry): ProductDoc {
        return ProductDoc.fromEntry(entry);
    }

    async allProducts(): Promise<ProductDoc[]> {
        // 由于 Astro 自动移除 index 后缀，产品 ID 实际是 lang/slug (深度为2)
        // 但我们只要以 /index 结尾的文档，所以先尝试深度3，如果没有再尝试深度2
        const depth3 = await this.getDocsByDepth(3);
        const depth3IndexDocs = depth3.filter((doc) => doc.getId().endsWith('/index'));

        if (depth3IndexDocs.length > 0) {
            return depth3IndexDocs;
        }

        // 如果深度3没有找到，尝试深度2（Astro 自动移除了 index 后缀）
        const depth2 = await this.getDocsByDepth(2);
        return depth2;
    }

    async allProductsByLang(lang: string): Promise<ProductDoc[]> {
        const docs = await this.allProducts();
        return docs.filter((doc) => doc.getId().startsWith(lang));
    }

    async getStaticPaths() {
        const docs = await this.allProducts();
        return docs.map((doc) => {
            const slug = doc.getSlug();
            return {
                params: {
                    lang: doc.getLang(),
                    ...(slug ? { slug } : {}),
                },
            };
        });
    }
}

export const productRepo = new ProductRepo();


