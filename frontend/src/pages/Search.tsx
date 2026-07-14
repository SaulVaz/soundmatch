import { useState } from 'react'
import { searchTracks, recommendByTrack } from '../services/api'
import TrackCard from '../components/TrackCard'
import { useNavigate } from 'react-router-dom'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  popularity?: number
  similarity_score?: number
}

export default function Search() {
  const token = localStorage.getItem('spotify_token') || ''
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [recommendations, setRecommendations] = useState<Track[]>([])
  const [selected, setSelected] = useState<Track | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const tracks = await searchTracks(token, query)
      setResults(tracks)
      setSelected(null)
      setRecommendations([])
    } catch (error) {
      console.error(error)
    } finally {
      setSearching(false)
    }
  }

  const handleSelect = async (track: Track) => {
    setSelected(track)
    setResults([])
    setLoading(true)
    try {
      const recs = await recommendByTrack(token, track.id)
      setRecommendations(recs)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] rounded-full top-[-100px] right-[-100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 70%)' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full bottom-[-80px] left-[-80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.04) 0%, transparent 70%)' }} />

      <nav className="bg-[#111] border-b border-[#1f1f1f] px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-[#1db954] text-lg font-bold tracking-tight">SoundMatch</span>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[#666] hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-1"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Buscar canciones</h1>
        <p className="text-[#555] text-sm mb-6">Busca una canción y descubre música nueva similar</p>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Busca un artista o canción..."
            className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#1db954] transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-[#1db954] hover:bg-[#1aa34a] disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mb-6">
            <p className="text-[#555] text-xs mb-3">Selecciona una canción para ver recomendaciones</p>
            <div className="flex flex-col gap-2">
              {results.map(track => (
                <div
                  key={track.id}
                  onClick={() => handleSelect(track)}
                  className="cursor-pointer rounded-xl transition-colors"
                >
                  <TrackCard track={track} />
                </div>
              ))}
            </div>
          </div>
        )}

        {selected && (
          <div>
            <div className="bg-[#161616] rounded-xl p-4 mb-6 flex items-center gap-4 border border-[#1db954]">
              <img src={selected.image} alt={selected.album} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="text-white font-semibold">{selected.name}</p>
                <p className="text-[#666] text-sm">{selected.artist}</p>
              </div>
              <button
                onClick={() => { setSelected(null); setRecommendations([]); setQuery('') }}
                className="ml-auto text-[#555] hover:text-white text-sm"
              >
                ✕ Cambiar
              </button>
            </div>

            {loading ? (
              <p className="text-[#666] text-sm">Buscando canciones similares...</p>
            ) : (
              <div>
                <p className="text-white text-sm font-semibold mb-4">
                  Canciones similares <span className="text-[#555] font-normal text-xs ml-1">Que quizás no conoces</span>
                </p>
                <div className="flex flex-col gap-2">
                  {recommendations.map((track, index) => (
                    <TrackCard key={track.id} track={track} showScore animationDelay={index * 50} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}