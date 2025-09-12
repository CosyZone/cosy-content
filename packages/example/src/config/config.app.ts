import { LangPackage } from "@coffic/cosy-ui";
import LinkConfig from "@/config/config.link";

export const AppConfig = {
    session_key: 'kuaiyizhi-session',

    companyName: LangPackage.setZh('青岛岳亿网络科技有限公司')
        .setEn('Qingdao Yueyi Network Technology Co., Ltd.'),

    icp: LangPackage.setZh('鲁ICP备2022009149号-2')
        .setEn('ICP License: 2022009149-2'),
    slogan: LangPackage.setZh('精彩软件，有爱创造').setEn('Wonderful Software, Built with Love'),
    inspirationalSlogan: LangPackage.setZh('也许，这是一番成就的开始').setEn('Perhaps, this is the beginning of achievement'),
    copyright: LangPackage.setZh('版权所有').setEn('All rights reserved'),
    keywords: 'Cisum,GitOk,TravelMode,Netto,CosyUI,菲克与象彩彩',
    siteName: '快易知',

    getNavItems(lang: string) {
        return [
            {
                href: LinkConfig.getHomeLink(lang),
                title: lang === 'zh-cn' ? '首页' : 'Home',
            },
            {
                href: LinkConfig.getCoursesLink(lang),
                title: '课程',
            },
            {
                href: LinkConfig.getStoriesLink(lang),
                title: '故事',
            },
            {
                href: LinkConfig.getLessonsLink(lang),
                title: 'Build Your Own X',
            },
            {
                href: LinkConfig.getBlogsLink(lang),
                title: lang === 'zh-cn' ? '博客' : 'Blogs',
            },
            {
                href: LinkConfig.getManualsLink(lang),
                title: lang === 'zh-cn' ? '手册' : 'Manuals',
            },
            {
                href: LinkConfig.getProductsLink(lang),
                title: lang === 'zh-cn' ? '产品' : 'Products',
            },
        ]
    },

    socialLinks: ['https://github.com/CofficLab'],

    getLink(lang: string, slug: string) {
        return `/${lang}/${slug}`;
    }
};
