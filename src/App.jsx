import React, { useState, useMemo, useCallback } from 'react';
import {
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Package,
  Users, Download, Activity
} from 'lucide-react';
import { SAMPLE_DATA, dataToCSV } from './data/sampleData';
import { computeKPIs, groupByTimePeriod, groupByDimension, fmtCurrency, fmtNum, getUniqueValues } from './utils/dataUtils';
import KPICard from './components/KPICard';
import FilterBar from './components/FilterBar';
import RevenueTrendChart from './components/RevenueTrendChart';
import TopProductsChart from './components/TopProductsChart';
import RegionalChart from './components/RegionalChart';
import RepLeaderboard from './components/RepLeaderboard';
import CategoryChart from './components/CategoryChart';
import DataTable from './components/DataTable';
import FileImport from './components/FileImport';

const TABS = [
  { id: 'overview',  label: 'Overview',  icon: BarChart3 },
  { id: 'products',  label: 'Products',  icon: Package },
  { id: 'regions',   label: 'Regions',   icon: Activity },
  { id: 'table',     label: 'Data',      icon: ShoppingCart },
  { id: 'import',    label: 'Import',    icon: Download },
];

const DEFAULT_FILTERS = { region: '', category: '', rep: '', period: 'month', dateFrom: '', dateTo: '' };

