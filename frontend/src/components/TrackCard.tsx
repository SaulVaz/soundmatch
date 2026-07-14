import { useState } from 'react'
import ExplainChart from './ExplainChart'

interface Contribution {
  feature: string
  value: number
}

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  similarity_score?: number
  contributions?: Contribution[]
}

interface Props {
  track: Track
  index?: number
  showScore?: boolean
  animationDelay?: number
}

export default function TrackCard({ track, index, showScore, animationDelay = 0 }: Props) {
  const [expanded, setExpanded] = useState(false)

return (
    <div
      className="rounded-lg overflow-hidden fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className="flex items-center gap-3 px-3 py-2 hover:bg-[#161616] transition-colors cursor-pointer group"
        onClick={() => showScore && track.contributions && setExpanded(!expanded)}
      >
        {index && (
          <span className="text-[#444] text-xs w-4 text-right flex-shrink-0">{index}</span>
        )}
        <img
          src={track.image}
          alt={track.album}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate group-hover:text-[#1db954] transition-colors duration-200">{track.name}</p>
          <p className="text-[#666] text-xs truncate">{track.artist}</p>
        </div>
        {showScore && track.similarity_score && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#0d2818] rounded-md px-2 py-1 group-hover:bg-[#1db954] transition-colors duration-200">
              <span className="text-[#1db954] text-xs font-bold group-hover:text-black transition-colors duration-200">
                {Math.round(track.similarity_score * 100)}%
              </span>
            </div>
            {track.contributions && (
              <span className="text-[#444] text-xs">
                {expanded ? '▲' : '▼'}
              </span>
            )}
          </div>
        )}
      </div>
      {expanded && track.contributions && (
        <div className="px-3 pb-2">
          <ExplainChart contributions={track.contributions} trackName={track.name} />
        </div>
      )}
    </div>
  )
}