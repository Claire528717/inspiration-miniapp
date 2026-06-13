// ============================================
// 灵感速记 - 对话式澄清引擎
// 点击「如何实现呢」后，通过多轮提问帮用户澄清想法，
// 最后给出接地气的行动建议（非技术导向）
// ============================================

/**
 * 对话引擎：根据当前状态和用户回答，决定下一步问什么或给出建议
 *
 * 流程：欢迎 → 多轮提问（2-3轮）→ 给出建议
 */

// 问题库：按场景分类的澄清问题
const QUESTIONS = {
  // 第一轮：了解灵感性质
  round1: {
    type: 'choice',
    question: '这个想法，你想用来做什么？',
    options: [
      { label: '🚀 做一个产品/项目', value: 'product', hint: '有具体要做出来的东西' },
      { label: '🎯 实现一个个人目标', value: 'goal', hint: '比如学一门技能、养成一个习惯' },
      { label: '💡 记录下来备用', value: 'note', hint: '暂时没有具体计划，先记着' },
      { label: '🤔 我还不太确定', value: 'unsure', hint: '想法还比较模糊' },
    ],
  },

  // 第二轮：根据第一轮回答追问
  round2: {
    product: {
      type: 'choice',
      question: '这个产品是给谁用的？',
      options: [
        { label: '👥 给很多人用（大众产品）', value: 'mass' },
        { label: '🏢 给特定人群用', value: 'niche', followUp: '比如？学生 / 职场人 / 宝妈...' },
        { label: '🧑 先给自己用', value: 'personal' },
        { label: '🤝 给团队/公司用', value: 'team' },
      ],
    },
    goal: {
      type: 'choice',
      question: '这个目标，你打算什么时候开始？',
      options: [
        { label: '⏰ 马上（本周内）', value: 'now' },
        { label: '📅 近期（1个月内）', value: 'soon' },
        { label: '🗓️ 还没定时间', value: 'someday' },
      ],
    },
    note: {
      type: 'choice',
      question: '想怎么处理这条记录？',
      options: [
        { label: '📌 设为提醒，改天再想', value: 'remind' },
        { label: '🔍 搜一下相关资料', value: 'research' },
        { label: '✍️ 先补充更多细节', value: 'elaborate' },
      ],
    },
    unsure: {
      type: 'choice',
      question: '你觉得这个想法最吸引你的是什么？',
      options: [
        { label: '💰 可能有商业价值', value: 'business' },
        { label: '🎨 创意本身很有趣', value: 'creative' },
        { label: '😤 解决了一个痛点', value: 'problem' },
        { label: '🌟 只是觉得很酷', value: 'cool' },
      ],
    },
  },

  // 第三轮：进一步澄清
  round3: {
    mass: {
      type: 'input',
      question: '你脑海里有没有一个「最小版本」？\n比如用户打开后，能做的第一件有价值的事是什么？',
      placeholder: '描述一下最核心的功能...',
    },
    niche: {
      type: 'input',
      question: '你说的特定人群，具体是哪些人？\n越具体越好，比如「25-30岁的职场妈妈」',
      placeholder: '描述一下目标用户...',
    },
    personal: {
      type: 'choice',
      question: '给自己用的东西，你更看重什么？',
      options: [
        { label: '⚡ 快，别让我配置太多', value: 'speed' },
        { label: '🎨 好看，用起来舒服', value: 'design' },
        { label: '🔒 隐私，数据不能给别人', value: 'privacy' },
      ],
    },
    team: {
      type: 'choice',
      question: '团队大概多少人用？',
      options: [
        { label: '👤 2-5 人', value: 'small' },
        { label: '👥 5-20 人', value: 'medium' },
        { label: '🏢 20 人以上', value: 'large' },
      ],
    },
    now: {
      type: 'input',
      question: '这个目标，具体想达成什么？\n比如「3个月后能流利对话」而不是「学好日语」',
      placeholder: '描述一下你期望的结果...',
    },
    soon: {
      type: 'choice',
      question: '这个目标，你之前尝试过吗？',
      options: [
        { label: '✅ 试过，没坚持下来', value: 'tried' },
        { label: '🆕 第一次尝试', value: 'first' },
        { label: '🔄 在做，想做得更好', value: 'improving' },
      ],
    },
    remind: {
      type: 'choice',
      question: '希望什么时候提醒你？',
      options: [
        { label: '📆 1 周后', value: '1w' },
        { label: '📅 1 个月后', value: '1m' },
        { label: '⏰ 不设提醒，我自己记得', value: 'none' },
      ],
    },
    research: {
      type: 'done',
      // 直接给出搜索建议
    },
    business: {
      type: 'choice',
      question: '你有没有想过怎么赚钱？',
      options: [
        { label: '💳 付费订阅 / 买断', value: 'paid' },
        { label: '📢 免费，靠广告', value: 'ads' },
        { label: '🤷 还没想过', value: 'none' },
      ],
    },
    problem: {
      type: 'input',
      question: '这个痛点，你自己遇到过吗？\n频率大概是怎样的？',
      placeholder: '描述一下这个痛点...',
    },
  },
}

