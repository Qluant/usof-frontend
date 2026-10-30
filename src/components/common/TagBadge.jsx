import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TagBadge({ id, title }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    if (id) {
      navigate(`/categories/${id}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      className="tag-badge"
    >
      #{title}
    </span>
  );
}
