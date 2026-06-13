// ============================================
// 灵感速记 - 实现方式智能推荐
// ============================================

// 关键词 → 推荐方案映射规则
const RULES = [
  // ── App / 小程序 ──────────────────────────────
  {
    keywords: ['小程序', '微信', '公众号', 'wechat', 'miniapp'],
    suggestions: [
      { icon: '🛠️', label: '微信原生', desc: 'WXML + WXSS + JS，上手快，适合快速验证' },
      { icon: '⚡', label: 'Taro', desc: 'React 语法写一套，同时输出小程序和 H5' },
      { icon: '🌈', label: 'uni-app', desc: 'Vue 语法，可发布到微信/支付宝/抖音小程序' },
    ],
  },
  {
    keywords: ['app', '移动端', '手机', '安卓', 'ios', 'flutter', 'react native'],
    suggestions: [
      { icon: '🎯', label: 'Flutter', desc: '一套代码跑 iOS + Android，性能接近原生' },
      { icon: '⚛️', label: 'React Native', desc: 'JS + React，大量现成组件，社区最活跃' },
      { icon: '🔵', label: '微信小程序', desc: '无需下载安装，发给任何人扫码即用' },
    ],
  },
  // ── 网页 / 前端 ───────────────────────────────
  {
    keywords: ['网页', '前端', '官网', '落地页', 'web', 'h5', '网站'],
    suggestions: [
      { icon: '⚡', label: 'Vite + React', desc: '开发极快，适合交互型 Web 应用' },
      { icon: '🟩', label: 'Next.js', desc: '支持 SSR，SEO 友好，适合内容型网站' },
      { icon: '🔥', label: 'Vercel 一键部署', desc: '推代码自动上线，5 分钟从代码到公网' },
    ],
  },
  // ── AI / 机器学习 ─────────────────────────────
  {
    keywords: ['ai', '人工智能', '机器学习', '大模型', 'gpt', 'llm', '智能', '推荐算法', '向量', 'embedding'],
    suggestions: [
      { icon: '🤖', label: 'OpenAI API', desc: 'GPT-4o 直接调用，适合文本理解/生成场景' },
      { icon: '🦜', label: 'LangChain', desc: '快速搭建 AI 工作流，支持 RAG 知识库' },
      { icon: '🐍', label: 'Python + FastAPI', desc: '搭 AI 后端服务首选，生态最完整' },
    ],
  },
  // ── 数据 / 分析 ───────────────────────────────
  {
    keywords: ['数据', '分析', '报表', '可视化', '图表', '统计', 'excel', 'dashboard'],
    suggestions: [
      { icon: '📊', label: 'Recharts / ECharts', desc: '前端图表库，嵌入 React 5 分钟搞定' },
      { icon: '🐼', label: 'Python + Pandas', desc: '数据清洗 + 分析最顺手的组合' },
      { icon: '📈', label: 'Metabase', desc: '无代码 BI 工具，连上数据库直接出图' },
    ],
  },
  // ── 后端 / 服务 ───────────────────────────────
  {
    keywords: ['后端', '接口', 'api', '服务器', '数据库', '存储', '登录', '用户', '微服务'],
    suggestions: [
      { icon: '🟢', label: 'Node.js + Express', desc: 'JS 全栈，和前端一种语言，学习成本低' },
      { icon: '🐍', label: 'Python + FastAPI', desc: '写起来最快，自带 Swagger 文档' },
      { icon: '☁️', label: '微信云开发', desc: '小程序生态内零运维，免去服务器配置' },
    ],
  },
  // ── 工具 / 效率 ───────────────────────────────
  {
    keywords: ['工具', '效率', '自动化', '脚本', '插件', 'chrome', '扩展', 'notion', '笔记'],
    suggestions: [
      { icon: '🔌', label: 'Chrome 扩展', desc: '浏览器插件，随时触达用户，开发简单' },
      { icon: '🤖', label: 'n8n / Make', desc: '低代码自动化平台，连接各种 API 无需编程' },
      { icon: '📦', label: 'Electron', desc: '用 Web 技术做桌面 App，跨平台' },
    ],
  },
  // ── 内容 / 社区 ───────────────────────────────
  {
    keywords: ['内容', '社区', '论坛', '博客', '写作', '文章', '分享', '知识库'],
    suggestions: [
      { icon: '📝', label: 'Notion + 分享链接', desc: '最快的内容发布方式，1 分钟上线' },
      { icon: '🟩', label: 'Next.js + MDX', desc: '技术博客/文档站经典组合，SEO 友好' },
      { icon: '💬', label: '微信公众号', desc: '内容触达微信用户，结合小程序形成闭环' },
    ],
  },
  // ── 游戏 ─────────────────────────────────────
  {
    keywords: ['游戏', '互动', '玩法', '关卡', 'game'],
    suggestions: [
      { icon: '🎮', label: 'Phaser.js', desc: '网页 2D 游戏框架，适合 H5 小游戏' },
      { icon: '🧊', label: 'Unity', desc: '2D/3D 均可，一键导出微信小游戏' },
      { icon: '🟦', label: '微信小游戏', desc: '微信生态内传播最快的互动形式' },
    ],
  },
]

// 默认推荐（无关键词匹配时）
const DEFAULT_SUGGESTIONS = [
  { icon: '⚡', label: 'Vite + React', desc: '最快的 Web 原型，从零到可演示 1 天内' },
  { icon: '🛠️', label: '微信小程序', desc: '扫码即用，无需下载，适合快速验证想法' },
  { icon: '☁️', label: 'Notion 文档', desc: '先把需求写清楚，比写代码更重要' },
]

/**
 * 根据灵感内容智能推荐实现方案
 * @param {string} content - 灵感内容
 * @param {string} tag - 分类标签
 * @returns {{ suggestions: Array, matchedKeyword: string|null }}
 */
export function getRecommendations(content, tag = '') {
  const text = (content + ' ' + tag).toLowerCase()

  for (const rule of RULES) {
    const matched = rule.keywords.find((kw) => text.includes(kw))
    if (matched) {
      return {
        suggestions: rule.suggestions,
        matchedKeyword: matched,
      }
    }
  }

  return {
    suggestions: DEFAULT_SUGGESTIONS,
    matchedKeyword: null,
  }
}
