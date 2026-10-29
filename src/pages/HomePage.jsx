import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusCircle, Users } from 'lucide-react';
import { fetchPosts, setPage } from '../store/slices/postsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import PostCard from '../components/posts/PostCard';
import PostFilter from '../components/posts/PostFilter';
import Pagination from '../components/common/Pagination';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: posts, total, page, totalPages, filters, isLoading, error } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchPosts({
        page,
        limit: 10,
        sortBy: filters.sortBy,
        order: filters.order,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        status: filters.status || undefined
      })
    );
  }, [dispatch, page, filters]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {filters.search ? `Discussions matching "${filters.search}"` : 'Community Topics & Discussions'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {total} {total === 1 ? 'discussion' : 'discussions'} active
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/users" className="btn btn-outline">
            <Users size={16} />
            <span>All members</span>
          </Link>
          {isAuthenticated && (
            <Link to="/posts/new" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>New Topic</span>
            </Link>
          )}
        </div>
      </div>

      <PostFilter />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading community topics...
        </div>
      ) : error ? (
        <div className="card" style={{ color: 'var(--danger)', textAlign: 'center' }}>
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <h3>No discussions found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try adjusting your search filters or be the first to start a new gaming thread.
          </p>
        </div>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
