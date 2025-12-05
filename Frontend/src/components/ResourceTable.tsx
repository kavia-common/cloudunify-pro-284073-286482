import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Resource } from '../types';

type SortKey = 'name' | 'provider' | 'type' | 'status' | 'cost';

type Props = {
  resources: Resource[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  sortable?: boolean;
};

// PUBLIC_INTERFACE
export default function ResourceTable({
  resources,
  loading = false,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sortable = true
}: Props): JSX.Element {
  /** Accessible table for cloud resources with client-side sorting and pagination. */
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    const arr = [...resources];
    arr.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      if (av === bv) return 0;
      if (sortKey === 'cost') {
        return sortDir === 'asc' ? (av - bv) : (bv - av);
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [resources, sortKey, sortDir]);

  const totalItems = total ?? resources.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(startIndex, startIndex + pageSize);

  function changeSort(key: SortKey) {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="table-wrap">
      <div className="table-controls">
        <div className="pagination">
          <button
            className="btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            «
          </button>
          <button
            className="btn"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span aria-live="polite" style={{ minWidth: 120, textAlign: 'center' }}>
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
          <button
            className="btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »
          </button>
          <label className="page-size">
            Page size
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              aria-label="Page size"
            >
              {[10, 20, 50].map(s => (
                <option value={s} key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="result-count" aria-live="polite">
          {totalItems} result{totalItems === 1 ? '' : 's'}
        </div>
      </div>

      <div className="table-scroller" role="region" aria-label="Resources table">
        <table className="table">
          <thead>
            <tr>
              <SortableHeader label="Name" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={changeSort} />
              <SortableHeader label="Provider" sortKey="provider" currentKey={sortKey} dir={sortDir} onSort={changeSort} />
              <SortableHeader label="Type" sortKey="type" currentKey={sortKey} dir={sortDir} onSort={changeSort} />
              <SortableHeader label="Status" sortKey="status" currentKey={sortKey} dir={sortDir} onSort={changeSort} />
              <SortableHeader label="Cost" sortKey="cost" currentKey={sortKey} dir={sortDir} onSort={changeSort} />
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="loading-cell">Loading resources…</td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">No resources found.</td>
              </tr>
            ) : (
              pageItems.map((r) => (
                <tr key={r.id}>
                  <td><Link to={`/resources/${r.id}`} className="row-link">{r.name}</Link></td>
                  <td>{r.provider}</td>
                  <td>{r.type}</td>
                  <td>{r.status}</td>
                  <td>${r.cost.toFixed(2)}</td>
                  <td>{Object.keys(r.tags ?? {}).length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentKey,
  dir,
  onSort
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  dir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}) {
  const active = currentKey === sortKey;
  return (
    <th scope="col">
      <button
        type="button"
        className={`sort-header ${active ? 'active' : ''}`}
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
        aria-label={`Sort by ${label}`}
      >
        {label} {active ? (dir === 'asc' ? '▲' : '▼') : '▴▾'}
      </button>
    </th>
  );
}
