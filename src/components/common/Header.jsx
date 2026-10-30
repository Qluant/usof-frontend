import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, LogOut, PlusCircle, Shield, Gamepad2, Zap } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { setFilter } from '../../store/slices/postsSlice';
import { UPLOADS_BASE_URL } from '../../api/client';
import { getGamerRank } from '../../utils/gamerRank';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchQuery }));
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const avatarSrc = user?.profile_picture
    ? (user.profile_picture.startsWith('http')
        ? user.profile_picture
        : `${UPLOADS_BASE_URL}/avatars/${user.profile_picture}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.login || 'Player')}&background=9b1d3a&color=fff`;

  const rank = getGamerRank(user?.rating);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo mobile-hide">
          <img
            src="/logo.png"
            alt="GamerEars"
            style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'contain', marginTop: '-6px' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-white)', lineHeight: 1 }}>
            GamerEars
          </span>
        </Link>

        <form onSubmit={handleSearch} className="search-bar">
          <Search className="search-icon" size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search guides, boss tactics, builds... (Press /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/posts/new" className="btn btn-primary btn-sm header-new-topic-btn mobile-hide">
                <PlusCircle size={16} />
                <span>New Topic</span>
              </Link>

              <Link
                to={`/profile/${user?.id}`}
                className="user-profile-pill"
                style={{ borderColor: rank.border, position: 'relative', overflow: 'hidden' }}
              >
                <img
                  key={avatarSrc}
                  src={avatarSrc}
                  alt={user?.login}
                  className="avatar-img"
                  style={{ borderColor: rank.color }}
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.login || 'Player') + '&background=9b1d3a&color=fff';
                  }}
                />
                <div className="header-user-text mobile-hide" style={{ display: 'flex', flexDirection: 'column', minWidth: '70px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-white)', lineHeight: 1.2 }}>
                      {user?.login}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.05rem 0.35rem',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase',
                        backgroundColor: user?.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: user?.role === 'admin' ? '#ef4444' : '#818cf8',
                        border: '1px solid currentColor',
                        lineHeight: 1.2
                      }}
                    >
                      {user?.role}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: rank.color, fontWeight: 700 }}>
                    {rank.shortTitle} • {user?.rating ?? 0} XP
                  </span>
                </div>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline btn-sm mobile-hide" title="Admin Panel">
                  <Shield size={16} color="var(--warning)" />
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-outline btn-sm header-logout-btn" title="Sign out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
