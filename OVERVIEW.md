# 灵感速记 - React + Tailwind CSS Web 应用

> 从微信小程序转换而来的全功能 Web 版本，已部署到 CloudStudio，可直接在浏览器访问。

## 线上地址

🔗 **https://6de18e7fa0f147a6a2390c9842b40261.app.codebuddy.work**

## 项目结构

```
inspiration-web/
├── index.html              # 入口 HTML
├── package.json            # 依赖（React 18 + Vite + Tailwind CSS）
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 主题（暖橙色系）
├── postcss.config.js       # PostCSS 配置
├── vercel.json             # Vercel SPA 路由重写
├── public/
│   └── favicon.svg         # 网站图标
├── src/
│   ├── main.jsx            # React 入口
│   ├── App.jsx             # 路由配置
│   ├── index.css           # 全局样式 + Tailwind 指令
│   ├── pages/
│   │   ├── Home.jsx        # 灵感列表页（时间轴卡片 + FAB）
│   │   └── Create.jsx      # 快速创建页（语音输入 + 过滤）
│   └── utils/
│       ├── storage.js      # localStorage 持久化
│       ├── time.js         # 相对时间 + 标签词典
│       └── filter.js       # 40+ 口气词过滤引擎
```

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| React Router 6 | 页面路由 |
| Tailwind CSS 3 | 样式系统 |
| Vite 5 | 构建工具 |
| Web Speech API | 浏览器语音识别 |
| localStorage | 数据持久化 |

## 功能特性

- ✅ 灵感列表：时间轴卡片、统计面板、滑动删除
- ✅ 快速创建：文本输入 + 语音输入双模式
- ✅ 语音转文字：Web Speech API（Chrome/Edge）
- ✅ 口气词过滤：40+ 中英文口气词自动过滤
- ✅ 标签分类：6 种灵感类型
- ✅ 完全离线：localStorage 本地存储
- ✅ Vercel 部署：vercel.json 已就绪

## 与小程序版本的差异

| 小程序 | Web 版 |
|--------|--------|
| WXML/WXSS | JSX + Tailwind CSS |
| wx.* API | Web Speech API / localStorage |
| 微信同声传译 | 浏览器 SpeechRecognition |
| 微信开发者工具 | npm run dev / Vite |
| 发布需审核 | 一键部署 Vercel |

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 导入仓库
3. 框架自动检测为 Vite，无需配置
4. 部署完成即获得 `xxx.vercel.app` 域名

## 本地开发

```bash
cd inspiration-web
npm install
npm run dev
```
