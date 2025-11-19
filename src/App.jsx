import Hero from './components/Hero'
import ChatUI from './components/ChatUI'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative">
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.25),transparent_60%)]" />

      <Hero />

      <main className="relative z-10 -mt-10 md:-mt-16 pb-20">
        <ChatUI />
      </main>

      <footer className="relative z-10 py-8 text-center text-blue-200/60">
        Built for fast model switching across providers
      </footer>
    </div>
  )
}

export default App
