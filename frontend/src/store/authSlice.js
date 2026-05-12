import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../services/api'

export const registerAccount = createAsyncThunk(
  'auth/registerAccount',
  async (payload, { rejectWithValue }) => {
    try {
      const endpoint =
        import.meta.env.VITE_REGISTER_ENDPOINT || '/api/auth/register'
      const response = await api.post(endpoint, payload)
      return response.data
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed'
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  status: 'idle',
  error: null,
  result: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    resetAuthState(state) {
      state.status = 'idle'
      state.error = null
      state.result = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAccount.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.result = action.payload
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearAuthError, resetAuthState } = authSlice.actions
export default authSlice.reducer
