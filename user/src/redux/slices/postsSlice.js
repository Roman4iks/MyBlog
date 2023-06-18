import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPost = createAsyncThunk('posts/fetchPost', async id => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});

export const fetchPostsTags = createAsyncThunk('posts/fetchPostsTags', async () => {
  const { data } = await axios.get('/posts/tags');
  return data;
});

export const fetchDeletePost = createAsyncThunk('posts/fetchDeletePost', async id => {
  await axios.delete(`/posts/${id}`);
});

export const fetchPatchPost = createAsyncThunk('posts/fetchPatchPost', async ({ id, fields }) => {
  await axios.patch(`/posts/${id}`, fields);
});

export const fetchAddPost = createAsyncThunk('posts/fetchAddPost', async fields => {
  const { data } = await axios.post('/posts', fields);
  return data;
});

const initialState = {
  sort: 0,
  filter: {
    tag: null,
  },
  post: {
    item: null,
    status: 'loading',
  },
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setTag: (state, action) => {
      state.filter.tag = action.payload;
    },
  },
  extraReducers: {
    [fetchPosts.pending]: state => {
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.status = 'success';
      state.posts.items = action.payload;
    },
    [fetchPosts.rejected]: state => {
      state.posts.status = 'error';
      state.posts.items = [];
    },

    [fetchPost.pending]: state => {
      state.post.status = 'loading';
      state.post.item = null;
    },
    [fetchPost.fulfilled]: (state, action) => {
      state.post.status = 'success';
      state.post.item = action.payload;
    },
    [fetchPost.rejected]: state => {
      state.post.status = 'error';
      state.post.item = null;
    },

    [fetchPostsTags.pending]: state => {
      state.tags.status = 'loading';
    },
    [fetchPostsTags.fulfilled]: (state, action) => {
      state.tags.status = 'success';
      state.tags.items = action.payload;
    },
    [fetchPostsTags.rejected]: state => {
      state.tags.status = 'error';
      state.tags.items = [];
    },

    [fetchDeletePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg);
    },
    [fetchDeletePost.rejected]: state => {
      state.posts.status = 'error';
    },
  },
});
export const { setSort, setTag } = postSlice.actions;

export const postsReducer = postSlice.reducer;
