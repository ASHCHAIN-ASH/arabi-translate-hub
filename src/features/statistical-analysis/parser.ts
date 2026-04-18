// CSV/XLSX parser using SheetJS for Excel and Papa Parse for CSV
import * as XLSX from 'xlsx';

export interface ParsedData {
  columns: string[];
  rows: any[][];
  fileName: string;
  fileSize: number;
}

export async function parseFile(file: File): Promise<ParsedData> {
  const ext = file.name.toLowerCase().split('.').pop();
  if (ext === 'csv' || ext === 'txt') {
    const text = await file.text();
    return parseCSV(text, file.name, file.size);
  }
  if (ext === 'xlsx' || ext === 'xls') {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
    if (!json.length) throw new Error('الملف فارغ');
    const columns = (json[0] as any[]).map(String);
    const rows = json.slice(1) as any[][];
    return { columns, rows, fileName: file.name, fileSize: file.size };
  }
  throw new Error('صيغة الملف غير مدعومة. الصيغ المدعومة: CSV, XLSX, XLS');
}

function parseCSV(text: string, fileName: string, fileSize: number): ParsedData {
  // Robust CSV parser handling quoted fields and commas
  const lines: string[][] = [];
  let cur = '', inQuote = false, row: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuote = false;
      else cur += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (cur !== '' || row.length) { row.push(cur); lines.push(row); row = []; cur = ''; }
        if (c === '\r' && text[i + 1] === '\n') i++;
      } else cur += c;
    }
  }
  if (cur !== '' || row.length) { row.push(cur); lines.push(row); }
  if (!lines.length) throw new Error('الملف فارغ');
  const columns = lines[0].map(s => s.trim());
  const rows = lines.slice(1).filter(r => r.some(c => c !== ''));
  return { columns, rows, fileName, fileSize };
}
