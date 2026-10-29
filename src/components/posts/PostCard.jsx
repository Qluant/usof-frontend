import React from 'react';
import { Link } from 'react-router-dom';
import TagBadge from '../common/TagBadge';
import { UPLOADS_BASE_URL } from '../../api/client';
import { getGamerRank } from '../../utils/gamerRank';

export default function PostCard({ post }) {
  const avatarSrc = post.author_avatar?.startsWith('http')
    ? post.author_avatar
    : `${UPLOADS_BASE_URL}/avatars/${post.author_avatar || 'default-avatar.png'}`;

  const formattedDate = new Date(post.publish_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const rank = getGamerRank(post.author_rating);

  return (
    <article className="post-card hud-corner">
      <div className="post-stats-col">
        <div className="stat-box">
          <span className="stat-value" style={{ color: post.score > 0 ? 'var(--accent)' : post.score < 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {post.score ?? 0}
          </span>
          <span className="stat-label">score</span>
        </div>

        <div className="stat-box">
          <span className="stat-value">{post.likes_count ?? 0}</span>
          <span className="stat-label">likes</span>
        </div>
      </div>

      <div className="post-main-col">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ width: '100%' }}>
            <Link to={`/posts/${post.id}`} className="post-title">
              {post.status === 'active' ? (
                <span className="beacon-dot" title="Active Discussion" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem', position: 'relative', top: '-1px' }} />
              ) : (
                <span className="badge badge-inactive" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}>Archived</span>
              )}
              {post.title}
            </Link>
          </div>
        </div>

        <p className="post-excerpt">{post.content}</p>

        <div className="post-meta-row">
          <div className="tags-group">
            {post.categories?.map((cat) => (
              <TagBadge key={cat.id} id={cat.id} title={cat.title} />
            ))}
          </div>

          <div className="author-meta">
            <img
              src={avatarSrc}
              alt={post.author_login}
              className="avatar-img"
              style={{ width: '24px', height: '24px', borderColor: rank.color }}
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + (post.author_login || 'Player') + '&background=6366f1&color=fff';
              }}
            />
            <Link to={`/profile/${post.author_id}`} style={{ fontWeight: 600, color: 'var(--text-white)' }}>
              {post.author_login}
            </Link>
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
            <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>posted {formattedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
