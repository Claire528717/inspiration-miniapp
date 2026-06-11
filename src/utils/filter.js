// ============================================
// 灵感速记 - 口气词过滤引擎
// ============================================

const FILLER_WORDS = [
  // 中文口语填充词
  '嗯', '啊', '哦', '呃', '额', '嘛', '吧',
  '那个', '这个',
  '就是说', '就是', '就是说呢',
  '然后', '然后呢',
  '我觉得', '我觉得吧',
  '反正', '对吧', '不对',
  '你知道吗', '你知道吧',
  '怎么说呢', '怎么说',
  '其实', '其实呢',
  '话说', '话说回来',
  '那什么', '那啥',
  '我想想', '我想一下',
  '这么说吧',
  '应该说', '应该说吧',
  '算了吧', '算了',
  '说到底',
  '某种意义上', '从某种意义上说',
  '讲真的', '讲真', '说真的',
  '说白了',
  '实际上',
  // 重复词
  '就是就是', '那个那个', '然后然后',
  '嗯嗯', '对对', '是是',
  // 英文填充词
  'um', 'uh', 'er', 'ah', 'hmm', 'mm',
  'like', 'you know', 'i mean',
  'sort of', 'kind of', 'kinda', 'sorta',
  'well', 'so', 'actually', 'basically',
  'literally', 'honestly', 'frankly',
  'right', 'okay', 'ok', 'yeah',
];

// 按长度降序排列，确保长词优先匹配
const SORTED_WORDS = [...FILLER_WORDS].sort((a, b) => b.length - a.length);

export function filterFillers(text) {
  let result = text;
  const removed = [];

  for (const word of SORTED_WORDS) {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = result.match(regex);
    if (matches) {
      removed.push(...matches);
      result = result.replace(regex, '');
    }
  }

  // 清理多余标点
  result = result
    .replace(/[，,]\s*[，,]/g, '，')
    .replace(/[。.]\s*[。.]/g, '。')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[，,。.\s]+/, '')
    .replace(/[，,。.\s]+$/, '')
    .trim();

  // 句子开头大写
  if (result.length > 0) {
    result = result[0].toUpperCase() + result.slice(1);
  }

  return {
    original: text,
    filtered: result,
    removed: [...new Set(removed.map((w) => w.toLowerCase()))],
  };
}
