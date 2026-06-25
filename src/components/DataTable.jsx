import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { fmtCurrency } from '../utils/dataUtils';

export default function DataTable({ data }) {
  const [sort, setSort] = useState({ col: 'date', dir: 'desc' });
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let av = a[sort.col], bv = b[sort.col];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  const paged = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  const toggleSort = col => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' });
    setPage(0);
  };

  const SortIcon = ({ col }) => {
    if (sort.col !== col) return <ChevronsUpDown size={11} color="#3a4f7a" />;
    return sort.dir === 'asc' ? <ChevronUp size={11} color="#4a6cf7" /> : <ChevronDown size={11} color="#4a6cf7" />;
  };

  const cols = [
    { key: 'date',     label: 'Date' },
    { key: 'product',  label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'region',   label: 'Region' },
    { key: 'rep',      label: 'Rep' },
    { key: 'qty',      label: 'Qty' },
    { key: 'discount', label: 'Disc%' },
    { key: 'revenue',  label: 'Revenue' },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(74,108,247,0.1)' }}>
        <h3 className="font-display font-600 text-white">Transaction Log</h3>
        <span className="text-xs font-mono" style={{ color: '#5a7099' }}>{data.length.toLocaleString()} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(74,108,247,0.1)' }}>
              {cols.map(c => (
                <th key={c.key} onClick={() => toggleSort(c.key)}
                  className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-white"
                  style={{ color: sort.col === c.key ? '#6b8eff' : '#5a7099', background: '#0a0e1a', whiteSpace: 'nowrap' }}>
                  <span className="flex items-center gap-1.5">{c.label} <SortIcon col={c.key} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="border-b transition-colors hover:bg-blue-900/10"
                style={{ borderColor: 'rgba(74,108,247,0.06)' }}>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: '#7b93c9' }}>{row.date}</td>
                <td className="px-4 py-2.5 text-white font-500">{row.product}</td>
                <td className="px-4 py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(74,108,247,0.15)', color: '#6b8eff' }}>
                    {row.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: '#9bb3d8' }}>{row.region}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: '#9bb3d8' }}>{row.rep}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-center" style={{ color: '#e2e8f0' }}>{row.qty}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-center" style={{ color: row.discount > 0 ? '#ffb347' : '#3a4f7a' }}>
                  {row.discount > 0 ? `${row.discount}%` : '—'}
                </td>
                <td className="px-4 py-2.5 font-mono font-600 text-right" style={{ color: '#00f5a0' }}>
                  {fmtCurrency(row.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(74,108,247,0.1)' }}>
        <span className="text-xs font-mono" style={{ color: '#5a7099' }}>
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="text-xs px-3 py-1.5 rounded-lg font-mono disabled:opacity-30 transition-colors"
            style={{ background: '#1c2847', color: '#9bb3d8' }}>Prev</button>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="text-xs px-3 py-1.5 rounded-lg font-mono disabled:opacity-30 transition-colors"
            style={{ background: '#1c2847', color: '#9bb3d8' }}>Next</button>
        </div>
      </div>
    </div>
  );
}
