import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsApi } from '../../api/posts.api';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params, { rejectWithValue }) => {
  try {
    const res = await postsApi.getPosts(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch posts');
  }
});

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
  try {
    const res = await postsApi.getPostById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch post details');
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (data, { rejectWithValue }) => {
  try {
    const res = await postsApi.createPost(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create post');
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await postsApi.updatePost(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update post');
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    await postsApi.deletePost(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete post');
  }
});

export const votePost = createAsyncThunk('posts/votePost', async ({ id, type }, { rejectWithValue }) => {
  try {
    const res = await postsApi.votePost(id, type);
    return { id, currentStatus: res.data.currentStatus };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to vote on post');
  }
});

export const toggleFavoritePost = createAsyncThunk('posts/toggleFavorite', async (id, { rejectWithValue }) => {
  try {
    const res = await postsApi.toggleFavorite(id);
    return { id, isFavorite: res.data.isFavorite };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to toggle favorite');
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    currentPost: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    filters: {
      search: '',
      categoryId: '',
      sortBy: 'likes',
      order: 'DESC',
      dateFrom: '',
      dateTo: '',
      status: ''
    },
    isLoading: false,
    error: null
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        categoryId: '',
        sortBy: 'likes',
        order: 'DESC',
        dateFrom: '',
        dateTo: '',
        status: ''
      };
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.posts;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(toggleFavoritePost.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost.is_favorite = action.payload.isFavorite;
        }
      });
  }
});

export const { setFilter, resetFilters, setPage, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
