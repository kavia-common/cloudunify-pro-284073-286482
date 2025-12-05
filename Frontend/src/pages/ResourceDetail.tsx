import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApiClient } from '../lib/apiClient';
import type { Resource } from '../types';

// PUBLIC_INTERFACE
export default function ResourceDetail(): JSX.Element {
  /** Detailed view for a single resource with graceful fallback if direct endpoint is unavailable. */
  const { id } = useParams<{ id: string }>();
  const api = getApiClient();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError('');

    // Try GET /resources/:id, fallback to GET /resources and find locally
    api.get<Resource>(`/resources/${id}`)
      .then((res) => {
        if (!mounted) return;
        setResource(res.data ?? null);
      })
      .catch(async () => {
        try {
          const list = await api.get<Resource[]>('/resources');
          const found = (list.data ?? []).find(r => r.id === id) ?? null;
          if (mounted) setResource(found);
        } catch (err: any) {
          if (!mounted) return;
          const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to load resource';
          setError(String(msg));
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [api, id]);

  if (loading) {
    return <section className="page"><p>Loading resource…</p></section>;
  }

  if (error) {
    return <section className="page"><div role="alert" className="error-text">{error}</div></section>;
  }

  if (!resource) {
    return (
      <section className="page">
        <p>Resource not found.</p>
        <Link to="/resources" className="btn">Back to Resources</Link>
      </section>
    );
  }

  const entries = Object.entries(resource.tags ?? {});

  return (
    <section className="page page-resource-detail">
      <div className="page-header">
        <h2>{resource.name}</h2>
        <p className="subtitle">{resource.provider} • {resource.type} • {resource.status}</p>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Overview</h3>
          <ul className="kv">
            <li><span>ID</span><code>{resource.id}</code></li>
            <li><span>Provider</span>{resource.provider}</li>
            <li><span>Type</span>{resource.type}</li>
            <li><span>Status</span>{resource.status}</li>
            <li><span>Cost (monthly)</span>${resource.cost.toFixed(2)}</li>
            <li><span>Created</span>{new Date(resource.createdAt).toLocaleString()}</li>
          </ul>
        </div>
        <div className="detail-card">
          <h3>Tags ({entries.length})</h3>
          {entries.length === 0 ? (
            <p>No tags.</p>
          ) : (
            <ul className="tag-list">
              {entries.map(([k, v]) => (
                <li key={k}><span className="tag-key">{k}</span><span className="tag-sep">:</span><span className="tag-val">{v}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/resources" className="btn">← Back to Resources</Link>
      </div>
    </section>
  );
}