/**
 * 根据对话历史，生成下一步（问题 or 建议）
 * @param {object} params
 * @param {string} params.content - 原始灵感内容
 * @param {string} params.tag - 分类标签
 * @param {Array} params.answers - 用户回答历史 [{question, answer, value}]
 * @returns {object} { type: 'question'|'suggestion', data: {...} }
 */
export function getNextStep({ content, tag, answers }) {
  const answeredCount = answers.length

  // 第一轮：还没回答过，问 round1
  if (answeredCount === 0) {
    return {
      type: 'question',
      data: QUESTIONS.round1,
    }
  }

  // 第二轮：根据第一轮回答问 round2
  if (answeredCount === 1) {
    const firstAnswer = answers[0].value
    const q = QUESTIONS.round2[firstAnswer] || QUESTIONS.round2.unsure
    return {
      type: 'question',
      data: q,
    }
  }

  // 第三轮：继续追问或结束
  if (answeredCount === 2) {
    const firstAnswer = answers[0].value
    const secondAnswer = answers[1].value
    const q = QUESTIONS.round3[secondAnswer] || QUESTIONS.round3[firstAnswer]

    if (q && q.type === 'done') {
      return generateSuggestion({ content, tag, answers })
    }
    if (q) {
      return {
        type: 'question',
        data: q,
      }
    }
  }

  // 三轮结束或无法继续追问，生成建议
  return generateSuggestion({ content, tag, answers })
}

/**
 * 根据对话历史，生成个性化建议
 */
function generateSuggestion({ content, tag, answers }) {
  const purpose = answers[0]?.value // product / goal / note / unsure
  const detail = answers[1]?.value  // mass / niche / personal / team / now / soon / ...

  // 根据不同目的生成不同风格的建议
  let suggestion

  if (purpose === 'product') {
    suggestion = genProductSuggestion(content, answers)
  } else if (purpose === 'goal') {
    suggestion = genGoalSuggestion(content, answers)
  } else if (purpose === 'note') {
    suggestion = genNoteSuggestion(content, answers)
  } else {
    suggestion = genUnsureSuggestion(content, answers)
  }

  return {
    type: 'suggestion',
    data: suggestion,
  }
}

// ── 各类建议生成器 ──────────────────────────────────────────────

