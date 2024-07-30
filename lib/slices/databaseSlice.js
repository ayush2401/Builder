import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDatabase = createAsyncThunk("database/fetch", async () => {
  const response = await fetch("/api/database");
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    throw new Error("Failed to fetch Database")
  }
});

export const updateDatabase = createAsyncThunk("database/update", async (payload, { rejectWithValue }) => {
  const res = await fetch("/api/database/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  if (!res.ok) {
    const error = await res.json();
    return rejectWithValue(error);
  }
  return res.status;
});

export const updateDatabaseRow = createAsyncThunk("database/update/row", async (payload, { rejectWithValue }) => {
  const res = await fetch("/api/database/update/row", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });

  if (!res.ok) {
    const error = await res.json();
    return rejectWithValue(error);
  }
  return res.status;
});

const databaseSlice = createSlice({
  name: "database",
  initialState: {
    database: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.database = action.payload;
      })
      .addCase(fetchDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default databaseSlice.reducer;
