// ============================================
// 灵感速记 - 本地存储工具
// ============================================

const STORAGE_KEY = 'inspirations';

export function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function add(item) {
  const list = getAll();
  const newItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: Date.now(),
  };
  list.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newItem;
}

export function remove(id) {
  const list = getAll().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getStats() {
  const list = getAll();
  const today = new Date().toDateString();
  return {
    total: list.length,
    today: list.filter((item) => new Date(item.createdAt).toDateString() === today).length,
  };
}
