import React from 'react';
import { fmtCurrency } from '../utils/dataUtils';
import { Trophy } from 'lucide-react';

const MEDALS = ['🥇','🥈','🥉'];
const BAR_COLORS = ['#4a6cf7','#00d4ff','#00f5a0','#ffb347','#ff6b9d','#a855f7'];

export default function RepLeaderboard({ data }) {
  const top = data.slice(0, 6);
  const maxRev = top[0]?.revenue || 1;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={15} color="#ffb347" />
        <h3 className="font-display font-600 text-white">Sales Rep Leaderboard</h3>
      </div>
      <div className="flex flex-col gap-3">
        {top.map((rep, i) => (
          <div key={rep.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{MEDALS[i] || `#${i + 1}`}</span>
                <span className="text-sm font-500 text-white">{rep.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span style={{ color: '#5a7099' }}>{rep.orders} deals</span>
                <span style={{ color: BAR_COLORS[i] }}>{fmtCurrency(rep.revenue)}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(rep.revenue / maxRev) * 100}%`, background: BAR_COLORS[i] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
