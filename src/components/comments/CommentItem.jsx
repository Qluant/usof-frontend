import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Lock, Unlock, Zap, Reply, CornerDownRight, Edit2, Check, X } from 'lucide-react';
import VoteButtons from '../common/VoteButtons';
import { voteComment, deleteComment, updateCommentStatus, addComment, updateCommentContent } from '../../store/slices/commentsSlice';
import { UPLOADS_BASE_URL } from '../../api/client';

export default function CommentItem({ comment }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const isAuthor = user?.id === comment.author_id;
  const isAdmin = user?.role === 'admin';

  const avatarSrc = comment.author_avatar?.startsWith('http')
    ? comment.author_avatar
    : `${UPLOADS_BASE_URL}/avatars/${comment.author_avatar || 'default-avatar.png'}`;

  const formattedDate = new Date(comment.publish_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleVote = (type) => {
    dispatch(voteComment({ id: comment.id, type }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      dispatch(deleteComment(comment.id));
    }
  };

  const handleToggleStatus = () => {
    const nextStatus = comment.status === 'active' ? 'inactive' : 'active';
    dispatch(updateCommentStatus({ id: comment.id, status: nextStatus }));
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      setIsSubmitting(true);
      await dispatch(addComment({ postId: comment.post_id, content: replyText })).unwrap();
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      alert(err || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsReplying(!isReplying);
    if (!isReplying && !replyText) {
      setReplyText(`@${comment.author_login} `);
    }
  };

  const openEdit = () => {
    setEditText(comment.content);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    try {
      setIsSavingEdit(true);
      await dispatch(updateCommentContent({ id: comment.id, content: editText })).unwrap();
      setIsEditing(false);
    } catch (err) {
      alert(err || 'Failed to edit comment');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="comment-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: comment.status === 'inactive' ? 0.7 : 1 }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <VoteButtons score={comment.score} userVote={comment.user_vote} onVote={handleVote} />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem' }}>
              <img
                src={avatarSrc}
                alt={comment.author_login}
                className="avatar-img"
                style={{ width: '22px', height: '22px' }}
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=' + (comment.author_login || 'Player') + '&background=6366f1&color=fff';
                }}
              />
              <Link to={`/profile/${comment.author_id}`} style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                {comment.author_login}
              </Link>
              <span className="xp-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                <Zap size={9} fill="var(--warning)" /> {comment.author_rating ?? 0} XP
              </span>
              <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{formattedDate}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {comment.status === 'inactive' && <span className="badge badge-inactive">Archived</span>}

              <button
                onClick={openReply}
                className={`btn btn-outline btn-sm ${isReplying ? 'btn-primary' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                title="Reply to this response"
              >
                <Reply size={13} />
                <span>Reply</span>
              </button>

              {isAuthor && (
                <button
                  onClick={openEdit}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                  title="Edit comment"
                >
                  <Edit2 size={13} />
                </button>
              )}

              {(isAuthor || isAdmin) && (
                <button
                  onClick={handleToggleStatus}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                  title={comment.status === 'active' ? 'Archive comment' : 'Unarchive comment'}
                >
                  {comment.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                </button>
              )}

              {(isAuthor || isAdmin) && (
                <button
                  onClick={handleDelete}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                  title="Delete comment"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} style={{ marginTop: '0.5rem' }}>
              <textarea
                rows={3}
                className="form-control"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline btn-sm"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="btn btn-primary btn-sm"
                >
                  <Check size={13} />
                  <span>{isSavingEdit ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          ) : (
            <p style={{ color: 'var(--text-main)', fontSize: '0.94rem', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
              {comment.content}
            </p>
          )}
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleSendReply} style={{ marginLeft: '3rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--accent)' }}>
            <CornerDownRight size={14} />
            <span>Replying to <strong>@{comment.author_login}</strong></span>
          </div>
          <textarea
            rows={2}
            className="form-control"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to @${comment.author_login}...`}
            style={{ width: '100%', marginBottom: '0.5rem' }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              <Reply size={13} />
              <span>{isSubmitting ? 'Sending...' : 'Reply'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}