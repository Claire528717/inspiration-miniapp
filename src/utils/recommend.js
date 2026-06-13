// ============================================
// 灵感速记 - AI 风格实现方式智能推荐
// ============================================

const CATALOG = {
  miniapp: {
    match: ['小程序', '微信', '公众号', 'miniapp', '扫码', '订阅消息'],
    reply: {
      title: '微信生态方案',
      analysis: '你的想法非常适合在微信小程序里实现——免安装、扫码即用、天然社交传播，是验证产品概念的最快路径。',
      approaches: [
        {
          name: '微信原生开发',
          stack: 'WXML + WXSS + JS + 微信云开发',
          desc: '最轻量方案，没有编译环节，微信开发者工具打开就能写。配合云开发免运维，连后端都不用搭。',
          steps: ['注册小程序账号（5分钟）', '下载微信开发者工具', '搭建页面结构（WXML/WXSS）', '接入微信云开发做数据存储', '真机预览 → 提交审核'],
          effort: '3–7 天',
          tip: '主包控制在 2MB 以内，用分包加载优化首屏速度。',
        },
        {
          name: 'Taro 跨端方案',
          stack: 'React/Vue + Taro + TDesign',
          desc: '写一套 React 代码，同时编译出微信小程序和 H5 网页。后续想扩展到支付宝/抖音小程序也零成本。',
          steps: ['npx @tarojs/cli init 创建项目', '选择 React + TypeScript 模板', '安装 tdesign-miniapp 组件库', '开发页面 → taro build --type weapp', 'H5 版一键 taro build --type h5'],
          effort: '5–10 天',
          tip: 'Taro 的 H5 版可直接部署 Vercel，一份代码两个平台。',
        },
        {
          name: 'uni-app 方案',
          stack: 'Vue 3 + uni-app + uniCloud',
          desc: 'Vue 开发者首选，生态最成熟。uniCloud 提供 serverless 后端，连数据库都不用自己建。',
          steps: ['HBuilderX 创建 uni-app 项目', '选择 Vue 3 模板', '使用 uniCloud 的云数据库', '开发页面 → 一键打包多端', '上传至微信开发者工具审核'],
          effort: '5–10 天',
          tip: 'uni-app 插件市场有海量现成模板，搜索关键词直接复用。',
        },
      ],
    },
  },
  app: {
    match: ['app', '移动端', '手机', '安卓', 'ios', 'flutter', 'react native', '原生'],
    reply: {
      title: '移动端 App 方案',
      analysis: '做原生 App 意味着更好的性能和用户体验，但也需要更长的开发周期。如果只是验证想法，建议先用小程序快速试错，确认方向后再投入 App 开发。',
      approaches: [
        {
          name: 'Flutter 跨平台',
          stack: 'Dart + Flutter + Firebase/Supabase',
          desc: 'Google 出品，一套代码编译 iOS + Android，性能接近原生。Material Design 组件开箱即用。',
          steps: ['安装 Flutter SDK', 'flutter create 创建项目', '选择状态管理（Provider/Riverpod）', '开发 UI → 接入后端 API', 'flutter build ios/android 打包发布'],
          effort: '2–4 周',
          tip: '如果只是内部工具，用 FlutterFlow 拖拽生成，零代码。',
        },
        {
          name: 'React Native',
          stack: 'JavaScript/TypeScript + React Native + Expo',
          desc: 'React 开发者无缝切换，Expo 大幅降低原生配置成本。社区最活跃，npm 生态直接复用。',
          steps: ['npx create-expo-app 初始化', '使用 Expo Router 做页面路由', '接入 NativeWind(Tailwind) 写样式', 'expo build 打包 IPA/APK', 'TestFlight/内部测试分发'],
          effort: '2–4 周',
          tip: 'Expo 的 expo-updates 支持 OTA 热更新，免去频繁发版的痛苦。',
        },
        {
          name: '先做小程序验证',
          stack: '微信小程序 → 再决定是否做 App',
          desc: '最务实的路径：3 天出小程序 MVP，让用户扫码试用。跑通核心流程后再评估是否需要 App。',
          steps: ['快速搭建小程序 MVP', '投放给种子用户测试', '收集反馈判断 App 必要性', '需要则用 Flutter/RN 重写'],
          effort: '3 天（MVP）',
          tip: '小程序验证成本仅为 App 的 1/10，是精益创业的标准做法。',
        },
      ],
    },
  },
  web: {
    match: ['网页', '前端', '官网', '落地页', 'web', 'h5', '网站', '浏览器', 'spa'],
    reply: {
      title: 'Web 应用方案',
      analysis: 'Web 的优势是链接即入口，无需下载。如果是展示型/工具型产品，Web 是最快的分发方式。',
      approaches: [
        {
          name: 'Vite + React 轻量方案',
          stack: 'React 18 + Vite + Tailwind CSS + Vercel',
          desc: '开发速度最快的组合。Vite 热更新秒级，Tailwind 不用写 CSS 文件，Vercel 推送即部署。',
          steps: ['npm create vite@latest → React', 'npm install tailwindcss 配置主题', '开发页面组件', 'npm run build → 部署 Vercel/CloudStudio', '绑定自定义域名'],
          effort: '1–3 天',
          tip: '追求极致速度可以 Clone 灵感速记项目直接改：github.com/Claire528717/inspiration-miniapp',
        },
        {
          name: 'Next.js 全栈方案',
          stack: 'Next.js 14 + Prisma + PostgreSQL + Vercel',
          desc: '需要 SEO、服务端渲染、数据库时选这个。App Router + Server Actions 让前后端一体开发。',
          steps: ['npx create-next-app 创建项目', '选择 App Router + TypeScript', 'setup Prisma + 数据库', '开发 API Routes / Server Actions', 'Vercel 一键部署'],
          effort: '3–7 天',
          tip: 'Next.js 的 ISR 增量静态再生功能，内容站 SEO 效果极好。',
        },
        {
          name: '纯静态 HTML 方案',
          stack: 'HTML + Tailwind CDN + 少许 JS',
          desc: '如果只是一个展示页/活动页，连 React 都不需要。一个 HTML 文件搞定，丢到任何静态托管上就能跑。',
          steps: ['创建 index.html', 'CDN 引入 Tailwind CSS', '写页面结构和交互', '上传到 GitHub Pages / Vercel'],
          effort: '半天',
          tip: '用 GitHub Pages 免费托管，域名都不需要买。',
        },
      ],
    },
  },
  ai: {
    match: ['ai', '人工智能', '机器学习', '大模型', 'gpt', 'llm', '智能', '推荐算法', '向量', 'embedding', 'chatgpt', 'claude', 'langchain', 'rag', '知识库'],
    reply: {
      title: 'AI / 大模型方案',
      analysis: 'AI 类产品最核心的问题不是技术选型，而是「模型能做到什么」和「用户期望什么」之间的差距管理。先用现成 API 验证核心体验，再考虑自建模型。',
      approaches: [
        {
          name: '直接调用 API 原型',
          stack: 'OpenAI API / Claude API + Vite + React',
          desc: '最快的 AI 产品原型路径。在 Web 前端直接调 API，2 小时内做出可演示的 AI 对话/生成工具。',
          steps: ['注册 OpenAI / Anthropic 获取 API Key', '前端调用 chat completions API', '实现流式输出（SSE）打字效果', '添加 prompt 工程优化效果', '部署到 Vercel（Key 放环境变量）'],
          effort: '1–2 天',
          tip: 'API Key 必须放后端或 Vercel 环境变量，绝不能暴露在前端代码里。',
        },
        {
          name: 'LangChain RAG 知识库',
          stack: 'Python + LangChain + ChromaDB + FastAPI',
          desc: '当 AI 需要基于你的私有数据回答时，用 RAG（检索增强生成）。把你的文档/知识库向量化，让 AI 基于真实数据回答。',
          steps: ['安装 LangChain + ChromaDB', '准备知识库文档（Markdown/PDF）', '使用 text-embedding 生成向量', '搭建 FastAPI 后端服务', '前端调用 API 展示 RAG 结果'],
          effort: '1–2 周',
          tip: '向量数据库选 ChromaDB（轻量）或 Pinecone（生产级），看你的数据量。',
        },
        {
          name: 'Dify / Coze 低代码 AI',
          stack: 'Dify 开源平台 / Coze（字节跳动）',
          desc: '不想写代码搭 AI 应用？Dify 提供可视化拖拽的 AI 工作流，内置 RAG、Agent、工具调用，部署后直接有 API 可用。',
          steps: ['Docker 部署 Dify（docker-compose up）', '配置 LLM 提供商（OpenAI/本地模型）', '拖拽搭建 AI 工作流', '发布 → 获得 API endpoint', '前端对接 API'],
          effort: '3–5 天',
          tip: 'Dify 自带对话日志和分析面板，产品迭代时可以看用户都在问什么。',
        },
      ],
    },
  },
  data: {
    match: ['数据', '分析', '报表', '可视化', '图表', '统计', 'excel', 'dashboard', 'bi', '数据看板', '指标'],
    reply: {
      title: '数据 / 可视化方案',
      analysis: '数据类产品关键在于「用户能看懂什么」而不是「你能展示多少」。先确定 3 个最核心指标，围绕它们设计看板，再扩展。',
      approaches: [
        {
          name: '前端图表嵌入',
          stack: 'React + ECharts/Recharts + Tailwind',
          desc: '数据量不大的情况下，在前端直接渲染图表最快。ECharts 支持所有图表类型，Recharts 更 React 原生。',
          steps: ['npm install echarts 或 recharts', '准备 Mock 数据验证图表类型', '确定配色和交互（tooltip/缩放）', '接入真实数据源', '优化渲染性能（数据量大用虚拟滚动）'],
          effort: '2–5 天',
          tip: 'ECharts 的 dataset 模式支持数据源和图表分离，切换图表类型只需改一行。',
        },
        {
          name: 'Python 数据分析管线',
          stack: 'Python + Pandas + Streamlit/Gradio',
          desc: '需要数据清洗、计算后再展示？Python 生态最强。Streamlit 能把 Python 脚本秒变交互式网页。',
          steps: ['pip install pandas streamlit plotly', '写数据清洗脚本（Pandas）', '用 Plotly 生成交互图表', 'streamlit run app.py 启动', '部署到 Streamlit Cloud'],
          effort: '1–3 天',
          tip: 'Streamlit 的 st.cache 能缓存计算结果，大幅加速重复查询。',
        },
        {
          name: 'Metabase 零代码 BI',
          stack: 'Metabase（开源 BI 工具）',
          desc: '连上数据库直接拖拽出图，不需要写一行代码。适合内部团队快速搭建数据看板。',
          steps: ['Docker 部署 Metabase', '连接数据源（MySQL/PG/BigQuery）', '用 GUI 创建问题和仪表盘', '设置定时推送报表', '分享链接给团队'],
          effort: '半天',
          tip: 'Metabase 的「问一个问题」支持自然语言查询，非技术人员也能自己查数据。',
        },
      ],
    },
  },
  backend: {
    match: ['后端', '接口', 'api', '服务器', '数据库', '存储', '登录', '用户', '微服务', '后台', '管理'],
    reply: {
      title: '后端 / 服务方案',
      analysis: '后端选型的关键因素是：团队最熟悉什么语言、数据量多大、是否需要实时通信。验证阶段选最轻的方案，别过早优化架构。',
      approaches: [
        {
          name: 'Node.js 全栈',
          stack: 'Node.js + Express/Fastify + Prisma + PostgreSQL',
          desc: '前后端统一 JavaScript，一个人就能搞定全栈。Prisma 是当下最好的 Node ORM，类型安全。',
          steps: ['npm init + express/fastify 脚手架', 'npx prisma init 配置数据库 Schema', '编写 RESTful API 路由', '中间件：JWT 认证 + 参数校验', '部署到 Railway/Render/VPS'],
          effort: '3–7 天',
          tip: 'Fastify 比 Express 快 2 倍，JSON Schema 校验内置，推荐新项目用。',
        },
        {
          name: 'Python 快速后端',
          stack: 'Python + FastAPI + SQLAlchemy + PostgreSQL',
          desc: 'AI/数据类产品的首选后端。FastAPI 自动生成 Swagger 文档，类型提示驱动开发，效率极高。',
          steps: ['pip install fastapi uvicorn sqlalchemy', '定义 Pydantic 数据模型', '编写 API 路由（自动生成文档）', '添加依赖注入和中间件', '部署到 Docker/VPS'],
          effort: '3–7 天',
          tip: 'FastAPI 的 BackgroundTasks 可以异步处理耗时操作，用户不用等。',
        },
        {
          name: 'Serverless / BaaS',
          stack: 'Supabase / Firebase / 微信云开发',
          desc: '不想管服务器？BaaS 平台提供数据库、认证、存储、实时订阅，开箱即用。个人开发者/小团队的最佳选择。',
          steps: ['注册 Supabase/Firebase 创建项目', '用 SDK 在前端直接操作数据库', '配置 Row Level Security 权限', '开启实时订阅（Realtime）', '设置自动备份'],
          effort: '1–3 天',
          tip: 'Supabase 是开源的 PostgreSQL BaaS，自建或托管都行，不会 vendor-lock。',
        },
      ],
    },
  },
  tool: {
    match: ['工具', '效率', '自动化', '脚本', '插件', 'chrome', '扩展', 'notion', '笔记', '剪藏', '快捷键'],
    reply: {
      title: '效率工具方案',
      analysis: '效率工具的核心是「减少用户操作步骤」。如果一个功能需要 3 次点击才能完成，试着减到 1 次。原型阶段用最轻的实现验证用户是否真的需要它。',
      approaches: [
        {
          name: 'Chrome 浏览器扩展',
          stack: 'HTML + JS + Chrome Extension API',
          desc: '浏览器插件是最贴近用户的工具形态。一键安装，随时唤起，适合剪藏/翻译/快捷搜索等场景。',
          steps: ['创建 manifest.json 声明权限', '编写 popup.html（弹出窗口）', 'content_script.js 注入网页', 'background.js 处理后台逻辑', 'Chrome 商店发布'],
          effort: '2–5 天',
          tip: 'Manifest V3 是当前标准，Service Worker 替代了 Background Page。',
        },
        {
          name: 'Electron 桌面应用',
          stack: 'Electron + React + Node.js',
          desc: '把 Web 技术打包成桌面 App。VS Code、Figma、Notion 都用这套。适合需要本地文件系统访问的工具。',
          steps: ['npx create-electron-app 初始化', '集成 React 做 UI 层', '使用 Node.js API 访问文件系统', 'electron-builder 打包 exe/dmg', '自动更新（electron-updater）'],
          effort: '1–2 周',
          tip: 'Electron 包体积较大（~150MB），如果只是小工具可以考虑 Tauri（Rust 内核，仅 ~10MB）。',
        },
        {
          name: 'n8n / Make 自动化',
          stack: 'n8n（开源）/ Make.com（云端）',
          desc: '用拖拽方式连接各种 API。比如「收到邮件 → 自动加入 Notion → 推送到飞书」。不需要写后端代码。',
          steps: ['Docker 部署 n8n（自建）或用 Make.com', '配置触发器（Webhook/定时/邮件）', '拖拽节点搭建工作流', '测试 → 激活自动化', '监控运行日志'],
          effort: '1–2 天',
          tip: 'n8n 自建免费无限制，Make.com 免费版每月 1000 次执行。',
        },
      ],
    },
  },
  content: {
    match: ['内容', '社区', '论坛', '博客', '写作', '文章', '分享', '知识库', '文档', 'wiki'],
    reply: {
      title: '内容 / 社区方案',
      analysis: '内容型产品最难的是冷启动——没有内容就没有用户，没有用户就没有内容。建议先从单点高质量内容做起，用社交媒体分发引流。',
      approaches: [
        {
          name: 'Notion + 分享',
          stack: 'Notion → 发布为网站',
          desc: '最快的内容发布方式。Notion 写一页 → 点 Share → Publish to web，1 分钟获得公网链接。',
          steps: ['在 Notion 整理内容', '设计页面排版和目录', '点击 Share → Publish', '绑定自定义域名（付费功能）', '配合社交媒体分发'],
          effort: '1 小时',
          tip: '用 Notion 的 Database 视图可以搭建简单的博客/作品集。',
        },
        {
          name: 'Next.js 文档/博客站',
          stack: 'Next.js + MDX + Contentlayer + Vercel',
          desc: '写 Markdown 自动变成网页。技术文档和博客的标配方案，SEO 完美。',
          steps: ['npx create-next-app 创建项目', '配置 MDX 和 Contentlayer', '设计文章模板和导航', '写第一篇 Markdown 文章', 'Vercel 部署 + 自定义域名'],
          effort: '2–5 天',
          tip: '用 Vercel 的 ISR 功能，每次改 Markdown 不需要重新构建整个站。',
        },
        {
          name: '微信公众号生态',
          stack: '公众号文章 + 小程序',
          desc: '微信生态内内容触达用户的最佳路径。公众号做内容沉淀，小程序做互动/工具功能，互相导流。',
          steps: ['注册订阅号/服务号', '撰写第一篇推文', '在小程序里嵌入公众号关注组件', '文章底部放小程序卡片引流', '分析后台数据优化内容策略'],
          effort: '1–3 天',
          tip: '服务号每月只能群发 4 次，但支持模板消息和支付，选类型时想清楚。',
        },
      ],
    },
  },
}

