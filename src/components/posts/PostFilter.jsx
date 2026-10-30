import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, resetFilters } from '../../store/slices/postsSlice';
import { RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

export default function PostFilter() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.posts);
  const { items: categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const handleSortChange = (sortBy) => {
    dispatch(setFilter({ sortBy }));
  };

  const handleOrderToggle = () => {
    const nextOrder = filters.order === 'ASC' ? 'DESC' : 'ASC';
    dispatch(setFilter({ order: nextOrder }));
  };

  return (
    <div className="filters-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => handleSortChange('likes')}
            className={`btn btn-sm ${filters.sortBy === 'likes' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 0, border: 'none' }}
          >
            Top Rated
          </button>
          <button
            onClick={() => handleSortChange('date')}
            className={`btn btn-sm ${filters.sortBy === 'date' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 0, border: 'none' }}
          >
            By Date
          </button>
          <button
            onClick={handleOrderToggle}
            className="btn btn-sm btn-outline"
            style={{ borderRadius: 0, borderLeft: '1px solid var(--border-color)', borderRight: 'none', borderTop: 'none', borderBottom: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title={`Sort Order: ${filters.order === 'ASC' ? 'Ascending (Oldest First)' : 'Descending (Newest First)'}`}
          >
            {filters.order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{filters.order === 'ASC' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>

        <select
          value={filters.categoryId}
          onChange={(e) => dispatch(setFilter({ categoryId: e.target.value }))}
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        {user?.role === 'admin' && (
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Locked/Archived Only</option>
          </select>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => dispatch(setFilter({ dateFrom: e.target.value }))}
          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
          title="Date From"
        />
        <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => dispatch(setFilter({ dateTo: e.target.value }))}
          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
          title="Date To"
        />

        <button
          onClick={() => dispatch(resetFilters())}
          className="btn btn-outline btn-sm"
          title="Reset Filters"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
