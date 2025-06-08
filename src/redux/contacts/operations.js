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
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.get('/contacts');
      console.log('Fetch contacts response:', response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.log('Fetch contacts error:', errorData);
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to fetch contacts',
        status: error.response?.status || 500,
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
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.post('/contacts', contact, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Add contact response:', response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.log('Add contact error:', errorData);
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to add contact',
        status: error.response?.status || 500,
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
        return thunkAPI.rejectWithValue({
          message: 'No token provided',
          status: 401,
        });
      }
      setAuthHeader(token);
      const response = await axios.delete(`/contacts/${id}`);
      console.log('Delete contact response:', response.data);
      return { id };
    } catch (error) {
      const errorData = error.response?.data || {};
      console.log('Delete contact error:', errorData);
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to delete contact',
        status: error.response?.status || 500,
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
      console.log('Update contact response:', response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      console.log('Update contact error:', errorData);
      return thunkAPI.rejectWithValue({
        message: errorData.message || 'Failed to update contact',
        status: error.response?.status || 500,
      });
    }
  }
);
