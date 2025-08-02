import { blogRepo } from '../repos/BlogRepo.js';
import { SidebarItemEntity } from './SidebarItem.js';
import { type ITagStaticPath } from '../types/static-path.js';
import { LinkUtil } from '../utils/link.js';

export class Tag {
  name: string;
  lang: string;
  count: number;

  constructor(name: string, count: number, lang: string) {
    this.name = name;
    this.count = count;
    this.lang = lang;
  }

  toSidebarItem(lang: string): SidebarItemEntity {
    return new SidebarItemEntity({
      text: this.name,
      link: LinkUtil.createUrl(`/${lang}/blogs/tag/${this.name}`),
    });
  }

  toTagPath(): ITagStaticPath {
    return {
      params: { slug: this.lang + '/blogs/tag/' + this.name },
      props: { tag: this.name },
    };
  }

  static async makeRootSidebarItem(lang: string): Promise<SidebarItemEntity> {
    const tags = await blogRepo.getTagsByLang(lang);

    return new SidebarItemEntity({
      text: 'Tags',
      link: LinkUtil.createUrl(`/${lang}/blogs/tag`),
      items: tags.map((tag: Tag) => tag.toSidebarItem(lang)),
    });
  }
}

export default Tag;
