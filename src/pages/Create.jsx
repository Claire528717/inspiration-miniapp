import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { add } from '../utils/storage'
import { TAG_LIST } from '../utils/time'
import { filterFillers } from '../utils/filter'

export default function Create() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [content, setContent] = useState('')
  const [selectedTag, setSelectedTag] = useState('product')
  const [voiceState, setVoiceState] = useState('idle') // idle | recording | processing | done
  const [voiceText, setVoiceText] = useState('')
  const [filterResult, setFilterResult] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)

  // 自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [])

  // ============ 语音识别 ============
  const startVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      // 降级：模拟语音输入
      setVoiceState('recording')
      const phrases = [
        '嗯，那个，我觉得吧，就是说，用户体验这一块其实可以做得更好...',
        '就是，怎么说呢，你可以试着，然后呢加一些微交互，对吧，比如那种很小的动画效果...',
        '反正就是让用户感觉，你知道吗，这个产品很懂他们...',
      ]
      const phrase = phrases[Math.floor(Math.random() * phrases.length)]
      setVoiceText(phrase)

      setTimeout(() => {
        setVoiceState('processing')
        setTimeout(() => {
          const result = filterFillers(phrase)
          setFilterResult(result)
          setContent(result.filtered)
          setVoiceState('done')
        }, 800)
      }, 2000)

      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.interimResults = true
    recognition.continuous = true
    recognition.maxAlternatives = 1

    setVoiceState('recording')
    setVoiceText('')
    setFilterResult(null)

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setVoiceText(transcript)
    }

    recognition.onend = () => {
      setVoiceState('processing')
      setTimeout(() => {
        const finalText = voiceText || '说了点什么但没听太清'
        const result = filterFillers(finalText)
        setFilterResult(result)
        setContent(result.filtered)
        setVoiceState('done')
      }, 600)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setVoiceState('idle')
      alert('语音识别失败，请检查麦克风权限或使用手动输入')
    }

    recognition.start()

    // 最长录音 30 秒
    setTimeout(() => {
      try { recognition.stop() } catch {}
    }, 30000)
  }, [voiceText])

  // ============ 保存 ============
  const handleSave = () => {
    if (!content.trim()) return
    add({
      content: content.trim(),
      tag: selectedTag,
    })
    setLastSaved(content.trim())
    setTimeout(() => {
      navigate('/')
    }, 400)
  }

  const canSave = content.trim().length > 0

  const voiceStatusConfig = {
    idle:    { bar: 'bg-gray-200', text: '点击🎤开始语音记录', inner: '语音识别' },
    recording: {
      bar: 'bg-orange-500',
      text: '正在聆听...请说话',
      inner: (
        <div className="flex items-center justify-center gap-1">
          {[0,1,2,3,4].map(i => (
            <span
              key={i}
              className="inline-block w-1 bg-white rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 16}px`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      ),
    },
    processing: {
      bar: 'bg-purple-500',
      text: '正在识别润色中...',
      inner: (
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay:'0s'}}/>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay:'0.2s'}}/>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay:'0.4s'}}/>
        </div>
      ),
    },
    done: {
      bar: 'bg-green-500',
      text: '口气词已过滤',
      inner: '✓ 识别完成',
    },
  }

  const sc = voiceStatusConfig[voiceState]

  return (
    <div className="min-h-screen bg-gray-50">
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
        <h2 className="text-lg font-semibold text-gray-900">记录灵感</h2>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* 语音状态条 */}
        {voiceState !== 'idle' && (
          <div className={`${sc.bar} rounded-xl px-4 py-2.5 text-white text-sm font-medium text-center transition-all slide-up`}>
            {sc.inner}
          </div>
        )}

        {/* 语音按钮 + 录音区域 */}
        <div className="card p-6 text-center">
          <button
            onClick={startVoice}
            disabled={voiceState === 'recording' || voiceState === 'processing'}
            className={`relative w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              voiceState === 'recording'
                ? 'bg-red-500 scale-110 voice-pulse text-white'
                : voiceState === 'processing'
                  ? 'bg-purple-500 text-white cursor-wait'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200'
            }`}
          >
            {voiceState === 'recording' ? (
              <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm-1 7.93V18H9a1 1 0 010-2h6a1 1 0 010 2h-2v3.93A8.002 8.002 0 014 14a1 1 0 012 0 6 6 0 0012 0 1 1 0 012 0 8.002 8.002 0 01-7 7.93z" />
              </svg>
            ) : voiceState === 'processing' ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
              </svg>
            )}
          </button>
          <p className="text-sm text-gray-400 mt-3">{sc.text}</p>
        </div>

        {/* 实时语音文字（录音中显示） */}
        {voiceState === 'recording' && voiceText && (
          <div className="card p-4 border-orange-200 bg-orange-50/50 slide-up">
            <p className="text-xs text-orange-500 font-medium mb-1">🎙️ 实时识别中...</p>
            <p className="text-gray-700 text-sm leading-relaxed">{voiceText}</p>
          </div>
        )}

        {/* 过滤结果对比 */}
        {filterResult && voiceState === 'done' && (
          <div className="card p-4 border-green-200 bg-green-50/50 slide-up">
            <p className="text-xs text-green-600 font-medium mb-3">✨ 识别完成，口气词已过滤</p>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">原始</p>
                <p className="text-gray-500 text-sm line-through">{filterResult.original}</p>
              </div>
              <div className="border-t border-green-100 pt-3">
                <p className="text-xs text-gray-400 mb-1">润色后</p>
                <p className="text-gray-900 text-sm font-medium">{filterResult.filtered}</p>
              </div>
            </div>

            {filterResult.removed.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {filterResult.removed.map((word) => (
                  <span key={word} className="px-2 py-0.5 bg-red-100 text-red-500 text-xs rounded-full">
                    {word}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => { setFilterResult(null); setVoiceState('idle'); }}
              className="mt-3 text-xs text-green-600 font-medium hover:underline"
            >
              重新录音
            </button>
          </div>
        )}

        {/* 文本输入框 */}
        <div className="card p-4">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的灵感，或者点击上面的🎤语音输入..."
            className="w-full min-h-[120px] resize-none text-gray-700 placeholder-gray-300 text-base leading-relaxed outline-none bg-transparent"
            rows={5}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-xs text-gray-300">{content.length} 字</span>
            {lastSaved && (
              <span className="text-xs text-green-500 animate-pulse">已保存</span>
            )}
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
              ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          保存灵感
        </button>

        <p className="text-center text-xs text-gray-300 pb-8">
          数据仅保存在本地浏览器中
        </p>
      </div>
    </div>
  )
}
