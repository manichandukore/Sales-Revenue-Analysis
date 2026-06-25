// Sample sales data generator
export const SAMPLE_DATA = generateSampleData();

function generateSampleData() {
  const products = [
    { name: 'ProSuite Enterprise', category: 'Software', basePrice: 4200 },
    { name: 'CloudSync Pro', category: 'SaaS', basePrice: 1800 },
    { name: 'DataVault Standard', category: 'Storage', basePrice: 950 },
    { name: 'SecureShield Plus', category: 'Security', basePrice: 2400 },
    { name: 'AnalyticsHub', category: 'Analytics', basePrice: 3100 },
    { name: 'ConnectAPI Basic', category: 'API', basePrice: 650 },
    { name: 'MobileFirst SDK', category: 'SDK', basePrice: 1200 },
    { name: 'AutoScale Engine', category: 'Infrastructure', basePrice: 5600 },
  ];

  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const salesReps = ['Aria Chen', 'Marcus Webb', 'Priya Nair', 'Luca Romano', 'Zara Ahmed', 'Dev Patel'];

  const rows = [];
  const startDate = new Date('2024-01-01');

  for (let i = 0; i < 400; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const rep = salesReps[Math.floor(Math.random() * salesReps.length)];
    const date = new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);
    const qty = Math.floor(Math.random() * 10) + 1;
    const discount = [0, 0, 0, 0.05, 0.10, 0.15][Math.floor(Math.random() * 6)];
    const revenue = product.basePrice * qty * (1 - discount);

    rows.push({
      date: date.toISOString().split('T')[0],
      product: product.name,
      category: product.category,
      region,
      rep,
      qty,
      unitPrice: product.basePrice,
      discount: discount * 100,
      revenue: Math.round(revenue),
    });
  }

  return rows.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const CSV_HEADERS = ['date', 'product', 'category', 'region', 'rep', 'qty', 'unitPrice', 'discount', 'revenue'];

export function dataToCSV(data) {
  const header = CSV_HEADERS.join(',');
  const rows = data.map(r => CSV_HEADERS.map(h => r[h]).join(','));
  return [header, ...rows].join('\n');
}
