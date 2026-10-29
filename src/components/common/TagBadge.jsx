import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../store/slices/postsSlice';

function getTagStyle(title = '') {
  const lower = title.toLowerCase();

  if (lower.includes('rpg') || lower.includes('action') || lower.includes('soul')) {
    return {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)',
      color: '#fbbf24'
    };
  }

  if (lower.includes('fps') || lower.includes('competitive') || lower.includes('shooter')) {
    return {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.35)',
      color: '#38bdf8'
    };
  }

  if (lower.includes('strategy') || lower.includes('sandbox') || lower.includes('sim')) {
    return {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      color: '#34d399'
    };
  }

  if (lower.includes('indie') || lower.includes('mod')) {
    return {
      bg: 'rgba(236, 72, 153, 0.12)',
      border: 'rgba(236, 72, 153, 0.35)',
      color: '#f472b6'
    };
  }

  if (lower.includes('hardware') || lower.includes('deck') || lower.includes('pc')) {
    return {
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.35)',
      color: '#c084fc'
    };
  }

  return {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.35)',
    color: '#a5b4fc'
  };
}

export default function TagBadge({ id, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();
    if (id) {
      navigate(`/categories/${id}`);
    }
  };

  const style = getTagStyle(title);

  return (
    <span
      onClick={handleClick}
      className="tag-badge"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color
      }}
    >
      #{title}
    </span>
  );
}
