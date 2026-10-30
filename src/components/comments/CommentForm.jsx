import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../store/slices/commentsSlice';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CommentForm({ postId, isPostActive = true }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isPostActive) {
    return (
      <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--bg-input)', padding: '1.25rem', marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          This discussion has been archived. New comments and responses are disabled.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '1.75rem', marginTop: '1.5rem' }}>
        <p style={{ marginBottom: '0.85rem', color: 'var(--text-muted)' }}>
          You must be signed in to post a comment.
        </p>
        <Link to="/login" className="btn btn-primary btn-sm">
          Sign In to Comment
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment content cannot be empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await dispatch(addComment({ postId, content })).unwrap();
      setContent('');
    } catch (err) {
      setError(err || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1.75rem' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-white)' }}>
        Leave a Comment
      </h3>

      {error && <div className="form-error" style={{ marginBottom: '0.8rem' }}>{error}</div>}

      <div className="form-group">
        <textarea
          rows={4}
          placeholder="Write your comment or answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          <Send size={16} />
          <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
        </button>
      </div>
    </form>
  );
}
