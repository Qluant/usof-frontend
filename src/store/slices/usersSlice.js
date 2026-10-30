import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../api/users.api';
import { updateCurrentUser } from './authSlice';

export const fetchAllUsers = createAsyncThunk('users/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await usersApi.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch users');
  }
});

export const fetchUserProfile = createAsyncThunk('users/fetchProfile', async (id, { rejectWithValue }) => {
  try {
    const res = await usersApi.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch user profile');
  }
});

export const updateUserProfile = createAsyncThunk('users/updateProfile', async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
  try {
    const res = await usersApi.update(id, data);
    const currentAuthId = getState().auth.user?.id;
    if (Number(id) === Number(currentAuthId)) {
      dispatch(updateCurrentUser(res.data));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update profile');
  }
});

export const uploadUserAvatar = createAsyncThunk('users/uploadAvatar', async (formData, { dispatch, rejectWithValue }) => {
  try {
    const res = await usersApi.uploadAvatar(formData);
    dispatch(updateCurrentUser(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to upload avatar');
  }
});

export const fetchFavorites = createAsyncThunk('users/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const res = await usersApi.getFavorites();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch favorites');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    selectedUser: null,
    favorites: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.selectedUser && Number(state.selectedUser.id) === Number(updated.id)) {
          state.selectedUser.profile_picture = updated.profile_picture;
        }
        if (state.favorites && state.favorites.length > 0) {
          state.favorites = state.favorites.map((p) =>
            Number(p.author_id) === Number(updated.id)
              ? { ...p, author_avatar: updated.profile_picture }
              : p
          );
        }
        if (state.users && state.users.length > 0) {
          state.users = state.users.map((u) =>
            Number(u.id) === Number(updated.id)
              ? { ...u, profile_picture: updated.profile_picture }
              : u
          );
        }
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  }
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
