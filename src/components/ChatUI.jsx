import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Send, Bot, User, KeyRound, RefreshCcw } from 'lucide-react'

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
]

const OPENAI_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-3.5-turbo']
const ANTHROPIC_MODELS = ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']

function ChatUI() {
  const [provider, setProvider] = useState('openai')
  const [model, setModel] = useState(OPENAI_MODELS[0])
  const [apiKey, setApiKey] = useState('')
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'assistant', content: 'Hi! Ask me anything, and you can switch models from the top toolbar.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollerRef = useRef(null)

  useEffect(() => {
    if (provider === 'openai') setModel(OPENAI_MODELS[0])
    if (provider === 'anthropic') setModel(ANTHROPIC_MODELS[0])
  }, [provider])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || loading) return
    if (!apiKey) {
      alert('Please paste an API key for the selected provider.')
      return
    }

    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, api_key: apiKey, messages: newMessages }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText)
      }
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content ?? '' }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${e?.message || 'Unknown error'}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'system', content: 'You are a helpful AI assistant.' }])
  }

  const models = provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS

  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 md:px-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 text-blue-200/80">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">Chat</span>
            </div>
            <div className="hidden md:block w-px h-5 bg-white/10" />
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="bg-slate-800/80 text-blue-100 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-800/80 text-blue-100 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-none md:w-[340px] flex items-center gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-blue-200/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Paste ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
                type="password"
                className="w-full pl-9 pr-3 py-2 text-sm rounded bg-slate-800/80 border border-white/10 text-blue-100 placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-slate-800/80 text-blue-100 border border-white/10 hover:bg-slate-700/70 transition"
              title="Clear chat"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="h-[46vh] md:h-[52vh] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          {messages.filter(m => m.role !== 'system').map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="flex items-start gap-3 text-blue-100/90">
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm animate-pulse">Thinking…</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-end gap-2 p-4 bg-slate-900/60 border-t border-white/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={2}
            placeholder="Type a message…"
            className="flex-1 resize-none rounded-xl bg-slate-800/80 border border-white/10 text-blue-100 placeholder:text-blue-200/50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </section>
  )
}

function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse text-right' : ''}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full border ${isUser ? 'bg-blue-500/20 border-blue-400/30' : 'bg-indigo-500/20 border-indigo-400/30'} flex items-center justify-center` }>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bg-blue-500/10 border border-blue-400/20 text-blue-50' : 'bg-white/5 border border-white/10 text-blue-100'}`}>
        {content}
      </div>
    </div>
  )
}

export default ChatUI
