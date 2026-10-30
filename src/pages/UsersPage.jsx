import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Search, Shield, Zap, ArrowUpDown } from 'lucide-react';
import { fetchAllUsers } from '../store/slices/usersSlice';
import { UPLOADS_BASE_URL } from '../api/client';
import { getGamerRank } from '../utils/gamerRank';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);
  const currentAuthUser = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = (users || [])
    .filter((u) => {
      const matchesSearch =
        u.login?.toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()));

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (sortBy === 'login') {
        return (a.login || '').localeCompare(b.login || '');
      }
      if (sortBy === 'newest') {
        return Number(b.id) - Number(a.id);
      }
      return 0;
    });

  return (
    <div className="users-page">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={28} color="var(--primary)" /> All members
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Browse all registered players, community contributors, and forum masters
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '420px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }}
          />
          <input
            type="text"
            style={{ width: '100%', paddingLeft: '2.6rem' }}
            placeholder="Search by gamer tag or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={16} color="var(--text-light)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="table-select"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="rating">Top XP / Rating</option>
              <option value="login">Gamer Tag (A-Z)</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="table-select"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Forum Masters (Admin)</option>
            <option value="user">Players (User)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {isLoading && (!users || users.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading community members...
        </div>
      ) : filteredUsers.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem'
          }}
        >
          {filteredUsers.map((member) => {
            const isSelf = currentAuthUser && Number(currentAuthUser.id) === Number(member.id);
            const effectiveAvatar = isSelf ? (currentAuthUser.profile_picture || member.profile_picture) : member.profile_picture;

            const avatarSrc = effectiveAvatar
              ? (effectiveAvatar.startsWith('http')
                  ? effectiveAvatar
                  : `${UPLOADS_BASE_URL}/avatars/${effectiveAvatar}`)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.login || 'Player')}&background=9b1d3a&color=fff`;

            const rank = getGamerRank(member.rating);

            return (
              <Link
                key={member.id}
                to={`/profile/${member.id}`}
                className="card hud-corner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.15rem',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <img
                  key={avatarSrc}
                  src={avatarSrc}
                  alt={member.login}
                  className="avatar-img"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderColor: rank.color,
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    e.target.src =
                      'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(member.login || 'Player') +
                      '&background=9b1d3a&color=fff';
                  }}
                />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-white)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {member.login}
                    </span>

                    {member.role === 'admin' && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          borderColor: 'rgba(239, 68, 68, 0.4)',
                          fontSize: '0.62rem',
                          padding: '0.1rem 0.35rem'
                        }}
                      >
                        <Shield size={10} style={{ display: 'inline', marginRight: '2px' }} />
                        ADMIN
                      </span>
                    )}
                  </div>

                  {member.full_name && member.full_name !== member.login && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '0.1rem'
                      }}
                    >
                      {member.full_name}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.45rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        backgroundColor: rank.border,
                        color: rank.color,
                        fontSize: '0.66rem',
                        padding: '0.1rem 0.4rem'
                      }}
                    >
                      {rank.shortTitle}
                    </span>

                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <Zap size={12} color="#f59e0b" />
                      <strong>{member.rating || 0}</strong> XP
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Users size={44} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-white)' }}>No members found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            No members matched your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
