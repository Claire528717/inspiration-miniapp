import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll, remove, getStats } from '../utils/storage'
import { getRelativeTime, getTagByKey } from '../utils/time'

export default function Home() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0 })
  const [deleteId, setDeleteId] = useState(null)

  const loadData = useCallback(() => {
    setItems(getAll())
    setStats(getStats())
  }, [])

  useEffect(() => {
    loadData()
    const onFocus = () => loadData()
    window.addEventListener('focus', onFocus)
    window.addEventListener('storage', loadData)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('storage', loadData)
    }
  }, [loadData])

  const handleDelete = (id) => {
    remove(id)
    setDeleteId(null)
    loadData()
  }

  const getPreview = (content) =>
    content.length > 80 ? content.slice(0, 80) + '...' : content

  return (
    <div className="relative min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 px-5 pt-14 pb-8 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">💡 灵感速记</h1>
            <p className="text-orange-100 text-sm mt-0.5">捕捉每一个闪过的想法</p>
          </div>
        </div>
        <div className="flex gap-4 mt-5">
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 flex-1">
            <div className="text-white text-3xl font-bold">{stats.total}</div>
            <div className="text-orange-100 text-xs mt-0.5">总灵感数</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 flex-1">
            <div className="text-white text-3xl font-bold">{stats.today}</div>
            <div className="text-orange-100 text-xs mt-0.5">今日记录</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-28 mt-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-base font-medium mb-1">还没有灵感记录</p>
            <p className="text-sm">点击右下角 + 记录你的第一个想法</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const tag = getTagByKey(item.tag || 'other')
              return (
                <div
                  key={item.id}
                  className="card p-4 slide-up active:scale-[0.99] transition-transform"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* 点击主体区域进入编辑 */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/edit/${item.id}`)}
                  >
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {getPreview(item.content)}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      {tag && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100">
                          <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${tag.color}`} />
                          <span className="text-xs text-gray-500">{tag.label}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {getRelativeTime(item.createdAt)}
                      </span>
                      {item.updatedAt && (
                        <span className="text-xs text-blue-300">已编辑</span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮行 */}
                  <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => navigate(`/edit/${item.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/create')} className="fab select-none">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 删除确认弹窗 */}
      {deleteId && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900">确认删除</h3>
            <p className="text-gray-500 text-sm mt-2">删除后无法恢复，确定要删除这条灵感吗？</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
