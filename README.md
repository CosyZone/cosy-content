# Cosy Content

一个用于管理多种类型内容的 TypeScript 库，支持博客、课程、实验、故事、手册等多种内容类型。

## 📦 项目结构

这是一个 monorepo 项目，包含以下包：

- **`packages/cosy-content`** - 核心库包
- **`packages/example`** - 标准示例项目
- **`packages/example-cloudflare`** - Cloudflare 部署示例

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
# 构建所有包
pnpm build

# 仅构建核心库
pnpm build:content

# 构建示例项目
pnpm build:example

# 构建 Cloudflare 示例
pnpm build:cloudflare
```

### 开发

```bash
# 启动开发服务器（需要先构建核心库）
pnpm dev
```

## 📚 使用文档

详细的使用文档请查看：

- **核心库文档**: [packages/cosy-content/README.md](./packages/cosy-content/README.md)
- **示例项目**: [packages/example/README.md](./packages/example/README.md)
- **Cloudflare 示例**: [packages/example-cloudflare/README.md](./packages/example-cloudflare/README.md)

## 🛠️ 技术栈

- **包管理**: pnpm workspace
- **语言**: TypeScript
- **框架**: Astro
- **类型验证**: Zod

## 📋 要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 📄 许可证

MIT License

