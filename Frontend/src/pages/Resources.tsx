import React, { useEffect, useMemo, useState } from 'react';
import { getApiClient } from '../lib/apiClient';
import type { Provider, Resource } from '../types';
import ResourceTable from '../components/ResourceTable';

// PUBLIC_INTERFACE
export default function Resources(): JSX.Element {
  /**
   * Resources page with filters and pagination.
   * Fetches /resources with optional provider/status query parameters.
   */
  const api = getApiClient();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [provider, setProvider] = useState<'' | Provider>('');
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    const params: Record<string, string> = {};
    if (provider) params.provider = provider;
    if (status) params.status = status;

    api.get<Resource[]>('/resources', { params })
      .then((res) => {
        if (!mounted) return;
        setResources(res.data ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        const message =
          err?.response?.data?.message ??
          err?.message ??
          'Failed to load resources';
        setError(String(message));
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, status]);

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [provider, status, search]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return resources;
    return resources.filter(r => r.name.toLowerCase().includes(s) || r.type.toLowerCase().includes(s));
  }, [resources, search]);

  return (
    <section className="page page-resources">
      <div className="page-header">
        <h2>Resources</h2>
        <p className="subtitle">Explore cross-cloud resources. Filter by provider, status, and search.</p>
      </div>

      <div className="filters" role="region" aria-label="Resource Filters">
        <label>
          Provider
          <select value={provider} onChange={(e) => setProvider((e.target.value || '') as Provider | '')} aria-label="Filter by provider">
            <option value="">All</option>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
            <option value="GCP">GCP</option>
          </select>
        </label>

        <label>
          Status
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="e.g., running, stopped"
            aria-label="Filter by status"
          />
        </label>

        <label className="search-input">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or type"
            aria-label="Search resources by name or type"
          />
        </label>
      </div>

      {error ? (
        <div role="alert" className="error-text">{error}</div>
      ) : null}

      <ResourceTable
        resources={filtered}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        total={filtered.length}
        sortable
      />
    </section>
  );
}
