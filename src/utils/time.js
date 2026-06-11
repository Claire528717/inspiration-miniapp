// ============================================
// 灵感速记 - 相对时间格式化
// ============================================

export function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return '刚刚';
  if (seconds < 60) return `${seconds}秒前`;
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const date = new Date(timestamp);
  const nowDate = new Date();

  if (date.getFullYear() === nowDate.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export const TAG_LIST = [
  { key: 'product', label: '产品想法', color: 'from-blue-400 to-blue-600' },
  { key: 'tech', label: '技术方案', color: 'from-purple-400 to-purple-600' },
  { key: 'life', label: '生活灵感', color: 'from-green-400 to-green-600' },
  { key: 'writing', label: '写作灵感', color: 'from-pink-400 to-pink-600' },
  { key: 'work', label: '工作备忘', color: 'from-amber-400 to-amber-600' },
  { key: 'other', label: '其他', color: 'from-gray-400 to-gray-600' },
];

export function getTagByKey(key) {
  return TAG_LIST.find((t) => t.key === key);
}
