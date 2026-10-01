import { useRef, useState } from 'react';
import { importFile, type ImportResult } from '../api/import.api';
import { parseSheet, MAX_FILE_SIZE } from '../utils/parseSheet';
import { getMissingHeaders } from '../utils/validateHeaders';

const EXPECTED_HEADERS = ['name', 'email', 'phone', 'address', 'organisation', 'type', 'linkStatus', 'downloadStatus'];

export default function UploadExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, unknown>[]>([]);
  const [missingHeaders, setMissingHeaders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(selected: File) {
    setResult(null);
    setError(null);

    if (selected.size > MAX_FILE_SIZE) {
      setError('File is too large (max 10MB)');
      return;
    }

    setFile(selected);
    const { headers, rows } = await parseSheet(selected);
    setPreviewRows(rows.slice(0, 5));
    setMissingHeaders(getMissingHeaders(headers));
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }

  async function handleImport() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setResult(await importFile(file));
      setFile(null);
      setPreviewRows([]);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Import failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-slate-900">Upload Excel</h1>
      <p className="text-slate-500 mt-1">
        Upload a .xlsx, .xls or .csv file using the expected column headers.{' '}
        <a href="/template.csv" download className="text-indigo-600 underline">
          Download template
        </a>
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white'
        }`}
      >
        <p className="text-slate-600">Drag and drop your file here, or click to browse</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {file && (
        <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-700">Selected file: {file.name}</p>

          {missingHeaders.length > 0 && (
            <p className="mt-2 text-sm text-red-600">
              Missing required column(s): {missingHeaders.join(', ')}. Please fix your file and re-upload.
            </p>
          )}

          {previewRows.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <p className="text-xs text-slate-500 mb-1">Preview (first 5 rows):</p>
              <table className="min-w-full text-xs border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {EXPECTED_HEADERS.map((h) => (
                      <th key={h} className="px-2 py-1 text-left border-b border-slate-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {EXPECTED_HEADERS.map((h) => (
                        <td key={h} className="px-2 py-1 whitespace-nowrap">{String(row[h] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={uploading || missingHeaders.length > 0}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Importing...' : 'Confirm Import'}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          Imported {result.imported} record(s). Skipped {result.skipped} invalid row(s).
          {result.errors.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs text-green-700">
              {result.errors.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
