import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://connections-api.goit.global';

export const setAuthHeader = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  axios.defaults.headers.common['Authorization'] = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('/users/signup', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Registration failed';
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('/users/login', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Login failed';
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    if (!token) {
      return thunkAPI.rejectWithValue({
        message: 'No token provided',
        status: 401,
      });
    }
    setAuthHeader(token);
    await axios.post('/users/logout');
    clearAuthHeader();
    return {};
  } catch (error) {
    const errorData = error.response?.data || {};
    const errorMessage =
      errorData.message || errorData.error || 'Logout failed';
    return thunkAPI.rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      details: errorData,
    });
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.get('/users/current');
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Refresh failed';
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);
