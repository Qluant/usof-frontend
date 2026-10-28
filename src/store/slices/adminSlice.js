import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/admin.api';
import { usersApi } from '../../api/users.api';

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getStats();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch admin stats');
  }
});

export const fetchAllUsers = createAsyncThunk('admin/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await usersApi.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch users list');
  }
});

export const createUserByAdmin = createAsyncThunk('admin/createUser', async (data, { rejectWithValue }) => {
  try {
    const res = await usersApi.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create user');
  }
});

export const deleteUserByAdmin = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await usersApi.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete user');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  }
});

export default adminSlice.reducer;