export default function App() {
  const [rawData, setRawData] = useState(SAMPLE_DATA);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState('overview');

  const filterOptions = useMemo(() => ({
    regions:    getUniqueValues(rawData, 'region'),
    categories: getUniqueValues(rawData, 'category'),
    reps:       getUniqueValues(rawData, 'rep'),
  }), [rawData]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== 'period' && v !== '').length;

  const filteredData = useMemo(() => {
    return rawData.filter(r => {
      if (filters.region   && r.region   !== filters.region)   return false;
      if (filters.category && r.category !== filters.category) return false;
      if (filters.rep      && r.rep      !== filters.rep)      return false;
      if (filters.dateFrom && r.date < filters.dateFrom)       return false;
      if (filters.dateTo   && r.date > filters.dateTo)         return false;
      return true;
    });
  }, [rawData, filters]);

  const kpis       = useMemo(() => computeKPIs(filteredData), [filteredData]);
  const trendData  = useMemo(() => groupByTimePeriod(filteredData, filters.period || 'month'), [filteredData, filters.period]);
  const byProduct  = useMemo(() => groupByDimension(filteredData, 'product'),  [filteredData]);
  const byRegion   = useMemo(() => groupByDimension(filteredData, 'region'),   [filteredData]);
  const byCategory = useMemo(() => groupByDimension(filteredData, 'category'), [filteredData]);
  const byRep      = useMemo(() => groupByDimension(filteredData, 'rep'),      [filteredData]);

  const sparkRevenue = trendData.map(d => d.revenue);

  const handleImport = useCallback(data => {
    setRawData(data);
    setFilters(DEFAULT_FILTERS);
    setActiveTab('overview');
  }, []);

  const exportCSV = () => {
    const csv = dataToCSV(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sales_export.csv'; a.click();
  };

  const downloadSampleCSV = () => {
    const csv = dataToCSV(SAMPLE_DATA);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sales_sample.csv'; a.click();
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', backgroundImage: "linear-gradient(rgba(74,108,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,108,247,0.03) 1px, transparent 1px)", backgroundSize: '40px 40px' }}>

      {/* Header */}
      <header style={{ background: 'rgba(10,14,26,0.95)', borderBottom: '1px solid rgba(74,108,247,0.12)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4a6cf7, #00d4ff)', boxShadow: '0 0 16px rgba(74,108,247,0.4)' }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <div>
              <span className="font-display font-700 text-white text-lg" style={{ letterSpacing: '-0.03em' }}>SalesIQ</span>
              <span className="text-xs ml-2 font-mono" style={{ color: '#3a4f7a' }}>Revenue Dashboard</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-500 transition-all relative ${activeTab === t.id ? 'tab-active' : ''}`}
                style={activeTab === t.id
                  ? { background: 'rgba(74,108,247,0.15)', color: '#6b8eff' }
                  : { color: '#5a7099', background: 'transparent' }}>
                <t.icon size={13} />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {TABS.map(t => (
                <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-500 transition-all ${activeTab === t.id ? 'tab-active' : ''}`}
                  style={activeTab === t.id
                    ? { background: 'rgba(74,108,247,0.15)', color: '#6b8eff', whiteSpace: 'nowrap' }
                    : { color: '#5a7099', background: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>
                  <t.icon size={13} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-mono transition-all hover:opacity-80"
              style={{ background: 'rgba(0,245,160,0.1)', color: '#00f5a0', border: '1px solid rgba(0,245,160,0.2)' }}>
              <Download size={11} /> Export
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} options={filterOptions}
          activeCount={activeFilterCount} onClear={() => setFilters(DEFAULT_FILTERS)} />

        {/* Record count */}
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#3a4f7a' }}>
          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#00f5a0' }} />
          Showing {filteredData.length.toLocaleString()} of {rawData.length.toLocaleString()} records
          {activeFilterCount > 0 && <span style={{ color: '#4a6cf7' }}>· {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>}
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KPICard label="Total Revenue"  value={fmtCurrency(kpis.totalRevenue)}  icon={DollarSign}   color="brand" trendValue={kpis.revenueGrowth} sparkData={sparkRevenue} />
          <KPICard label="Total Orders"   value={fmtNum(kpis.totalOrders)}         icon={ShoppingCart} color="cyan"  trendValue={kpis.revenueGrowth * 0.8} />
          <KPICard label="Avg Order Value" value={fmtCurrency(kpis.avgOrderValue)} icon={TrendingUp}   color="green" trendValue={kpis.revenueGrowth * 0.5} />
          <KPICard label="Units Sold"     value={fmtNum(kpis.totalUnits)}          icon={Package}      color="amber" trendValue={kpis.revenueGrowth * 0.6} />
          <KPICard label="Active Reps"    value={String(byRep.length)}             icon={Users}        color="pink"  sub="contributing reps" />
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2">
                <RevenueTrendChart data={trendData} showOrders />
              </div>
              <RegionalChart data={byRegion} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopProductsChart data={byProduct} />
              <RepLeaderboard data={byRep} />
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2"><TopProductsChart data={byProduct} /></div>
            <CategoryChart data={byCategory} />
            <RepLeaderboard data={byRep} />
          </div>
        )}

        {/* REGIONS TAB */}
        {activeTab === 'regions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2"><RevenueTrendChart data={trendData} showOrders={false} /></div>
            <RegionalChart data={byRegion} />
            <div className="card p-5">
              <h3 className="font-display font-600 text-white mb-4">Region Breakdown</h3>
              <div className="flex flex-col gap-3">
                {byRegion.map((r, i) => {
                  const maxRev = byRegion[0]?.revenue || 1;
                  const COLORS = ['#4a6cf7','#00d4ff','#00f5a0','#ffb347','#ff6b9d'];
                  return (
                    <div key={r.name}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span style={{ color: '#e2e8f0' }}>{r.name}</span>
                        <div className="flex gap-4 text-xs font-mono">
                          <span style={{ color: '#5a7099' }}>{r.orders} orders</span>
                          <span style={{ color: COLORS[i] }}>{fmtCurrency(r.revenue)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(r.revenue / maxRev) * 100}%`, background: COLORS[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TABLE TAB */}
        {activeTab === 'table' && <DataTable data={filteredData} />}

        {/* IMPORT TAB */}
        {activeTab === 'import' && (
          <div className="max-w-2xl mx-auto w-full">
            <FileImport onData={handleImport} />
            <div className="card p-5 mt-4">
              <h4 className="font-display font-600 text-white mb-3">Expected CSV Format</h4>
              <div className="overflow-x-auto">
                <table className="text-xs font-mono w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(74,108,247,0.1)' }}>
                      {['date','product','category','region','rep','qty','unitPrice','discount','revenue'].map(h => (
                        <th key={h} className="text-left py-2 pr-4" style={{ color: '#4a6cf7' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {['2024-03-15','ProSuite','Software','NA','Aria Chen','3','4200','10','11340'].map((v, i) => (
                        <td key={i} className="py-2 pr-4" style={{ color: '#7b93c9' }}>{v}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: '#3a4f7a' }}>
                Download sample: <button onClick={exportCSV} className="underline" style={{ color: '#4a6cf7' }}>export_sample.csv</button>
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-6 py-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(74,108,247,0.08)' }}>
        <span className="text-xs font-mono" style={{ color: '#3a4f7a' }}>SalesIQ Dashboard · Built with React + Recharts</span>
        <span className="text-xs font-mono" style={{ color: '#3a4f7a' }}>{filteredData.length} records · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
