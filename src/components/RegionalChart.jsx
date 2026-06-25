import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { fmtCurrency } from '../utils/dataUtils';

const COLORS = ['#4a6cf7','#00d4ff','#00f5a0','#ffb347','#ff6b9d'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#0f1629', border: '1px solid rgba(74,108,247,0.3)', borderRadius: 10, padding: '10px 14px' }}>
      <p className="text-sm font-display font-600 text-white mb-1">{d.name}</p>
      <p className="text-xs font-mono" style={{ color: '#00f5a0' }}>{fmtCurrency(d.revenue)}</p>
      <p className="text-xs font-mono" style={{ color: '#5a7099' }}>{d.orders} orders</p>
    </div>
  );
};

export default function RegionalChart({ data }) {
  const [view, setView] = useState('pie');

  return (
    <div className="card p-5" style={{ height: 320 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-600 text-white">Revenue by Region</h3>
          <p className="text-xs mt-0.5" style={{ color: '#5a7099' }}>Geographic distribution</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#0a0e1a' }}>
          {['pie','radar'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className="text-xs px-3 py-1.5 rounded-md font-mono transition-all capitalize"
              style={view === v ? { background: '#4a6cf7', color: '#fff' } : { color: '#5a7099' }}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        {view === 'pie' ? (
          <PieChart>
            <Pie data={data} cx="40%" cy="50%" innerRadius={55} outerRadius={90}
              dataKey="revenue" paddingAngle={3} strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8}
              formatter={(v) => <span style={{ color: '#9bb3d8', fontSize: 11, fontFamily: 'Inter' }}>{v}</span>} />
          </PieChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(74,108,247,0.15)" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#7b93c9', fontSize: 10, fontFamily: 'Inter' }} />
            <Radar name="Revenue" dataKey="revenue" stroke="#4a6cf7" fill="#4a6cf7" fillOpacity={0.25} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
