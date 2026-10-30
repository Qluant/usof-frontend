import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Gamepad2, Users } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '65vh',
        padding: '2rem 1rem'
      }}
    >
      <div
        className="card hud-corner"
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          background: 'radial-gradient(ellipse at top, rgba(155, 29, 58, 0.15) 0%, var(--bg-card) 70%)'
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(155, 29, 58, 0.15)',
            border: '1px solid rgba(155, 29, 58, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--primary)'
          }}
        >
          <Compass size={38} />
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '2px',
            color: 'var(--danger)',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}
        >
          404 Not Found
        </div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: 'var(--text-white)',
            lineHeight: 1.15,
            marginBottom: '0.75rem'
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '440px',
            margin: '0 auto 2rem auto'
          }}
        >
          The page or topic you are looking for does not exist or has been removed.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} />
            <span>Back to Home</span>
          </Link>

          <Link to="/categories" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gamepad2 size={16} />
            <span>Categories</span>
          </Link>

          <Link to="/users" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} />
            <span>All members</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
