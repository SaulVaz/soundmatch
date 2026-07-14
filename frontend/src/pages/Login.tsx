import { loginUrl } from '../services/api'

export default function Login() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full top-[-150px] left-[-150px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.10) 0%, transparent 70%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.07) 0%, transparent 70%)' }} />

      <p className="text-[#1db954] text-xs font-semibold tracking-widest uppercase mb-4">SoundMatch</p>
      <h1 className="text-white text-5xl font-bold text-center tracking-tight mb-3">
        Tu música,<br />recomendada para ti
      </h1>
      <p className="text-[#555] text-base text-center mb-10">
        Conecta tu Spotify y descubre canciones que no sabías que necesitabas
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-lg">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-[#0d2818] flex items-center justify-center mb-3">
            <i className="ti ti-music text-[#1db954]" style={{ fontSize: 18 }} />
          </div>
          <p className="text-white text-sm font-medium mb-1">Recomendaciones reales</p>
          <p className="text-[#555] text-xs leading-relaxed">Basadas en tus 50 canciones más escuchadas</p>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-[#0d2818] flex items-center justify-center mb-3">
            <i className="ti ti-chart-bar text-[#1db954]" style={{ fontSize: 18 }} />
          </div>
          <p className="text-white text-sm font-medium mb-1">Explicabilidad</p>
          <p className="text-[#555] text-xs leading-relaxed">Entiende por qué se recomienda cada canción</p>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-[#0d2818] flex items-center justify-center mb-3">
            <i className="ti ti-search text-[#1db954]" style={{ fontSize: 18 }} />
          </div>
          <p className="text-white text-sm font-medium mb-1">Busca y descubre</p>
          <p className="text-[#555] text-xs leading-relaxed">Encuentra canciones similares a las que ya te gustan</p>
        </div>
      </div>

      <a
        href={loginUrl}
        className="flex items-center gap-3 bg-[#1db954] hover:bg-[#1aa34a] text-black font-bold text-base px-8 py-4 rounded-full transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        Conectar con Spotify
      </a>
      <p className="text-[#333] text-xs mt-4">Solo lectura — nunca modificamos tu cuenta</p>
    </div>
  )
}