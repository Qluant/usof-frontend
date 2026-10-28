import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/slices/usersSlice';
import PostCard from '../components/posts/PostCard';
import { Bookmark } from 'lucide-react';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { favorites, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="favorites-page">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Bookmark size={26} color="#818cf8" /> Saved Topics & Guides
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Discussions and boss strategies you have bookmarked for quick access
          </p>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {isLoading && favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading saved topics...
        </div>
      ) : favorites.length > 0 ? (
        <div>
          {favorites.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Bookmark size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-white)' }}>No saved topics yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Click the bookmark icon on any discussion or build guide to save it to your inventory.
          </p>
        </div>
      )}
    </div>
  );
}
