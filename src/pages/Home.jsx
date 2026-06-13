import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll, remove, getStats } from '../utils/storage'
import { getRelativeTime, getTagByKey } from '../utils/time'
import { getRecommendations } from '../utils/recommend'

export default function Home() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0 })
  const [deleteId, setDeleteId] = useState(null)
  const [aiItem, setAiItem] = useState(null)          // 当前正在请求 AI 建议的灵感
  const [aiReply, setAiReply] = useState(null)         // AI 返回的建议
  const [aiTyping, setAiTyping] = useState(false)      // 打字机加载中
  const aiTimer = useRef(null)

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
      if (aiTimer.current) clearTimeout(aiTimer.current)
    }
  }, [loadData])

  const handleDelete = (id) => {
    remove(id)
    setDeleteId(null)
    loadData()
  }

  const handleAskAI = (item) => {
    setAiItem(item)
    setAiTyping(true)
    setAiReply(null)
    // 模拟 AI 思考延迟
    aiTimer.current = setTimeout(() => {
      const result = getRecommendations(item.content, item.tag || '')
      setAiReply(result)
      setAiTyping(false)
    }, 1200)
  }

  const closeAI = () => {
    setAiItem(null)
    setAiReply(null)
    setAiTyping(false)
    if (aiTimer.current) clearTimeout(aiTimer.current)
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
                      onClick={() => handleAskAI(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      如何实现呢
                    </button>
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

      {/* AI 建议弹窗 */}
      {aiItem && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
          onClick={closeAI}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900">AI 实现建议</h3>
                  <p className="text-xs text-gray-400 truncate">{aiItem.content.slice(0, 40)}...</p>
                </div>
                <button
                  onClick={closeAI}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="px-5 py-4 pb-8">
              {aiTyping ? (
                /* 加载动画 */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-gray-400">AI 正在分析你的灵感...</p>
                </div>
              ) : aiReply ? (
                /* AI 回复 */
                <div>
                  {/* 分析摘要 */}
                  <div className="bg-purple-50 rounded-2xl p-4 mb-5">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5">🤖</span>
                      <div>
                        <p className="text-sm font-semibold text-purple-800 mb-1">{aiReply.title}</p>
                        <p className="text-sm text-purple-700 leading-relaxed">{aiReply.analysis}</p>
                      </div>
                    </div>
                  </div>

                  {/* 方案列表 */}
                  <div className="space-y-4">
                    {aiReply.approaches.map((app, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-2xl p-4 hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-600 text-xs font-bold">
                            {idx === 0 ? '⭐ 推荐' : `方案 ${idx + 1}`}
                          </span>
                          <span className="text-xs text-gray-400">预计 {app.effort}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mb-1">{app.name}</h4>
                        <p className="text-xs text-gray-400 mb-2">{app.stack}</p>
                        <p className="text-sm text-gray-600 mb-3">{app.desc}</p>
                        <div className="bg-gray-50 rounded-xl p-3 mb-2">
                          <p className="text-xs text-gray-400 mb-1.5">📋 实现步骤</p>
                          <ol className="space-y-1">
                            {app.steps.map((s, si) => (
                              <li key={si} className="text-xs text-gray-600 flex gap-2">
                                <span className="text-purple-400 font-bold shrink-0">{si + 1}.</span>
                                {s}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          💡 {app.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
