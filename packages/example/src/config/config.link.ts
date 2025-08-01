

export default class LinkConfig {
    /**
     * 规范化语言代码
     * @param lang - 语言代码
     * @returns 规范化后的语言代码
     */
    static normalizeLanguage(lang: string): string {
        const normalizedLang = lang.toLowerCase().replace('zh-CN', 'zh-cn');
        if (normalizedLang.length == 0) {
            console.error('lang is empty');
            return 'en';
        }
        return normalizedLang;
    }

    static getHomeLink(lang: string): string {
        return `/${lang}`;
    }

    static getLessonsLink(lang: string): string {
        return `/${lang}/lessons`;
    }

    static getExperimentsLink(lang: string): string {
        return `/${lang}/experiments`;
    }

    static getExperimentLink(lang: string, experimentId: string): string {
        if (experimentId.endsWith(lang)) {
            return `/${lang}/experiments/${experimentId.replace(`${lang}`, '')}`;
        } else {
            const idWithoutLang = experimentId.replace(`${lang}/`, '');
            return `/${lang}/experiments/${idWithoutLang}`;
        }
    }

    static getCoursesLink(lang: string): string {
        return `/${lang}/courses`;
    }

    static getBlogsLink(lang: string): string {
        return `/${lang}/blogs`;
    }

    static getManualsLink(lang: string): string {
        return `/${lang}/manuals`;
    }

    static getLessonLink(lang: string, lessonId: string): string {
        if (lessonId.endsWith(lang)) {
            return `/${lang}/lessons/${lessonId.replace(`${lang}`, '')}`;
        } else {
            const idWithoutLang = lessonId.replace(`${lang}/`, '');
            return `/${lang}/lessons/${idWithoutLang}`;
        }
    }

    static getTagLink(lang: string, tagName: string): string {
        return `/${lang}/blogs/tag/${tagName}`;
    }

    static getBlogLink(blogId: string, lang: string): string {
        const blogIdWithoutLang = blogId.replace(`${lang}/`, '')

        return `/${lang}/blogs/${blogIdWithoutLang}`;
    }

    static getCourseLink(courseId: string): string {
        const debug = false
        const lang = courseId.split('/')[0]
        const courseIdWithoutLang = courseId.replace(`${lang}/`, '')

        return `/${lang}/courses/${courseIdWithoutLang}`;
    }

    static getMetaLink(lang: string, slug: string): string {
        return `/${this.normalizeLanguage(lang)}/meta/${slug}`;
    }

    static getSigninLink(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/signin`;
    }

    static getAuthCallbackCookieLink(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/auth/callback_cookie`;
    }

    static getAuthCallbackTokenLink(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/auth/callback_token`;
    }

    static getAuthAccountLink(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/auth/account`;
    }

    static getDashboardUrl(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/auth/dashboard`;
    }

    static getAuthErrorLink(lang: string): string {
        return `/${this.normalizeLanguage(lang)}/auth/error`;
    }

    static getPrivacyLink(lang: string): string {
        return this.getMetaLink(lang, 'privacy');
    }

    static getTermsLink(lang: string): string {
        return this.getMetaLink(lang, 'terms');
    }

    static getAboutLink(lang: string): string {
        return this.getMetaLink(lang, 'about');
    }

    /**
     * 根据ID生成链接
     * 
     * 该函数根据文档ID生成对应的链接路径。
     * 
     * @param {string} id - 文档ID, 例如 'courses/zh-cn/supervisor/index.md'
     * @returns {string} 返回生成的链接路径
     * @example
     * // 例如：
     * // id=courses/zh-cn/supervisor/index.md，则返回/zh-cn/courses/supervisor
     * // id=courses/en/supervisor/index.md，则返回/en/courses/supervisor
     */
    static getLink(id: string): string {
        let category = id.split('/')[0];
        let lang = id.split('/')[1];
        let path = id.split('/').slice(2).join('/');

        let link = `/${lang}/${category}/${path}`;
        return link.replace(/\/+/g, '/');
    }

    /**
     * 根据分类生成顶级链接
     * 
     * @param {string} category - 分类名称
     * @param {string} lang - 语言代码，例如 'zh-cn', 'en'
     * @returns {string} 返回生成的顶级链接路径
     * @example
     * // 例如：
     * // category=courses, lang=zh-cn，则返回/zh-cn/courses
     * // category=courses, lang=en，则返回/en/courses
     */
    static getTopLevelLink(category: string, lang: string): string {
        return `/${lang}/${category}`;
    }

    /**
     * 处理首页重定向
     * @param locale - 语言代码
     * @returns 规范化的语言代码
     */
    static homeRedirect(locale: string): string {
        return locale || "en";
    }

    /**
     * 检查是否为首页路径
     * @param pathname - 路径
     * @returns 是否为首页
     */
    static isHomePath(pathname: string): boolean {
        return pathname === "/" || pathname === "";
    }

    static isHomeLink(path: string, lang: string): boolean {
        return path === `/${lang}` || path === `/${lang}/`;
    }

    static isLessonsLink(path: string, lang: string): boolean {
        return path === `/${lang}/lessons` ||
            path === `/${lang}/lessons/` ||
            path.startsWith(`/${lang}/lessons/`);
    }

    static isExperimentsLink(path: string, lang: string): boolean {
        return path === `/${lang}/experiments` ||
            path === `/${lang}/experiments/` ||
            path.startsWith(`/${lang}/experiments/`);
    }

    static isCoursesLink(path: string, lang: string): boolean {
        return path === `/${lang}/courses`
            || path === `/${lang}/courses/`
            || path.startsWith(`/${lang}/courses/`);
    }

    static isBlogsLink(path: string, lang: string): boolean {
        return path === `/${lang}/blogs`
            || path === `/${lang}/blogs/`
            || path.startsWith(`/${lang}/blogs/`);
    }

    static getOAuthSuccessLink(currentOrigin: string): string {
        return `${currentOrigin}/api/callback_success`;
    }

    static getOAuthErrorLink(currentOrigin: string): string {
        return `${currentOrigin}/api/callback_error`;
    }

    static getLoginLink(currentOrigin: string): string {
        return `${currentOrigin}/api/login`;
    }
}