import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import { UserPlus, CheckCircle, Gamepad2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error, successMessage } = useSelector((state) => state.auth);

  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setLocalError('Password confirmation does not match.');
      return;
    }
    setLocalError('');
    dispatch(
      registerUser({
        login,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
    );
  };

  if (successMessage) {
    return (
      <div className="auth-container">
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
          <CheckCircle size={52} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-white)' }}>
            Check your email!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {successMessage}
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Proceed to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-light)', marginBottom: '0.75rem' }}>
            <img
              src="/logo.png"
              alt="GamerEars"
              style={{ width: '72px', height: '72px', borderRadius: '8px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)' }}>
            Join the GamerEars Community
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Create your player profile and exchange strategies
          </p>
        </div>

        {(error || localError) && (
          <div className="card" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-light)', border: 'none', padding: '0.8rem', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Gamer Tag (Username)</label>
            <input
              type="text"
              placeholder="e.g. shadow_hunter"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="player@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <UserPlus size={16} />
            <span>{isLoading ? 'Registering Player...' : 'Create Player Profile'}</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have a player account? <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
