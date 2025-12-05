import React, { useEffect, useState } from 'react';
import { getApiClient } from '../lib/apiClient';
import type { Organization } from '../types';

// PUBLIC_INTERFACE
export default function Organizations(): JSX.Element {
  /** Organizations listing page. */
  const api = getApiClient();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.get<Organization[]>('/organizations')
      .then((res) => mounted && setOrgs(res.data ?? []))
      .catch((err) => {
        if (!mounted) return;
        const message = err?.response?.data?.message ?? err?.message ?? 'Failed to load organizations';
        setError(String(message));
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [api]);

  const totalPages = Math.max(1, Math.ceil(orgs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = orgs.slice(startIndex, startIndex + pageSize);

  return (
    <section className="page page-organizations">
      <div className="page-header">
        <h2>Organizations</h2>
        <p className="subtitle">Organizations you have access to</p>
      </div>

      {error ? <div role="alert" className="error-text">{error}</div> : null}

      <div className="table-wrap">
        <div className="table-controls">
          <div className="pagination">
            <button className="btn" onClick={() => setPage(1)} disabled={currentPage === 1} aria-label="First page">«</button>
            <button className="btn" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page">‹</button>
            <span aria-live="polite" style={{ minWidth: 120, textAlign: 'center' }}>
              Page {currentPage} / {totalPages}
            </span>
            <button className="btn" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page">›</button>
            <button className="btn" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">»</button>
            <label className="page-size">
              Page size
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} aria-label="Page size">
                {[10, 20, 50].map(s => <option value={s} key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="result-count" aria-live="polite">
            {orgs.length} result{orgs.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="table-scroller">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Organization</th>
                <th scope="col">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="loading-cell">Loading organizations…</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={2} className="empty-cell">No organizations found.</td></tr>
              ) : (
                pageItems.map(o => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
