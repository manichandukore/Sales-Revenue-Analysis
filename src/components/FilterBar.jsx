import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

function Select({ label, value, options, onChange, placeholder = 'All' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-mono uppercase tracking-wider" style={{ color: '#5a7099' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
        style={{ background: '#1c2847', border: '1px solid rgba(74,108,247,0.2)', color: value ? '#e2e8f0' : '#7b93c9', minWidth: 140 }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function FilterBar({ filters, setFilters, options, onClear, activeCount }) {
  return (
    <div className="card p-4 flex flex-wrap items-end gap-4">
      <div className="flex items-center gap-2 mr-2">
        <SlidersHorizontal size={15} color="#4a6cf7" />
        <span className="text-sm font-display font-500 text-white">Filters</span>
        {activeCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(74,108,247,0.2)', color: '#6b8eff' }}>
            {activeCount}
          </span>
        )}
      </div>

      <Select label="Region"   value={filters.region}   options={options.regions}    onChange={v => setFilters(f => ({ ...f, region: v }))} />
      <Select label="Category" value={filters.category} options={options.categories}  onChange={v => setFilters(f => ({ ...f, category: v }))} />
      <Select label="Rep"      value={filters.rep}      options={options.reps}        onChange={v => setFilters(f => ({ ...f, rep: v }))} />
      <Select label="Period"   value={filters.period}   options={['week','month','quarter','year']} onChange={v => setFilters(f => ({ ...f, period: v }))} placeholder="Month" />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-mono uppercase tracking-wider" style={{ color: '#5a7099' }}>Date Range</label>
        <div className="flex gap-2">
          <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
            className="text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            style={{ background: '#1c2847', border: '1px solid rgba(74,108,247,0.2)', color: '#e2e8f0', width: 140 }} />
          <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
            className="text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            style={{ background: '#1c2847', border: '1px solid rgba(74,108,247,0.2)', color: '#e2e8f0', width: 140 }} />
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={onClear} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all hover:opacity-80 self-end"
          style={{ background: 'rgba(255,107,157,0.12)', color: '#ff6b9d', border: '1px solid rgba(255,107,157,0.2)' }}>
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}
