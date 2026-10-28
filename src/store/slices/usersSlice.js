import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../api/users.api';
import { updateCurrentUser } from './authSlice';

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
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser.profile_picture = action.payload.profile_picture;
        }
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  }
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
