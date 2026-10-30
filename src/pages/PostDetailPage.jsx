import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Bookmark, Edit3, Trash2, Lock, Unlock, Share2, Zap } from 'lucide-react';
import { fetchPostById, deletePost, updatePost, votePost, toggleFavoritePost } from '../store/slices/postsSlice';
import { fetchComments } from '../store/slices/commentsSlice';
import VoteButtons from '../components/common/VoteButtons';
import TagBadge from '../components/common/TagBadge';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import ShareModal from '../components/posts/ShareModal';
import { UPLOADS_BASE_URL } from '../api/client';
import { getGamerRank } from '../utils/gamerRank';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost: post, isLoading, error } = useSelector((state) => state.posts);
  const { items: comments } = useSelector((state) => state.comments);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>Loading discussion details...</div>;
  }

  if (error || !post) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--danger)', padding: '2rem' }}>
        {error || 'Discussion not found or is archived.'}
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;
  const isAdmin = user?.role === 'admin';

  const effectiveAvatar = isAuthor ? (user?.profile_picture || post.author_avatar) : post.author_avatar;

  const avatarSrc = effectiveAvatar
    ? (effectiveAvatar.startsWith('http')
        ? effectiveAvatar
        : `${UPLOADS_BASE_URL}/avatars/${effectiveAvatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_login || 'User')}&background=9b1d3a&color=fff`;

  const formattedDate = new Date(post.publish_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const rank = getGamerRank(post.author_rating);

  const handleVote = (type) => {
    dispatch(votePost({ id: post.id, type }));
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavoritePost(post.id));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      await dispatch(deletePost(post.id));
      navigate('/');
    }
  };

  const handleToggleStatus = () => {
    const nextStatus = post.status === 'active' ? 'inactive' : 'active';
    dispatch(updatePost({ id: post.id, data: { status: nextStatus } }));
  };

  return (
    <div className="content-area">
      <div className="card hud-corner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.3px', margin: '0 0 0.4rem 0', lineHeight: 1.25 }}>
              {post.status === 'active' ? (
                <span className="beacon-dot" title="Active Discussion" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.6rem', position: 'relative', top: '-1px' }} />
              ) : (
                <span className="badge badge-inactive" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.6rem' }}>Archived</span>
              )}
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Posted on <strong>{formattedDate}</strong></span>
              <span>Status: <strong className={`badge ${post.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{post.status === 'active' ? 'Active' : 'Archived'}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleFavorite}
              className={`btn btn-sm ${post.is_favorite ? 'btn-accent' : 'btn-outline'}`}
              title="Save post"
            >
              <Bookmark size={16} />
              <span>{post.is_favorite ? 'Saved' : 'Save'}</span>
            </button>

            <button onClick={() => setShareOpen(true)} className="btn btn-outline btn-sm" title="Share discussion">
              <Share2 size={16} />
              <span>Share</span>
            </button>

            {(isAuthor || isAdmin) && (
              <Link to={`/posts/${post.id}/edit`} className="btn btn-outline btn-sm">
                <Edit3 size={16} />
                <span>Edit</span>
              </Link>
            )}

            {(isAuthor || isAdmin) && (
              <button
                onClick={handleToggleStatus}
                className="btn btn-outline btn-sm"
                title={post.status === 'active' ? 'Archive discussion' : 'Reactivate discussion'}
              >
                {post.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
            )}

            {(isAuthor || isAdmin) && (
              <button
                onClick={handleDelete}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--danger)' }}
                title="Delete discussion"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <VoteButtons score={post.score} userVote={post.user_vote} onVote={handleVote} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
              {post.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div className="tags-group">
                {post.categories?.map((cat) => (
                  <TagBadge key={cat.id} id={cat.id} title={cat.title} />
                ))}
              </div>

              <div
                className="user-profile-pill"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <img
                  key={avatarSrc}
                  src={avatarSrc}
                  alt={post.author_login}
                  className="avatar-img"
                  style={{ width: '36px', height: '36px' }}
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author_login || 'User') + '&background=9b1d3a&color=fff';
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 600 }}>
                    {rank.shortTitle}
                  </div>
                  <Link to={`/profile/${post.author_id}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-white)' }}>
                    {post.author_login}
                  </Link>
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.78rem', color: '#000000' }}>
                    • {post.author_rating ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-white)' }}>
          {comments.length} {comments.length === 1 ? 'Response' : 'Responses'}
        </h2>

        <CommentList comments={comments} />

        <CommentForm postId={post.id} isPostActive={post.status === 'active'} />
      </div>

      <ShareModal
        post={post}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
