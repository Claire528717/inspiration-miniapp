import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll, remove, getStats } from '../utils/storage'
import { getRelativeTime, getTagByKey } from '../utils/time'
import { getNextStep, getWelcomeMessage } from '../utils/recommend'

export default function Home() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0 })
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null) // { message, type }

  // ── 对话状态 ────────────────────────────────
  const [chatItem, setChatItem] = useState(null)       // 当前对话的灵感
  const [chatStep, setChatStep] = useState('welcome') // welcome | question | suggestion
  const [answers, setAnswers] = useState([])           // 用户回答历史
  const [currentQ, setCurrentQ] = useState(null)       // 当前问题
  const [inputValue, setInputValue] = useState('')     // 文本题输入
  const [suggestion, setSuggestion] = useState(null)    // 最终建议
  const [isTyping, setIsTyping] = useState(false)       // AI 思考动画
  const chatBodyRef = useRef(null)

  const loadData = useCallback(() => {
    setItems(getAll())
    setStats(getStats())
  }, [])

  useEffect(() => {
    loadData()
    // 检查是否有保存成功的 Toast 通知
    const toastMsg = localStorage.getItem('inspiration-toast')
    if (toastMsg) {
      localStorage.removeItem('inspiration-toast')
      setToast({ message: toastMsg, type: 'success' })
      setTimeout(() => setToast(null), 2500)
    }
    const onFocus = () => loadData()
    window.addEventListener('focus', onFocus)
    window.addEventListener('storage', loadData)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('storage', loadData)
    }
  }, [loadData])

  // 自动滚动对话区到底部
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [chatStep, currentQ, isTyping, suggestion])

  // ── 开始对话 ────────────────────────────────
  const handleAskAI = (item) => {
    setChatItem(item)
    setAnswers([])
    setSuggestion(null)
    setInputValue('')
    setChatStep('welcome')

    // 0.6秒后显示第一个问题
    setTimeout(() => {
      const firstQ = getNextStep({ content: item.content, tag: item.tag, answers: [] })
      setCurrentQ(firstQ.data)
      setChatStep('question')
    }, 600)
  }

  // ── 用户回答了一道选择题 ─────────────────────
  const handleChoose = (option) => {
    const newAnswers = [...answers, {
      question: currentQ.question,
      answer: option.label,
      value: option.value,
    }]
    setAnswers(newAnswers)
    setInputValue('')

    // 显示「思考中」动画
    setIsTyping(true)
    setChatStep('typing')

    setTimeout(() => {
      const next = getNextStep({
        content: chatItem.content,
        tag: chatItem.tag,
        answers: newAnswers,
      })

      if (next.type === 'question') {
        setCurrentQ(next.data)
        setChatStep('question')
      } else {
        setSuggestion(next.data)
        setChatStep('suggestion')
      }
      setIsTyping(false)
    }, 800)
  }

  // ── 用户提交文本题 ────────────────────────────
  const handleInputSubmit = () => {
    if (!inputValue.trim()) return

    const newAnswers = [...answers, {
      question: currentQ.question,
      answer: inputValue.trim(),
      value: 'text',
    }]
    setAnswers(newAnswers)
    setInputValue('')
    setIsTyping(true)
    setChatStep('typing')

    setTimeout(() => {
      const next = getNextStep({
        content: chatItem.content,
        tag: chatItem.tag,
        answers: newAnswers,
      })

      if (next.type === 'question') {
        setCurrentQ(next.data)
        setChatStep('question')
      } else {
        setSuggestion(next.data)
        setChatStep('suggestion')
      }
      setIsTyping(false)
    }, 800)
  }

  // ── 关闭弹窗 ────────────────────────────────
  const closeChat = () => {
    setChatItem(null)
    setChatStep('welcome')
    setAnswers([])
    setCurrentQ(null)
    setSuggestion(null)
    setInputValue('')
  }

  const handleDelete = (id) => {
    remove(id)
    setDeleteId(null)
    loadData()
  }

  const getPreview = (content) =>
    content.length > 80 ? content.slice(0, 80) + '...' : content

  // ── 对话气泡组件 ────────────────────────────
  const ChatBubble = ({ role, children }) => (
    <div className={`flex ${role === 'ai' ? 'justify-start' : 'justify-end'} mb-3`}>
      {role === 'ai' && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs mr-2 shrink-0 mt-1">
          ✨
        </div>
      )}
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          role === 'ai'
            ? 'bg-gray-100 text-gray-800 rounded-tl-md'
            : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-tr-md'
        }`}
      >
        {children}
      </div>
      {role === 'user' && (
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 text-xs ml-2 shrink-0 mt-1">
          👤
        </div>
      )}
    </div>
  )

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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
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

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
          <div className="bg-green-500 text-white px-5 py-2.5 rounded-2xl shadow-lg text-sm font-medium">
            {toast.message}
          </div>
        </div>
      )}

      {/* ── 创意 FAB：灵感捕捉器 ───────────────────── */}
      <div className="fab-wrapper select-none">
        {/* 呼吸光晕环 */}
        <div className="fab-glow-ring" />

        {/* 环绕粒子 */}
        <div className="fab-particle" />
        <div className="fab-particle" />
        <div className="fab-particle" />

        {/* 主按钮 */}
        <button
          className="fab-btn"
          onClick={(e) => {
            // 点击波纹
            const rect = e.currentTarget.getBoundingClientRect()
            const ripple = document.createElement('div')
            ripple.className = 'fab-ripple'
            ripple.style.left = '50%'
            ripple.style.top = '50%'
            ripple.style.marginLeft = '-5px'
            ripple.style.marginTop = '-5px'
            e.currentTarget.appendChild(ripple)
            setTimeout(() => ripple.remove(), 700)

            // 导航
            navigate('/create')
          }}
        >
          {/* 星星图标 */}
          <svg className="fab-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" />
            <circle cx="19.5" cy="4.5" r="1.2" fill="currentColor" stroke="none" opacity="0.6" />
            <circle cx="21" cy="8" r="0.8" fill="currentColor" stroke="none" opacity="0.4" />
            <circle cx="4.5" cy="19.5" r="1" fill="currentColor" stroke="none" opacity="0.5" />
            <circle cx="3" cy="16" r="0.7" fill="currentColor" stroke="none" opacity="0.35" />
          </svg>

          {/* 文字标签 */}
          <span className="fab-btn-label">新建灵感</span>
        </button>
      </div>

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

      {/* 「如何实现呢」对话弹窗 */}
      {chatItem && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
          onClick={closeChat}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">聊聊这个想法</h3>
                <p className="text-xs text-gray-400 truncate">
                  「{chatItem.content.slice(0, 20)}...」
                </p>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 对话内容区 */}
            <div
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
              style={{ minHeight: '300px', maxHeight: '55vh' }}
            >
              {/* 欢迎语 */}
              <ChatBubble role="ai">
                <span className="text-base mr-1.5">🤔</span>
                {getWelcomeMessage(chatItem.content).text}
              </ChatBubble>

              {/* 用户回答历史 */}
              {answers.map((a, i) => (
                <ChatBubble key={i} role="user">{a.answer}</ChatBubble>
              ))}

              {/* 思考中动画 */}
              {chatStep === 'typing' && (
                <ChatBubble role="ai">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </ChatBubble>
              )}

              {/* 问题展示 */}
              {chatStep === 'question' && currentQ && (
                <ChatBubble role="ai">
                  <div>
                    <p className="mb-3">{currentQ.question}</p>
                    {currentQ.type === 'choice' && (
                      <div className="space-y-2">
                        {currentQ.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleChoose(opt)}
                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
                          >
                            <span className="font-medium">{opt.label}</span>
                            {opt.hint && (
                              <span className="block text-xs text-gray-400 mt-0.5">{opt.hint}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {currentQ.type === 'input' && (
                      <div>
                        {currentQ.question.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'text-xs text-gray-500 mt-1' : ''}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </ChatBubble>
              )}

              {/* 最终建议 */}
              {chatStep === 'suggestion' && suggestion && (
                <ChatBubble role="ai">
                  <div className="w-[260px]">
                    <p className="font-semibold text-purple-800 mb-2">{suggestion.title}</p>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.summary}</p>

                    <div className="bg-purple-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-purple-500 font-medium mb-1.5">💡 核心思路</p>
                      <p className="text-sm text-purple-700 leading-relaxed">{suggestion.mindshift}</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-400 font-medium mb-1.5">✅ 推荐下一步</p>
                      <div className="space-y-1.5">
                        {suggestion.nextSteps.map((step, i) => (
                          <p key={i} className="text-xs text-gray-600 leading-relaxed">{step}</p>
                        ))}
                      </div>
                    </div>

                    {suggestion.resources && (
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1.5">📚 延伸参考</p>
                        <div className="space-y-1">
                          {suggestion.resources.map((r, i) => (
                            <p key={i} className="text-xs text-gray-500">{r}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ChatBubble>
              )}
            </div>

            {/* 底部输入区（文本题型时显示） */}
            {chatStep === 'question' && currentQ?.type === 'input' && (
              <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleInputSubmit()
                    }
                  }}
                  placeholder={currentQ.placeholder || '写下你的想法...'}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 leading-relaxed"
                />
                <button
                  onClick={handleInputSubmit}
                  disabled={!inputValue.trim()}
                  className="shrink-0 w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            )}

            {/* 建议页底部操作 */}
            {chatStep === 'suggestion' && (
              <div className="px-5 py-3 border-t border-gray-100 flex gap-3">
                <button
                  onClick={closeChat}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  知道了
                </button>
                <button
                  onClick={() => {
                    // 重新开始对话
                    setAnswers([])
                    setSuggestion(null)
                    setInputValue('')
                    setChatStep('welcome')
                    setTimeout(() => {
                      const firstQ = getNextStep({ content: chatItem.content, tag: chatItem.tag, answers: [] })
                      setCurrentQ(firstQ.data)
                      setChatStep('question')
                    }, 600)
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                >
                  再聊一次
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