function genProductSuggestion(content, answers) {
  const audience = answers[1]?.value
  const coreFeature = answers[2]?.answer || ''

  let nextSteps = []
  let mindshift = ''
  let resources = []

  if (audience === 'mass' || audience === 'niche') {
    nextSteps = [
      '📝 写一句话描述：用「用户 + 需要 + 但是 + 所以」的句式，比如「学生需要做PPT，但是模板太丑，所以做一个好看的模板库」',
      '👥 找3个目标用户聊一聊：别做问卷，直接微信问，「你觉得这个问题存在吗？你现在是怎么办的？」',
      '📄 画一张流程图：用户从哪来 → 做什么 → 得到什么结果，用纸笔画就行',
      '🔍 搜一下有没有现成的竞品：如果有，看看他们哪里做得不够好；如果没有，想一想为什么',
    ]
    mindshift = '很多人做产品会先想「我能做什么」，但更重要的是「用户愿意为什么付费/花时间」。先验证需求，再写代码。'
    resources = [
      '《精益创业》—— 讲如何用最小成本验证想法',
      'Product Hunt —— 看别人是怎么展示新产品的',
      '小红书/知乎 —— 搜你的关键词，看大家在抱怨什么',
    ]
  } else if (audience === 'personal') {
    nextSteps = [
      '🛠️ 先搜「现成工具」：看看有没有已经能解决你问题的 App/小程序，别重复造轮子',
      '📋 列一个「必须有 vs 最好有」清单：把核心需求圈出来，其他都是加分项',
      '⏱️ 给自己设一个时间限制：比如「两周内必须做出能用的版本」，防止陷入完美主义',
    ]
    mindshift = '给自己用的工具，好用比好看重要，能用比完美重要。先做出一个「能忍」的版本，再慢慢改。'
    resources = [
      'Notion —— 可以快速搭建个人工具，不用写代码',
      '微信小程序「快应用」—— 一些现成的工具模板',
      'GitHub —— 搜关键词，很多开源工具可以直接用',
    ]
  } else if (audience === 'team') {
    nextSteps = [
      '📊 先做一个「有没有人愿意用」的调查：在团队里问一圈，看有没有类似痛点',
      '🎯 锁定一个核心场景：别想解决所有问题，先解决团队最痛的那一个',
      '📱 做一个超简单的原型：用 Figma 或直接在纸上画，给同事看，收集反馈',
    ]
    mindshift = '团队工具的核心是「大家愿意用」。再好的功能，如果大家懒得用，就是零。先解决「为什么现在的方法不够好」。'
    resources = [
      '飞书多维表格 —— 很多团队工具其实一张表就能搞定',
      'Slack/飞书机器人 —— 可以做一些自动化提醒',
      '内部工具尽量轻量，别搞太复杂',
    ]
  }

  return {
    title: '把想法变成产品的建议',
    summary: `你的想法「${content.slice(0, 30)}...」听起来很有潜力。关键是先从「我觉得」变成「用户觉得」。`,
    nextSteps,
    mindshift,
    resources,
  }
}

function genGoalSuggestion(content, answers) {
  const timing = answers[1]?.value
  const detail = answers[2]?.value

  let nextSteps = []
  let mindshift = ''

  if (timing === 'now' || timing === 'soon') {
    nextSteps = [
      '🎯 把目标拆成「第一周能完成的事」：大目标会让人焦虑，小目标才会让人行动',
      '📅 定一个具体的「开始时间」：比如「这周六早上9点」，而不是「这周末」',
      '📊 找一个可以量化的指标：比如「每天背30个单词」而不是「学好英语」',
      '👥 找一个 accountability partner：跟朋友说你的目标，让对方定期问你进展',
    ]
    mindshift = '目标最大的敌人不是能力不够，而是「没有紧迫感」。把开始时间定到本周，而不是「有空的时候」。'
  } else {
    nextSteps = [
      '📌 给这条灵感加一个「想做的时间」标签',
      '🔔 设置一个日历提醒，在你想开始的时间弹出来',
      '📚 提前做一点背景研究：比如想学吉他，先看看入门教程有哪些',
    ]
    mindshift = '「改天再做」通常等于「永远不会做」。如果想真的做，就定一个具体的时间点。'
  }

  return {
    title: '把想法变成行动的建议',
    summary: `「${content.slice(0, 30)}...」—— 想法很好，关键是把它从「想」变成「做」。`,
    nextSteps,
    mindshift,
    resources: [
      '《原子习惯》—— 讲如何通过小习惯实现大目标',
      'Notion 目标追踪模板 —— 可以记录和追踪进展',
      '番茄工作法 —— 25分钟专注，5分钟休息，适合开始行动',
    ],
  }
}

