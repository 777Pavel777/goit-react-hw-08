import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthHeader } from '../auth/operations';

axios.defaults.baseURL = 'https://connections-api.goit.global';

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        console.error('No token provided for fetchContacts');
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.get('/contacts');
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.error('Fetch contacts error:', {
        status: error.response?.status,
        message: errorData.message || 'Failed to fetch contacts',
        details: errorData,
      });
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to fetch contacts',
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        console.error('No token provided for addContact');
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.post('/contacts', contact, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.error('Add contact error:', {
        status: error.response?.status,
        message: errorData.message || 'Failed to add contact',
        details: errorData,
      });
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to add contact',
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        console.error('No token provided for deleteContact');
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      return { id };
    } catch (error) {
      const errorData = error.response?.data || {};
      console.error('Delete contact error:', {
        status: error.response?.status,
        message: errorData.message || 'Failed to delete contact',
        details: errorData,
      });
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to delete contact',
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, name, number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        console.error('No token provided for updateContact');
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.patch(
        `/contacts/${id}`,
        { name, number },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.error('Update contact error:', {
        status: error.response?.status,
        message: errorData.message || 'Failed to update contact',
        details: errorData,
      });
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to update contact',
        status: error.response?.status || 500,
        details: errorData,
      });
    }
  }
);
