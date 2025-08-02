export class LinkUtil {
  // 从 astro.config.ts 中获取基础路径
  static getBaseUrl = (): string => {
    return import.meta.env.BASE_URL;
  };

  // 生成带基础路径的完整 URL
  static createUrl = (path: string): string => {
    const baseUrl = LinkUtil.getBaseUrl();
    // 如果路径以 '/' 开头，去除开头的 '/'
    if (path.startsWith('/')) {
      path = path.substring(1);
    }

    return `${baseUrl}${path}`;
  };
}
