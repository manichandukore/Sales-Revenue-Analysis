import React, { useRef, useState } from 'react';
import { Upload, FileText, Table, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { parseCSV, normalizeRows } from '../utils/dataUtils';

export default function FileImport({ onData }) {
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [msg, setMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const processFile = file => {
    setStatus('loading');
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const rows = parseCSV(e.target.result);
          if (!rows.length) throw new Error('No data found');
          onData(rows);
          setStatus('success');
          setMsg(`Loaded ${rows.length} rows from ${file.name}`);
        } catch (err) {
          setStatus('error');
          setMsg(err.message);
        }
      };
      reader.readAsText(file);
    } else if (['xlsx','xls'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
          const normalized = normalizeRows(rows);
          if (!normalized.length) throw new Error('No data found');
          onData(normalized);
          setStatus('success');
          setMsg(`Loaded ${normalized.length} rows from ${file.name}`);
        } catch (err) {
          setStatus('error');
          setMsg(err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setStatus('error');
      setMsg('Unsupported file type. Use CSV or XLSX.');
    }
  };

  const onDrop = e => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Upload size={14} color="#4a6cf7" />
        <h3 className="font-display font-600 text-white">Import Data</h3>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,108,247,0.15)', color: '#6b8eff' }}>CSV · XLSX</span>
      </div>

      <div
        className={`upload-zone rounded-xl p-8 text-center cursor-pointer ${dragging ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => e.target.files[0] && processFile(e.target.files[0])} />
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <FileText size={20} color="#4a6cf7" />
            <Table size={20} color="#00d4ff" />
          </div>
          <p className="text-sm" style={{ color: '#9bb3d8' }}>
            Drop your file here or <span style={{ color: '#4a6cf7' }}>browse</span>
          </p>
          <p className="text-xs" style={{ color: '#3a4f7a' }}>
            Expected columns: date, product, category, region, rep, qty, revenue
          </p>
        </div>
      </div>

      {status && (
        <div className="flex items-center gap-2 mt-3 p-3 rounded-lg text-sm" style={{
          background: status === 'success' ? 'rgba(0,245,160,0.08)' : status === 'error' ? 'rgba(255,107,157,0.08)' : 'rgba(74,108,247,0.08)',
          border: `1px solid ${status === 'success' ? 'rgba(0,245,160,0.2)' : status === 'error' ? 'rgba(255,107,157,0.2)' : 'rgba(74,108,247,0.2)'}`,
        }}>
          {status === 'success' ? <CheckCircle size={14} color="#00f5a0" /> :
           status === 'error'   ? <AlertCircle size={14} color="#ff6b9d" /> :
           <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />}
          <span style={{ color: status === 'success' ? '#00f5a0' : status === 'error' ? '#ff6b9d' : '#6b8eff' }}>{msg || 'Processing…'}</span>
        </div>
      )}
    </div>
  );
}
