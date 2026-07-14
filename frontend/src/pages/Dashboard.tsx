import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getRecommendations, getTopTracks, getUserProfile, getRecentTracks } from '../services/api'
import TrackCard from '../components/TrackCard'
import { DashboardSkeleton } from '../components/Skeleton'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  similarity_score?: number
}

interface UserProfile {
  name: string
  email: string
  image: string | null
  followers: number
  country: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [searchParams] = useSearchParams()
  const [topTracks, setTopTracks] = useState<Track[]>([])
  const [recommendations, setRecommendations] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [recentTracks, setRecentTracks] = useState<Track[]>([])
  const token = searchParams.get('token') || localStorage.getItem('spotify_token') || ''

  useEffect(() => {
    if (!token) return
    localStorage.setItem('spotify_token', token)

    const cachedTracks = localStorage.getItem('cached_top_tracks')
    const cachedRecs = localStorage.getItem('cached_recommendations')
    const cachedUser = localStorage.getItem('cached_user')

    if (cachedTracks && cachedRecs && cachedUser) {
      setTopTracks(JSON.parse(cachedTracks))
      setRecommendations(JSON.parse(cachedRecs))
      setUser(JSON.parse(cachedUser))
      setLoading(false)
      return
    }

    setLoading(true)
    const fetchData = async () => {
      try {
        const [tracks, recs, profile] = await Promise.all([
          getTopTracks(token),
          getRecommendations(token),
          getUserProfile(token)
        ])
        setTopTracks(tracks)
        setRecommendations(recs)
        setUser(profile)
        localStorage.setItem('cached_top_tracks', JSON.stringify(tracks))
        localStorage.setItem('cached_recommendations', JSON.stringify(recs))
        localStorage.setItem('cached_user', JSON.stringify(profile))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    fetchData()

    try {
      getRecentTracks(token).then(recent => {
        setRecentTracks(recent)
        })
    } catch (error) {
      console.error('Historial no disponible:', error)
    }
  }, [token, refreshKey])

  if (loading) return <DashboardSkeleton />

  const avgScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((a, b) => a + (b.similarity_score || 0), 0) / recommendations.length * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <nav className="bg-[#111] border-b border-[#1f1f1f] px-6 py-3 flex items-center justify-between">
        <span className="text-[#1db954] text-lg font-bold tracking-tight">SoundMatch</span>
        <div className="flex items-center gap-3">
          <a href="/search"
            className="text-[#666] hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Buscar
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('cached_top_tracks')
              localStorage.removeItem('cached_recommendations')
              localStorage.removeItem('cached_user')
              setRefreshing(true)
              setRefreshKey(k => k + 1)
            }}
            disabled={refreshing}
            className="text-[#666] hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
          >
            {refreshing ? '↻ Cargando...' : '↻ Refrescar'}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('spotify_token')
              localStorage.removeItem('cached_top_tracks')
              localStorage.removeItem('cached_recommendations')
              localStorage.removeItem('cached_user')
              window.location.href = '/'
            }}
            className="text-[#666] hover:text-[#ff4444] text-sm px-3 py-1 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Cerrar sesión
          </button>
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black text-xs font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
          )}
          <span className="text-[#aaa] text-sm">{user?.name || 'Mi perfil'}</span>
        </div>
      </nav>

      <div className="px-6 py-6 border-b border-[#1a1a1a]">
        <h1 className="text-white text-2xl font-bold mb-1">
          Bienvenido de vuelta, {user?.name?.split(' ')[0] || 'Saúl'}
        </h1>
        <p className="text-[#666] text-sm">Basado en tus últimas 50 canciones escuchadas</p>
      </div>

      <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-[#1a1a1a]">
        <div className="bg-[#161616] rounded-xl p-4">
          <p className="text-[#555] text-xs mb-1">Canciones analizadas</p>
          <p className="text-white text-2xl font-bold">{topTracks.length}</p>
        </div>
        <div className="bg-[#161616] rounded-xl p-4">
          <p className="text-[#555] text-xs mb-1">Recomendaciones</p>
          <p className="text-[#1db954] text-2xl font-bold">{recommendations.length}</p>
        </div>
        <div className="bg-[#161616] rounded-xl p-4">
          <p className="text-[#555] text-xs mb-1">Match promedio</p>
          <p className="text-[#1db954] text-2xl font-bold">{avgScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-[#1a1a1a]">
        <div className="px-6 py-5">
          <p className="text-white text-sm font-semibold mb-4">
            Tus favoritas <span className="text-[#555] font-normal text-xs ml-1">Top 10</span>
          </p>
          <div className="flex flex-col gap-1">
            {topTracks.slice(0, 10).map((track, index) => (
              <TrackCard key={track.id} track={track} index={index + 1} animationDelay={index * 50} />
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-white text-sm font-semibold mb-4">
            Recomendaciones <span className="text-[#555] font-normal text-xs ml-1">Para ti</span>
          </p>
          <div className="flex flex-col gap-1">
            {recommendations.map((track, index) => (
              <TrackCard key={track.id} track={track} showScore animationDelay={index * 50} />
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-5 border-t border-[#1a1a1a]">
      <p className="text-white text-sm font-semibold mb-4">
        Historial reciente <span className="text-[#555] font-normal text-xs ml-1">Últimas 20</span>
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {recentTracks.map((track, index) => (
          <div key={`${track.id}-${index}`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#161616] transition-colors">
            <img
              src={track.image}
              alt={track.album}
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{track.name}</p>
              <p className="text-[#666] text-xs truncate">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}