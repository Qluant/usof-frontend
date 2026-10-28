import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page" style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-md)' }}>
      <HelpCircle size={64} style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-primary)' }}>
        404
      </h1>
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--spacing-xl)' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
}