function genNoteSuggestion(content, answers) {
  const action = answers[1]?.value

  let nextSteps = []

  if (action === 'remind') {
    nextSteps = [
      '📱 设置一个手机提醒（用系统提醒事项或微信提醒）',
      '📝 趁现在还记得，把更多细节补充到这条灵感里',
      '🔗 搜一下相关关键词，把有用的链接也存下来',
    ]
  } else if (action === 'research') {
    nextSteps = [
      '🔍 用微信搜一搜 / 知乎 / B站 搜你的关键词，看看别人怎么做的',
      '📑 把找到的有用内容截图或链接存到这条灵感里',
      '📒 可以建一个专门的收藏夹 / Notion 页面来整理这类内容',
    ]
  } else {
    nextSteps = [
      '✍️ 现在就把你能想到的细节都写下来，趁还记得',
      '🎨 如果是一个创意想法，可以画个草图或找参考图',
      '💬 跟朋友聊一聊这个想法，别人的反应能帮你判断价值',
    ]
  }

  return {
    title: '关于这条记录的建议',
    summary: `「${content.slice(0, 30)}...」—— 记录下来本身就是第一步，已经很棒了。`,
    nextSteps,
    mindshift: '好记性不如烂笔头。很多人有想法但不记录，过几天就忘了。你现在记下来了，已经超过了大多数人。',
    resources: [
      '微信收藏 —— 可以存文章、图片、链接',
      'Notion / 飞书文档 —— 适合整理系统性的资料',
      '截图 + 相册分类 —— 最简单的信息收集方式',
    ],
  }
}

function genUnsureSuggestion(content, answers) {
  const attraction = answers[1]?.value

  let nextSteps = []

  if (attraction === 'business') {
    nextSteps = [
      '💰 先想清楚：这个想法解决的是什么问题？有人愿意为解决这个问题付钱吗？',
      '🗣️ 找5个潜在用户聊一聊：不用做产品，直接问「你愿意为这个付钱吗」',
      '📈 看看有没有类似的产品已经成功了，他们的商业模式是什么',
    ]
    mindshift = '「有商业价值」和「能赚到钱」是两回事。先验证有没有人愿意付钱，再想怎么赚。'
  } else if (attraction === 'problem') {
    nextSteps = [
      '😤 把自己遇到这个痛点的场景写下来，越具体越好',
      '👥 问问身边的人有没有同样的痛点',
      '🔍 搜一下现在大家是怎么解决这个问题的，为什么体验不好',
    ]
    mindshift = '最好的产品想法来自自己的痛点。因为你自己就是用户，你知道什么体验是糟糕的。'
  } else {
    nextSteps = [
      '💡 把「为什么这个想法很酷」写下来，这会帮你判断它值不值得深入',
      '🎨 如果是创意类的想法，可以画个草图或做个 Moodboard',
      '👥 跟朋友分享一下，看他们的反应——是「哇」还是「哦」',
    ]
    mindshift = '创意想法的价值在于执行。很多人有很酷的想法，但只有极少数人真的去做了。'
  }

  return {
    title: '关于这个想法的建议',
    summary: `「${content.slice(0, 30)}...」—— 想法本身没有对错，关键是你想用它做什么。`,
    nextSteps,
    mindshift: '不用急着下定论。有些想法需要时间沉淀，说不定过几天你会有更清晰的认识。',
    resources: [
      '把想法说出来 —— 跟朋友聊是最好的澄清方式',
      '纸笔 —— 有时候写字比打字更能帮你想清楚',
      '睡一觉 —— 很多想法第二天醒来会有新的角度',
    ],
  }
}

/**
 * 获取开场白（点击按钮后的第一句话）
 */
export function getWelcomeMessage(content) {
  const preview = content.length > 20 ? content.slice(0, 20) + '...' : content
  return {
    emoji: '🤔',
    text: `关于「${preview}」，我想问你几个问题，帮你把想法理清楚～`,
  }
}
