import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmtCurrency } from '../utils/dataUtils';

const COLORS = ['#4a6cf7','#00d4ff','#00f5a0','#ffb347','#ff6b9d','#a855f7','#f59e0b','#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#0f1629', border: '1px solid rgba(74,108,247,0.3)', borderRadius: 10, padding: '10px 14px' }}>
      <p className="text-sm font-display font-600 text-white mb-1">{d.name}</p>
      <p className="text-xs font-mono" style={{ color: '#00f5a0' }}>Revenue: {fmtCurrency(d.revenue)}</p>
      <p className="text-xs font-mono" style={{ color: '#00d4ff' }}>Orders: {d.orders}</p>
      <p className="text-xs font-mono" style={{ color: '#ffb347' }}>Units: {d.units}</p>
    </div>
  );
};

export default function TopProductsChart({ data }) {
  const [metric, setMetric] = useState('revenue');
  const top = data.slice(0, 8);

  const tabs = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'orders',  label: 'Orders' },
    { key: 'units',   label: 'Units' },
  ];

  return (
    <div className="card p-5" style={{ height: 320 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-600 text-white">Top Products</h3>
          <p className="text-xs mt-0.5" style={{ color: '#5a7099' }}>Ranked by selected metric</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#0a0e1a' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setMetric(t.key)}
              className="text-xs px-3 py-1.5 rounded-md font-mono transition-all"
              style={metric === t.key
                ? { background: '#4a6cf7', color: '#fff' }
                : { color: '#5a7099', background: 'transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={top} layout="vertical" margin={{ left: 5, right: 25, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,108,247,0.08)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#5a7099', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => metric === 'revenue' ? fmtCurrency(v) : v.toLocaleString()} />
          <YAxis dataKey="name" type="category" width={120}
            tick={{ fill: '#9bb3d8', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,108,247,0.06)' }} />
          <Bar dataKey={metric} radius={[0, 6, 6, 0]} maxBarSize={18}>
            {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
