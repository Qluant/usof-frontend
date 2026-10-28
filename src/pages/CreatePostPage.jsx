import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { Send, Eye, Edit2 } from 'lucide-react';
import TagBadge from '../components/common/TagBadge';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  }, [dispatch]);

  const handleCategoryToggle = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content explanation is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const newPost = await dispatch(
        createPost({
          title,
          content,
          categories: selectedCategories
        })
      ).unwrap();
      navigate(`/posts/${newPost.id}`);
    } catch (err) {
      setError(err || 'Failed to publish discussion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chosenCategories = categories.filter((c) => selectedCategories.includes(c.id));

  return (
    <div className="content-area" style={{ maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Start a Gaming Discussion / Guide</h1>
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
              Author: <strong>{user?.login || 'You'}</strong> | Just now
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
              <Send size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Topic'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Discussion Title</label>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Be specific about the game, boss, build, or question you want to discuss.
            </p>
            <input
              type="text"
              placeholder="e.g. Best Bleed/Dexterity build for Shadow of the Erdtree DLC?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Details, Strategies or Breakdown</label>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Include game patch version, platform (PC/PS5/Xbox/Switch), and specific tactics.
            </p>
            <textarea
              rows={8}
              placeholder="Describe your current loadout, the boss fight or topic step, and what strategies you tested..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Game Genres & Tags</label>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Select categories that describe what game genre or topic your post covers.
            </p>
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
            <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Send size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Discussion'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}