// 通用默认回复
const DEFAULT_REPLY = {
  title: '通用实现建议',
  analysis: '你的这个想法有多种可行的实现路径，具体取决于你的时间预算、技术背景和最终目标用户是谁。',
  approaches: [
    {
      name: 'Web 原型快速验证',
      stack: 'React + Vite + Tailwind CSS + Vercel',
      desc: '最快把想法变成别人能点开的链接。甚至可以基于灵感速记项目直接改：github.com/Claire528717/inspiration-miniapp',
      steps: ['npm create vite@latest 创建项目', '配置 Tailwind CSS 主题', '开发核心页面和交互', 'LocalStorage 做数据存储', 'Vercel/CloudStudio 一键部署'],
      effort: '1–3 天',
      tip: '先做 1 个核心功能让用户试试，而不是一下子做 10 个功能。',
    },
    {
      name: '微信小程序 MVP',
      stack: '微信原生 / Taro + 微信云开发',
      desc: '如果需要微信生态的社交传播或支付能力，小程序是最佳载体。免安装，扫码即用。',
      steps: ['注册小程序账号', '搭建核心 2–3 个页面', '接入微信云开发做后端', '真机预览测试', '提交审核上线'],
      effort: '3–7 天',
      tip: '开发版预览码可以发给任何人测试，不需要审核通过。',
    },
    {
      name: 'Notion 文档 + 规划',
      stack: 'Notion / 飞书文档',
      desc: '如果还在想法阶段，先用文档把用户故事、功能列表、竞品分析写清楚。思考清楚比写代码更重要。',
      steps: ['创建需求文档（用户故事地图）', '画核心流程的线框图', '列出 MVP 功能清单', '找 3 个目标用户聊一聊', '确认方向后再动手写代码'],
      effort: '半天',
      tip: '很多产品失败不是因为技术不行，而是做的东西没人需要。先验证需求。',
    },
  ],
}

/**
 * 根据灵感内容生成 AI 风格的实现建议
 * @param {string} content - 灵感内容
 * @param {string} tag - 分类标签
 * @returns {{ title, analysis, approaches: Array<{name, stack, desc, steps, effort, tip}> }}
 */
export function getRecommendations(content, tag = '') {
  const text = (content + ' ' + tag).toLowerCase()

  for (const cat of Object.values(CATALOG)) {
    const matched = cat.match.find((kw) => text.includes(kw))
    if (matched) return cat.reply
  }

  return DEFAULT_REPLY
}
