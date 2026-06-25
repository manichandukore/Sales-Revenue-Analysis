import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ label, value, sub, trend, trendValue, icon: Icon, color = 'brand', sparkData }) {
  const colorMap = {
    brand: { bg: 'rgba(74,108,247,0.12)', text: '#6b8eff', glow: 'rgba(74,108,247,0.25)' },
    cyan:  { bg: 'rgba(0,212,255,0.10)',  text: '#00d4ff', glow: 'rgba(0,212,255,0.20)' },
    green: { bg: 'rgba(0,245,160,0.10)',  text: '#00f5a0', glow: 'rgba(0,245,160,0.20)' },
    amber: { bg: 'rgba(255,179,71,0.10)', text: '#ffb347', glow: 'rgba(255,179,71,0.20)' },
    pink:  { bg: 'rgba(255,107,157,0.10)',text: '#ff6b9d', glow: 'rgba(255,107,157,0.20)' },
  };
  const c = colorMap[color] || colorMap.brand;
  const isPositive = trendValue >= 0;

  const miniSparkMax = sparkData ? Math.max(...sparkData) : 0;

  return (
    <div className="kpi-card p-5 flex flex-col gap-3" style={{ minHeight: 140 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7b93c9' }}>{label}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.bg, boxShadow: `0 0 12px ${c.glow}` }}>
            <Icon size={16} style={{ color: c.text }} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-display font-700 text-2xl text-white animate-count" style={{ letterSpacing: '-0.02em' }}>{value}</div>
          {sub && <div className="text-xs mt-0.5" style={{ color: '#5a7099' }}>{sub}</div>}
        </div>

        {sparkData && (
          <div className="flex items-end gap-0.5 h-8 pb-0.5">
            {sparkData.slice(-8).map((v, i) => (
              <div key={i} className="w-1 rounded-sm transition-all" style={{
                height: `${(v / miniSparkMax) * 100}%`,
                background: i === sparkData.length - 1 ? c.text : `${c.text}55`,
                minHeight: 3,
              }} />
            ))}
          </div>
        )}
      </div>

      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {isPositive
            ? <TrendingUp size={12} color="#00f5a0" />
            : <TrendingDown size={12} color="#ff6b9d" />}
          <span style={{ color: isPositive ? '#00f5a0' : '#ff6b9d' }}>
            {isPositive ? '+' : ''}{trendValue.toFixed(1)}%
          </span>
          <span style={{ color: '#5a7099' }}>{trend || 'vs prev period'}</span>
        </div>
      )}
    </div>
  );
}
