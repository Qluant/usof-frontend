import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, updatePost } from '../store/slices/postsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { Save, Eye, Edit2 } from 'lucide-react';
import TagBadge from '../components/common/TagBadge';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPost: post, isLoading } = useSelector((state) => state.posts);
  const { items: categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setSelectedCategories(post.categories ? post.categories.map((c) => c.id) : []);
    }
  }, [post]);

  if (isLoading || !post) {
    return <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>Loading discussion...</div>;
  }

  const isAuthor = user?.id === post.author_id;
  const isAdmin = user?.role === 'admin';

  if (!isAuthor && !isAdmin) {
    return <div className="card" style={{ color: 'var(--danger)', textAlign: 'center' }}>Permission denied.</div>;
  }

  const handleCategoryToggle = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      await dispatch(
        updatePost({
          id: post.id,
          data: {
            title: isAuthor ? title : undefined,
            content: isAuthor ? content : undefined,
            categories: selectedCategories
          }
        })
      ).unwrap();
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err || 'Failed to update discussion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chosenCategories = categories.filter((c) => selectedCategories.includes(c.id));

  return (
    <div className="content-area" style={{ maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Discussion</h1>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${!previewMode ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
            onClick={() => setPreviewMode(false)}
          >
            <Edit2 size={14} /> Write
          </button>
          <button
            type="button"
            className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
            onClick={() => setPreviewMode(true)}
          >
            <Eye size={14} /> Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1.2rem', padding: '0.8rem 1rem' }}>
          {error}
        </div>
      )}

      {previewMode ? (
        <div className="card hud-corner" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Live Preview</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)' }}>
              {title.trim() || 'Untitled Topic'}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Author: <strong>{post.author_login}</strong>
            </div>
          </div>

          <div style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--text-main)', whiteSpace: 'pre-line', minHeight: '120px' }}>
            {content.trim() || 'No content entered yet.'}
          </div>

          {chosenCategories.length > 0 && (
            <div className="tags-group" style={{ marginTop: '0.5rem' }}>
              {chosenCategories.map((cat) => (
                <TagBadge key={cat.id} id={cat.id} title={cat.title} />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setPreviewMode(false)} className="btn btn-outline">
              Back to Edit
            </button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isAuthor ? (
            <>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="card hud-corner" style={{ background: 'rgba(222, 155, 53, 0.08)', borderColor: 'rgba(222, 155, 53, 0.25)', padding: '1rem' }}>
              <div style={{ color: 'var(--text-white)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                Moderator Category Management
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Per platform moderation rules, post content is immutable for moderators. As an administrator, you may adjust the categories assigned to this topic or toggle its status.
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Game Genres & Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate(`/posts/${post.id}`)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}