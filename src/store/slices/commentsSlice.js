import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentsApi } from '../../api/comments.api';

export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId, { rejectWithValue }) => {
  try {
    const res = await commentsApi.getPostComments(postId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch comments');
  }
});

export const addComment = createAsyncThunk('comments/addComment', async ({ postId, content }, { rejectWithValue }) => {
  try {
    const res = await commentsApi.createComment(postId, content);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to post comment');
  }
});

export const updateCommentStatus = createAsyncThunk('comments/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await commentsApi.updateComment(id, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update comment status');
  }
});

export const updateCommentContent = createAsyncThunk('comments/updateContent', async ({ id, content }, { rejectWithValue }) => {
  try {
    const res = await commentsApi.updateComment(id, { content });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update comment content');
  }
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (id, { rejectWithValue }) => {
  try {
    await commentsApi.deleteComment(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete comment');
  }
});

export const voteComment = createAsyncThunk('comments/voteComment', async ({ id, type }, { rejectWithValue }) => {
  try {
    const res = await commentsApi.voteComment(id, type);
    return { id, currentStatus: res.data.currentStatus };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to vote on comment');
  }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearComments: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCommentStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCommentContent.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  }
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;