import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtCurrency } from '../utils/dataUtils';

const COLORS = ['#4a6cf7','#00d4ff','#00f5a0','#ffb347','#ff6b9d','#a855f7','#f59e0b','#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f1629', border: '1px solid rgba(74,108,247,0.3)', borderRadius: 10, padding: '10px 14px' }}>
      <p className="text-sm font-600 text-white">{payload[0].name}</p>
      <p className="text-xs font-mono" style={{ color: '#00f5a0' }}>{fmtCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function CategoryChart({ data }) {
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-600 text-white">Revenue by Category</h3>
        <p className="text-xs mt-0.5" style={{ color: '#5a7099' }}>Share of total revenue</p>
      </div>
      <div className="flex items-center gap-4">
        <div style={{ width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                dataKey="revenue" paddingAngle={3} strokeWidth={0}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {data.slice(0, 6).map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs truncate flex-1" style={{ color: '#9bb3d8' }}>{d.name}</span>
              <span className="text-xs font-mono flex-shrink-0" style={{ color: '#5a7099' }}>
                {total > 0 ? Math.round((d.revenue / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
