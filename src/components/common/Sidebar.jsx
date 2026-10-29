import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swords, Gamepad2, Bookmark, User, Shield, ChevronLeft, ChevronRight, Flame, Users } from 'lucide-react';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { setFilter } from '../../store/slices/postsSlice';

export default function Sidebar({ isCollapsed, onToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: categories } = useSelector((state) => state.categories);
  const { filters } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const topCategories = [...(categories || [])]
    .sort((a, b) => (Number(b.posts_count) || 0) - (Number(a.posts_count) || 0))
    .slice(0, 7);

  const handleCategoryClick = (catId) => {
    dispatch(setFilter({ categoryId: String(catId) }));
    navigate('/');
  };

  if (isCollapsed) {
    return (
      <aside className="sidebar collapsed">
        <button
          onClick={onToggle}
          className="btn btn-outline sidebar-collapse-btn"
          title="Expand Sidebar"
          style={{ width: '38px', height: '38px', padding: 0 }}
        >
          <ChevronRight size={18} />
        </button>

        <div className="sidebar-collapsed-icons">
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            title="Discussions & Topics"
            end
          >
            <Swords size={18} />
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            title="Games & Genres"
          >
            <Gamepad2 size={18} />
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            title="All members"
          >
            <Users size={18} />
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/favorites"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
                title="Saved Topics"
              >
                <Bookmark size={18} />
              </NavLink>

              <NavLink
                to={`/profile/${user?.id}`}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
                title="Player Profile"
              >
                <User size={18} />
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
                  title="Guildmaster Panel"
                >
                  <Shield size={18} color="var(--warning)" />
                </NavLink>
              )}
            </>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-collapse-header">
        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
          HUD TACTICS
        </span>
        <button
          onClick={onToggle}
          className="btn btn-outline sidebar-collapse-btn"
          title="Collapse Sidebar"
          style={{ padding: '0.25rem 0.4rem' }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="sidebar-nav-group">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <Swords size={18} />
          <span>Discussions & Topics</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <Gamepad2 size={18} />
          <span>Games & Genres</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>All members</span>
        </NavLink>

        {isAuthenticated && (
          <>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Bookmark size={18} />
              <span>Saved Topics</span>
            </NavLink>

            <NavLink
              to={`/profile/${user?.id}`}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Player Profile</span>
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Shield size={18} color="var(--warning)" />
                <span>Guildmaster Panel</span>
              </NavLink>
            )}
          </>
        )}
      </div>

      <div className="sidebar-section-title">
        <Flame size={14} color="var(--primary)" />
        <span>TOP 7 CATEGORIES</span>
      </div>

      <div className="sidebar-categories-group">
        {topCategories.map((cat) => {
          const isSelected = String(filters.categoryId) === String(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`sidebar-category-item ${isSelected ? 'active' : ''}`}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cat.title}
              </span>
              <span className="sidebar-category-count">
                {cat.posts_count || 0}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
