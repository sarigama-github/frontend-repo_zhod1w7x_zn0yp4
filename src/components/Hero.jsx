import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-950 pointer-events-none"></div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-blue-200/80 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Futuristic AI Chat Interface
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_6px_30px_rgba(124,58,237,0.35)]">
          Multi-Model. Multi-API. One Chat.
        </h1>
        <p className="mt-4 max-w-2xl text-blue-100/90 text-sm sm:text-base">
          Seamlessly switch providers, models, and keys on the fly—keep the same conversation and explore different intelligences.
        </p>
      </div>
    </section>
  )
}

export default Hero
