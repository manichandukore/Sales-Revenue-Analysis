import { format, parseISO, startOfMonth, startOfQuarter, startOfWeek } from 'date-fns';
import Papa from 'papaparse';

const FIELD_ALIASES = {
  date: ['date', 'sale_date', 'sale date', 'transaction_date', 'transaction date'],
  product: ['product', 'product_name', 'product name', 'item'],
  category: ['category', 'product_category', 'product category', 'segment'],
  region: ['region', 'area', 'territory', 'location'],
  rep: ['rep', 'sales_rep', 'sales rep', 'representative'],
  qty: ['qty', 'quantity', 'units', 'unit_count', 'amount'],
  revenue: ['revenue', 'sales', 'amount', 'total'],
  unitPrice: ['unitprice', 'unit_price', 'unit price', 'price'],
  discount: ['discount', 'discount_pct', 'discount_percent'],
};

function normalizeKey(rawKey) {
  if (typeof rawKey !== 'string') return null;
  const key = rawKey.trim().toLowerCase().replace(/\s+/g, '_');
  for (const canonical of Object.keys(FIELD_ALIASES)) {
    if (FIELD_ALIASES[canonical].includes(key)) return canonical;
  }
  return null;
}

export function normalizeRow(row) {
  const normalized = {};

  Object.entries(row).forEach(([rawKey, value]) => {
    const key = normalizeKey(rawKey);
    if (!key) return;

    let v = value;
    if (typeof v === 'string') v = v.trim();

    if (key === 'date') {
      if (v instanceof Date && !Number.isNaN(v.getTime())) {
        normalized.date = v.toISOString().slice(0, 10);
      } else if (v) {
        const parsed = new Date(v);
        normalized.date = Number.isNaN(parsed.getTime()) ? String(v) : parsed.toISOString().slice(0, 10);
      }
      return;
    }

    if (['qty', 'revenue', 'unitPrice', 'discount'].includes(key)) {
      normalized[key] = v === '' || v === null || v === undefined ? 0 : Number(v);
      if (Number.isNaN(normalized[key])) normalized[key] = 0;
      return;
    }

    normalized[key] = v;
  });

  const hasRevenue = Object.prototype.hasOwnProperty.call(normalized, 'revenue');
  if (!hasRevenue && normalized.unitPrice && normalized.qty) {
    const discountFactor = 1 - ((normalized.discount || 0) / 100);
    normalized.revenue = normalized.qty * normalized.unitPrice * discountFactor;
  }

  return normalized;
}

export function normalizeRows(rows) {
  return rows.map(normalizeRow).filter(r => r.date && (r.revenue !== undefined || r.qty !== undefined));
}

export function computeKPIs(data) {
  if (!data.length) return { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, totalUnits: 0, revenueGrowth: 0 };

  const totalRevenue = data.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const totalOrders = data.length;
  const avgOrderValue = totalRevenue / totalOrders;
  const totalUnits = data.reduce((s, r) => s + (Number(r.qty) || 0), 0);

  // Split first vs second half for growth
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid).reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const secondHalf = sorted.slice(mid).reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const revenueGrowth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

  return { totalRevenue, totalOrders, avgOrderValue, totalUnits, revenueGrowth };
}

export function groupByTimePeriod(data, period = 'month') {
  const grouped = {};
  data.forEach(row => {
    let key;
    const d = parseISO(row.date);
    if (period === 'month') key = format(startOfMonth(d), 'MMM yyyy');
    else if (period === 'quarter') key = `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
    else if (period === 'week') key = format(startOfWeek(d), 'MMM d');
    else key = String(d.getFullYear());

    if (!grouped[key]) grouped[key] = { period: key, revenue: 0, orders: 0, units: 0 };
    grouped[key].revenue += Number(row.revenue) || 0;
    grouped[key].orders += 1;
    grouped[key].units += Number(row.qty) || 0;
  });
  return Object.values(grouped);
}

export function groupByDimension(data, dim) {
  const grouped = {};
  data.forEach(row => {
    const key = row[dim] || 'Unknown';
    if (!grouped[key]) grouped[key] = { name: key, revenue: 0, orders: 0, units: 0 };
    grouped[key].revenue += Number(row.revenue) || 0;
    grouped[key].orders += 1;
    grouped[key].units += Number(row.qty) || 0;
  });
  return Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
}

export function parseCSV(text) {
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  const rows = parsed.data.map(normalizeRow).filter(r => r.date && (r.revenue !== undefined || r.qty !== undefined));
  if (!rows.length) return [];
  return rows;
}

export function fmtCurrency(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function fmtNum(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));
}

export function getUniqueValues(data, field) {
  return [...new Set(data.map(r => r[field]).filter(Boolean))].sort();
}
