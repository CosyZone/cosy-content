# Cosy Content

[![English](https://img.shields.io/badge/English-violet)](README.md) [![简体中文](https://img.shields.io/badge/中文文档-gray)](docs/README-zh.md) [![Release](https://img.shields.io/github/v/release/cofficlab/cosy-ui?style=flat-square&logo=github&color=blue)](https://github.com/yuaotian/go-cursor-help/releases/latest) [![DEV](https://img.shields.io/badge/DEV-gray)](README-dev.md) [![NPM](https://img.shields.io/badge/NPM-orange)](https://www.npmjs.com/package/@coffic/cosy-ui) ![NPM Downloads](https://img.shields.io/npm/dm/%40coffic%2Fcosy-ui) ![NPM Version](https://img.shields.io/npm/v/%40coffic%2Fcosy-ui) [![Coffic](https://img.shields.io/badge/Coffic-green)](https://coffic.cn) [![Maintainer](https://img.shields.io/badge/Maintainer-blue)](https://github.com/nookery) ![GitHub License](https://img.shields.io/github/license/cofficlab/cosy-ui)

一个用于管理多种类型内容的 TypeScript 库，支持博客、课程、实验、课程、手册等多种内容类型。

## 功能特性

- **多种内容类型支持**：博客、课程、实验、课程、手册等
- **多语言支持**：内置中文和英文支持
- **类型安全**：完整的 TypeScript 类型定义
- **灵活的内容管理**：支持层级结构、标签、分类等
- **SEO 友好**：内置 SEO 优化功能
- **易于扩展**：模块化设计，易于添加新的内容类型

## 内容类型

### BlogDoc - 博客文档

适合发布独立的博客文章，支持标签、分类、作者等信息。

### CourseDoc - 课程文档

适合组织成体系的课程内容，支持多级章节结构。

### LessonDoc - 课程文档

适合单个课程的详细教程，支持步骤化的学习内容。

### ExperimentDoc - 实验文档

适合记录技术实验和探索，支持实验过程和结果展示。

### ManualDoc - 手册文档

适合展示成体系的文档，如产品用户手册、技术框架文档等。每个仓库只有一个完整的手册，按章节组织。

## 目录结构

```
content/
├── blogs/          # 博客文章
├── courses/        # 课程内容
├── lessons/        # 课程教程
├── experiments/    # 实验记录
├── manuals/        # 手册文档
└── meta/           # 元数据
```

## 快速开始

### 安装

```bash
npm install @coffic/cosy-content
```

### 基本使用

```typescript
import { blogRepo, courseRepo, manualRepo } from '@coffic/cosy-content';

// 获取博客文章
const blogs = await blogRepo.allBlogsByLang('zh-cn');

// 获取课程内容
const courses = await courseRepo.allCoursesByLang('zh-cn');

// 获取手册内容
const manuals = await manualRepo.allManualsByLang('zh-cn');
```

## API 参考

### BlogRepo

- `allBlogsByLang(lang: string)` - 获取指定语言的所有博客
- `getFamousBlogs(lang: string, count?: number)` - 获取精选博客
- `getBlogsWithTag(lang: string, tag: string)` - 根据标签获取博客

### CourseRepo

- `allCoursesByLang(lang: string)` - 获取指定语言的所有课程
- `getFamousCourses(lang: string, count?: number)` - 获取精选课程
- `getCoursesWithTag(lang: string, tag: string)` - 根据标签获取课程

### ManualRepo

- `allManualsByLang(lang: string)` - 获取指定语言的所有手册章节
- `getImportantManuals(lang: string, count?: number)` - 获取重要章节
- `getManualsWithTag(lang: string, tag: string)` - 根据标签获取手册内容
- `getManualsByCategory(lang: string, category: string)` - 根据分类获取手册内容
- `getManualStructure(lang: string)` - 获取手册的完整目录结构

## 配置

在 `content.config.ts` 中配置内容集合：

```typescript
import {
  makeBlogCollection,
  makeCourseCollection,
  makeManualCollection,
} from '@coffic/cosy-content/schema';

export const collections = {
  blogs: makeBlogCollection('./content/blogs'),
  courses: makeCourseCollection('./content/courses'),
  manuals: makeManualCollection('./content/manuals'),
};
```

## 开发

### 构建

```bash
npm run build
```

### 测试

```bash
npm run test
```

## 许可证

MIT License
