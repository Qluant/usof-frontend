import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { KeyRound, CheckCircle } from 'lucide-react';

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      const res = await authApi.requestPasswordReset(email);
      setMessage(res.message || 'If that email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>
          Reset Your Password
        </h1>

        {message ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={44} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>{message}</p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="card" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-light)', border: 'none', padding: '0.8rem', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <KeyRound size={16} />
              <span>{isSubmitting ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
