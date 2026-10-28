import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ConfirmEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    async function verify() {
      try {
        const res = await authApi.confirmEmail(token);
        setStatus('success');
        setMessage(res.message || 'Your email has been successfully confirmed.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired confirmation link.');
      }
    }
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        {status === 'loading' ? (
          <p>Verifying your email token...</p>
        ) : status === 'success' ? (
          <>
            <CheckCircle size={52} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.8rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Log In Now
            </Link>
          </>
        ) : (
          <>
            <XCircle size={52} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.8rem' }}>Verification Failed</h2>
            <p style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Go to Sign In
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ width: '100%' }}>
                Back to Registration
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
