import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { fmtCurrency } from '../utils/dataUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f1629', border: '1px solid rgba(74,108,247,0.3)', borderRadius: 10, padding: '10px 14px' }}>
      <p className="text-xs font-mono mb-2" style={{ color: '#7b93c9' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-display font-600" style={{ color: p.color }}>
          {p.name}: {p.name === 'Revenue' ? fmtCurrency(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function RevenueTrendChart({ data, showOrders = true }) {
  return (
    <div className="card p-5" style={{ height: 320 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-600 text-white">Revenue Trend</h3>
          <p className="text-xs mt-0.5" style={{ color: '#5a7099' }}>Aggregated by selected period</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ background: '#4a6cf7' }}/>Revenue</span>
          {showOrders && <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ background: '#00d4ff' }}/>Orders</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ left: 10, right: 10, bottom: 0, top: 5 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4a6cf7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4a6cf7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,108,247,0.08)" />
          <XAxis dataKey="period" tick={{ fill: '#5a7099', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="rev" tick={{ fill: '#5a7099', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v)} width={60} />
          {showOrders && <YAxis yAxisId="ord" orientation="right" tick={{ fill: '#5a7099', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false} tickLine={false} width={35} />}
          <Tooltip content={<CustomTooltip />} />
          <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#4a6cf7" strokeWidth={2}
            fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#4a6cf7', strokeWidth: 0 }} />
          {showOrders && <Area yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke="#00d4ff" strokeWidth={1.5}
            fill="url(#ordGrad)" dot={false} activeDot={{ r: 4, fill: '#00d4ff', strokeWidth: 0 }} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
