import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll, remove, getStats } from '../utils/storage'
import { getRelativeTime, getTagByKey } from '../utils/time'
import { filterFillers } from '../utils/filter'

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

  const getPlainPreview = (content) => {
    const { filtered } = filterFillers(content)
    return filtered.length > 80 ? filtered.slice(0, 80) + '...' : filtered
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 px-6 pt-12 pb-8 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">💡 灵感速记</h1>
            <p className="text-orange-100 text-sm mt-1">捕捉每一个闪过的想法</p>
          </div>
        </div>
        <div className="flex gap-6 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 flex-1">
            <div className="text-white text-3xl font-bold">{stats.total}</div>
            <div className="text-orange-100 text-xs">总灵感数</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 flex-1">
            <div className="text-white text-3xl font-bold">{stats.today}</div>
            <div className="text-orange-100 text-xs">今日记录</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 mt-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-lg font-medium mb-2">还没有灵感记录</p>
            <p className="text-sm">点击右下角按钮，记录你的第一个灵感吧</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const tag = getTagByKey(item.tag || 'other')
              return (
                <div
                  key={item.id}
                  className="card p-4 slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                        {getPlainPreview(item.content)}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {tag && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${tag.color.split(' ')[1] ? 'white' : 'gray-100'}`}>
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 bg-gradient-to-r ${tag.color}`} />
                            <span className="text-gray-500">{tag.label}</span>
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {getRelativeTime(item.createdAt)}
                        </span>
                        <span className="text-xs text-gray-300">
                          {item.content.length}字
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
            <p className="text-gray-500 text-sm mt-2">删除后无法恢复，确定要删除这条灵感吗？</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
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
