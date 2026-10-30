import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from '../store/slices/usersSlice';
import { postsApi } from '../api/posts.api';
import PostCard from '../components/posts/PostCard';
import { Mail, Zap, Shield, Camera, Edit3, Check, X, Swords } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../api/client';

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedUser, isLoading } = useSelector((state) => state.users);

  const profileId = id ? parseInt(id, 10) : authUser?.id;
  const isOwnProfile = authUser && authUser.id === profileId;
  const isAdmin = authUser?.role === 'admin';
  const canEdit = isOwnProfile || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [login, setLogin] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [selectedUser?.profile_picture]);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchUserProfile(profileId));
      fetchUserPosts(profileId);
    }
  }, [dispatch, profileId]);

  useEffect(() => {
    if (selectedUser) {
      setLogin(selectedUser.login || '');
      setFullName(selectedUser.full_name || '');
      setEmail(selectedUser.email || '');
    }
  }, [selectedUser]);

  const fetchUserPosts = async (authorId) => {
    setPostsLoading(true);
    try {
      const res = await postsApi.getPosts({ authorId, limit: 50 });
      setUserPosts(res.data.posts || []);
    } catch (err) {
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError(null);
    try {
      await dispatch(updateUserProfile({ id: profileId, data: { login, full_name: fullName } })).unwrap();
      setIsEditing(false);
    } catch (err) {
      setEditError(err || 'Failed to update profile');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await dispatch(uploadUserAvatar(formData)).unwrap();
      await dispatch(fetchUserProfile(profileId));
      if (profileId) {
        fetchUserPosts(profileId);
      }
    } catch (err) {
      setUploadError(err || 'Failed to upload avatar');
    }
  };

  if (isLoading && !selectedUser) {
    return <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>Loading profile...</div>;
  }

  if (!selectedUser) {
    return (
      <div className="card" style={{ color: 'var(--danger)', textAlign: 'center' }}>
        User profile not found.
      </div>
    );
  }

  const avatarSrc = selectedUser.profile_picture
    ? (selectedUser.profile_picture.startsWith('http')
        ? selectedUser.profile_picture
        : `${UPLOADS_BASE_URL}/avatars/${selectedUser.profile_picture}`)
    : null;

  return (
    <div className="profile-container">
      <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '96px', height: '96px', flexShrink: 0 }}>
          {avatarSrc && !avatarFailed ? (
            <img
              key={avatarSrc}
              src={avatarSrc}
              alt={selectedUser.login}
              className="avatar-img-lg"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9b1d3a, #540919)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#fff',
                border: '3px solid var(--primary)'
              }}
            >
              {selectedUser.login?.charAt(0).toUpperCase()}
            </div>
          )}
          {isOwnProfile && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
              onClick={() => fileInputRef.current?.click()}
              title="Change avatar"
            >
              <Camera size={16} />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-white)' }}>
              {selectedUser.full_name || selectedUser.login}
            </h2>
            <span className={`badge ${selectedUser.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
              <Shield size={12} style={{ marginRight: '0.25rem' }} />
              {selectedUser.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            @{selectedUser.login}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={16} />
              <span>{selectedUser.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} color="var(--warning)" fill="var(--warning)" />
              <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{selectedUser.rating || 0} XP</span>
            </div>
          </div>
        </div>

        {canEdit && !isEditing && (
          <button
            className="btn btn-outline"
            onClick={() => setIsEditing(true)}
            style={{ marginLeft: 'auto' }}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {uploadError && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {uploadError}
        </div>
      )}

      {isEditing && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-white)' }}>Edit Profile</h3>
          {editError && (
            <div className="card" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
              {editError}
            </div>
          )}
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} /> Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <div className="page-header" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-white)' }}>
            <Swords size={20} color="#818cf8" />
            Discussions by {selectedUser.login} ({userPosts.length})
          </h3>
        </div>

        {postsLoading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>Loading posts...</div>
        ) : userPosts.length > 0 ? (
          <div>
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No discussions published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
