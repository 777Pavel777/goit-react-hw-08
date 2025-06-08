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
      console.log('Sending registration data:', credentials);
      const response = await axios.post('/users/signup', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Registration response:', response.data);
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Registration failed';
      console.log('Registration error:', {
        status: error.response?.status,
        message: errorMessage,
        details: errorData,
      });
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
      console.log('Sending login data:', credentials);
      const response = await axios.post('/users/login', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Login response:', response.data);
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Login failed';
      console.log('Login error:', {
        status: error.response?.status,
        message: errorMessage,
        details: errorData,
      });
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
      console.log('No token provided for logout');
      return thunkAPI.rejectWithValue({
        message: 'No token provided',
        status: 401,
      });
    }
    setAuthHeader(token);
    await axios.post('/users/logout');
    console.log('Logout successful');
    clearAuthHeader();
    return {};
  } catch (error) {
    const errorData = error.response?.data || {};
    const errorMessage =
      errorData.message || errorData.error || 'Logout failed';
    console.log('Logout error:', {
      status: error.response?.status,
      message: errorMessage,
      details: errorData,
    });
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
        console.log('No token provided for refresh');
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.get('/users/current');
      console.log('Refresh response:', response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || errorData.error || 'Refresh failed';
      console.log('Refresh error:', {
        status: error.response?.status,
        message: errorMessage,
        details: errorData,
      });
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);
