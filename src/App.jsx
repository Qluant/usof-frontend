import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import UsersPage from './pages/UsersPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(
    () => localStorage.getItem('gameguide_sidebar_collapsed') === 'true'
  );

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('gameguide_sidebar_collapsed', String(!prev));
      return !prev;
    });
  };

  return (
    <div className="app-container">
      <Header />
      <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />
            <Route path="/password-reset" element={<RequestPasswordResetPage />} />
            <Route path="/password-reset/:token" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}
