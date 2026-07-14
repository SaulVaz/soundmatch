import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Contribution {
  feature: string
  value: number
}

interface Props {
  contributions: Contribution[]
  trackName: string
}

export default function ExplainChart({ contributions, trackName }: Props) {
  const colors = ['#1db954', '#1aa34a', '#158f40', '#107a36', '#0b662c', '#065122']

  return (
    <div className="bg-[#161616] rounded-xl p-4 mt-2">
      <p className="text-white text-xs font-semibold mb-3">
        ¿Por qué <span className="text-[#1db954]">{trackName}</span>?
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={contributions}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 1]} tick={{ fill: '#555', fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fill: '#aaa', fontSize: 11 }}
            width={120}
          />
          <Tooltip
            formatter={(value: unknown) => [`${Math.round((value as number) * 100)}%`, 'Peso']}
            contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {contributions.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}