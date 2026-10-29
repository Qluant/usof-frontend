import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesApi } from '../../api/categories.api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await categoriesApi.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch categories');
  }
});

export const fetchCategoryById = createAsyncThunk('categories/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await categoriesApi.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch category');
  }
});

export const fetchCategoryPosts = createAsyncThunk('categories/fetchPosts', async ({ id, params }, { rejectWithValue }) => {
  try {
    const res = await categoriesApi.getCategoryPosts(id, params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch category posts');
  }
});

export const createCategory = createAsyncThunk('categories/create', async (data, { rejectWithValue }) => {
  try {
    const res = await categoriesApi.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create category');
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await categoriesApi.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update category');
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await categoriesApi.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete category');
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    selectedCategory: null,
    categoryPosts: [],
    categoryPostsTotal: 0,
    categoryPostsLoading: false,
    isLoading: false,
    error: null
  },
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      state.categoryPosts = [];
      state.categoryPostsTotal = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryPosts.pending, (state) => {
        state.categoryPostsLoading = true;
      })
      .addCase(fetchCategoryPosts.fulfilled, (state, action) => {
        state.categoryPostsLoading = false;
        state.categoryPosts = action.payload.posts || [];
        state.categoryPostsTotal = action.payload.total || 0;
      })
      .addCase(fetchCategoryPosts.rejected, (state, action) => {
        state.categoryPostsLoading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedCategory && state.selectedCategory.id === action.payload.id) {
          state.selectedCategory = { ...state.selectedCategory, ...action.payload };
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        if (state.selectedCategory && state.selectedCategory.id === action.payload) {
          state.selectedCategory = null;
        }
      });
  }
});

export const { clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
