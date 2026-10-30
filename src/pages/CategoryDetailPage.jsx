import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Gamepad2, ArrowLeft, PlusCircle, Search, Flame, AlertCircle } from 'lucide-react';
import { fetchCategoryById, fetchCategoryPosts, clearSelectedCategory } from '../store/slices/categoriesSlice';
import PostCard from '../components/posts/PostCard';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCategory: category, categoryPosts, categoryPostsTotal, categoryPostsLoading, isLoading, error } = useSelector((state) => state.categories);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [postSearch, setPostSearch] = useState('');
  const [postSort, setPostSort] = useState('likes');

  useEffect(() => {
    dispatch(fetchCategoryById(id));
    dispatch(fetchCategoryPosts({ id, params: { sortBy: postSort, search: postSearch || undefined } }));

    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, id, postSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchCategoryPosts({ id, params: { sortBy: postSort, search: postSearch || undefined } }));
  };

  if (isLoading && !category) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        Loading game category details...
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="card hud-corner" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '560px', margin: '2rem auto' }}>
        <AlertCircle size={44} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: 'var(--text-white)', marginBottom: '0.5rem' }}>Game Category Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {error || 'The requested category does not exist or has been removed.'}
        </p>
        <Link to="/categories" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Games & Genres
        </Link>
      </div>
    );
  }

  return (
    <div className="category-detail-page">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/categories"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={14} /> Back to Games & Genres
        </Link>
      </div>

      <div
        className="card hud-corner"
        style={{
          marginBottom: '1.75rem',
          padding: '1.75rem',
          borderLeft: '4px solid var(--primary)',
          background: 'linear-gradient(135deg, rgba(155, 29, 58, 0.12) 0%, var(--bg-card) 60%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Gamepad2 size={26} color="var(--primary)" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-white)', margin: 0 }}>
                {category?.title}
              </h1>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0.5rem 0 1rem 0', maxWidth: '720px' }}>
              {category?.description || 'No description provided for this gaming category.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Flame size={14} color="var(--primary)" />
                <strong>{category?.posts_count ?? categoryPostsTotal}</strong> active {category?.posts_count === 1 ? 'discussion' : 'discussions'}
              </span>
            </div>
          </div>

          <div>
            {isAuthenticated ? (
              <Link to="/posts/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={16} />
                <span>New Topic in {category?.title}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Log In to Post</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder={`Search within ${category?.title || 'category'}...`}
            value={postSearch}
            onChange={(e) => setPostSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Sort:</span>
          <select
            value={postSort}
            onChange={(e) => setPostSort(e.target.value)}
            className="table-select"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="likes">Most Popular (Likes)</option>
            <option value="date">Latest (Date)</option>
          </select>
        </div>
      </div>

      {categoryPostsLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading topics for {category?.title}...
        </div>
      ) : categoryPosts.length > 0 ? (
        <div>
          {categoryPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="card hud-corner" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Gamepad2 size={44} style={{ color: 'var(--text-light)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'var(--text-white)' }}>No discussions yet in this genre</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '440px', margin: '0.5rem auto 1.5rem auto' }}>
            Be the first forum player to start a discussion, share a build, or ask for tactical advice in #{category?.title}.
          </p>
          {isAuthenticated && (
            <Link to="/posts/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={16} /> Start First Discussion
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
