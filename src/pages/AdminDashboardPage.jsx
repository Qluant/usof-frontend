import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminStats,
  fetchAllUsers,
  createUserByAdmin,
  deleteUserByAdmin
} from '../store/slices/adminSlice';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../store/slices/categoriesSlice';
import { usersApi } from '../api/users.api';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  FileText,
  FolderTree,
  Trash2,
  Edit2,
  Plus,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { stats, users, isLoading, error } = useSelector((state) => state.admin);
  const { items: categories } = useSelector((state) => state.categories);
  const { user: currentAdmin } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('overview');

  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ login: '', full_name: '', email: '', role: 'user' });
  const [editUserError, setEditUserError] = useState(null);

  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ login: '', full_name: '', email: '', password: '', password_confirmation: '', role: 'user' });
  const [createUserError, setCreateUserError] = useState(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', description: '' });
  const [categoryFormError, setCategoryFormError] = useState(null);

  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsers());
    dispatch(fetchCategories());
  }, [dispatch]);

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentAdmin?.id) {
      alert('You cannot delete your own admin account');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUserByAdmin(userId)).unwrap();
        showNotification('User deleted');
        dispatch(fetchAdminStats());
      } catch (err) {
        alert(err || 'Failed to delete user');
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await usersApi.update(userId, { role: newRole });
      dispatch(fetchAllUsers());
      showNotification('User role updated');
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setEditUserForm({
      login: user.login || '',
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'user'
    });
    setEditUserError(null);
    setEditUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setEditUserError(null);
    try {
      await usersApi.update(editingUser.id, editUserForm);
      showNotification('User updated successfully');
      setEditUserModalOpen(false);
      setEditingUser(null);
      dispatch(fetchAllUsers());
    } catch (err) {
      setEditUserError(err.response?.data?.message || err.message || 'Failed to update user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateUserError(null);
    try {
      await dispatch(createUserByAdmin(createUserForm)).unwrap();
      showNotification('User created successfully');
      setCreateUserModalOpen(false);
      setCreateUserForm({ login: '', full_name: '', email: '', password: '', password_confirmation: '', role: 'user' });
      dispatch(fetchAdminStats());
    } catch (err) {
      setCreateUserError(typeof err === 'string' ? err : err.message || 'Failed to create user');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCategoryFormError(null);
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, data: categoryForm })).unwrap();
        showNotification('Category updated successfully');
      } else {
        await dispatch(createCategory(categoryForm)).unwrap();
        showNotification('Category created successfully');
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ title: '', description: '' });
      dispatch(fetchAdminStats());
    } catch (err) {
      setCategoryFormError(err || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        showNotification('Category deleted');
        dispatch(fetchAdminStats());
      } catch (err) {
        alert(err || 'Failed to delete category');
      }
    }
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ title: category.title, description: category.description || '' });
    setCategoryModalOpen(true);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldAlert size={28} color="#818cf8" /> Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Overview, user administration, and category management
          </p>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch(fetchAdminStats());
            dispatch(fetchAllUsers());
            dispatch(fetchCategories());
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {actionSuccess && (
        <div className="card" style={{ color: 'var(--accent)', marginBottom: '1rem', borderLeft: '3px solid var(--accent)' }}>
          <CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
          <AlertCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
          <span>{error}</span>
        </div>
      )}

      <div className="tabs" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overview')}
        >
          Stats
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-value">{stats?.users ?? users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value">{stats?.posts ?? 0}</div>
              <div className="stat-label">Posts</div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value">{stats?.comments ?? 0}</div>
              <div className="stat-label">Comments</div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value">{stats?.categories ?? categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>

          {editUserModalOpen && (
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Edit User: {editingUser?.login}</h3>
              {editUserError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{editUserError}</span>
                </div>
              )}
              <form onSubmit={handleSaveUser}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUserForm.login}
                    onChange={(e) => setEditUserForm({ ...editUserForm, login: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUserForm.full_name}
                    onChange={(e) => setEditUserForm({ ...editUserForm, full_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-control"
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditUserModalOpen(false);
                      setEditingUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {createUserModalOpen && (
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Create New User</h3>
              {createUserError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{createUserError}</span>
                </div>
              )}
              <form onSubmit={handleCreateUser}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. john_doe"
                      value={createUserForm.login}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, login: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={createUserForm.full_name}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, full_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={createUserForm.email}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-control"
                      value={createUserForm.role}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={createUserForm.password}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={createUserForm.password_confirmation}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, password_confirmation: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-sm)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCreateUserModalOpen(false);
                      setCreateUserForm({ login: '', full_name: '', email: '', password: '', password_confirmation: '', role: 'user' });
                      setCreateUserError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Plus size={15} /> Create User
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditUserModalOpen(false);
                setCreateUserModalOpen((v) => !v);
              }}
            >
              <Plus size={16} /> New User
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><strong>{u.login}</strong></td>
                    <td>{u.full_name || '-'}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="table-select"
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        disabled={u.id === currentAdmin?.id}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>{u.rating || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditUser(u)}
                          title="Edit user profile"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === currentAdmin?.id}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ title: '', description: '' });
                setCategoryModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          {categoryModalOpen && (
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              {categoryFormError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{categoryFormError}</span>
                </div>
              )}
              <form onSubmit={handleSaveCategory}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={categoryForm.title}
                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCategoryModalOpen(false);
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td><strong>{cat.title}</strong></td>
                    <td>{cat.description || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditCategory(cat)}
                          title="Edit category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteCategory(cat.id)}
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
