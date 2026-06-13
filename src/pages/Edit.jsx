import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getById, update } from '../utils/storage'
import { TAG_LIST } from '../utils/time'

export default function Edit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const inputRef = useRef(null)

  const [content, setContent] = useState('')
  const [selectedTag, setSelectedTag] = useState('other')
  const [saved, setSaved] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const item = getById(id)
    if (!item) {
      setNotFound(true)
      return
    }
    setContent(item.content)
    setSelectedTag(item.tag || 'other')
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [id])

  const handleSave = () => {
    if (!content.trim()) return
    update(id, { content: content.trim(), tag: selectedTag })
    setSaved(true)
    setTimeout(() => navigate('/'), 500)
  }

  const canSave = content.trim().length > 0

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full text-gray-400 py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-base font-medium mb-4">找不到这条灵感</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 flex-1">编辑灵感</h2>
        {saved && (
          <span className="text-xs text-green-500 font-medium fade-in">✓ 已保存</span>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* 文本编辑区 */}
        <div className="card p-4">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的灵感..."
            className="w-full min-h-[160px] resize-none text-gray-700 placeholder-gray-300 text-base leading-relaxed outline-none bg-transparent"
            rows={6}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-xs text-gray-300">{content.length} 字</span>
            <button
              onClick={() => setContent('')}
              className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        {/* 标签选择 */}
        <div>
          <p className="text-xs text-gray-400 mb-2 ml-1">分类标签</p>
          <div className="flex flex-wrap gap-2">
            {TAG_LIST.map((tag) => (
              <button
                key={tag.key}
                onClick={() => setSelectedTag(tag.key)}
                className={`tag ${selectedTag === tag.key ? 'tag-active' : 'tag-inactive'}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-200 ${
            canSave
              ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          保存修改
        </button>

        <p className="text-center text-xs text-gray-300 pb-6">
          修改将覆盖原有内容
        </p>
      </div>
    </div>
  )
}
