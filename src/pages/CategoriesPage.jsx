import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createCategory } from '../store/slices/categoriesSlice';
import { Gamepad2, Search, Plus, Flame, AlertCircle, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, isLoading, error } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = (categories || []).filter(
    (cat) =>
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await dispatch(createCategory({ title: newTitle, description: newDescription })).unwrap();
      setNewTitle('');
      setNewDescription('');
      setShowAddForm(false);
    } catch (err) {
      setFormError(err || 'Failed to create category');
    }
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Gamepad2 size={28} color="var(--primary)" /> Categories
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Browse posts organized by category
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} /> {showAddForm ? 'Close Form' : 'New Category'}
          </button>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="card hud-corner" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-white)' }}>Create New Category</h3>
          {formError && (
            <div className="alert alert-error" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleCreateCategory}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. JavaScript, Algorithms, Databases"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Brief description of topics covered in this category"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '500px' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
        <input
          type="text"
          style={{ width: '100%', paddingLeft: '2.6rem' }}
          placeholder="Filter categories by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {isLoading && (!categories || categories.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading categories...
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="category-card hud-corner"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-card-header">
                <Flame size={20} className="category-icon" color="var(--primary)" />
                <h3 className="category-card-title">{category.title}</h3>
                {category.posts_count !== undefined && (
                  <span className="sidebar-category-count" style={{ marginLeft: 'auto' }}>
                    {category.posts_count} {category.posts_count === 1 ? 'topic' : 'topics'}
                  </span>
                )}
              </div>
              <p className="category-card-description">
                {category.description || 'No description provided.'}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.9rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}
              >
                <span>View discussions</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No categories found matching your search.</p>
        </div>
      )}
    </div>
  );
}
