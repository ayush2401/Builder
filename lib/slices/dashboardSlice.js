import { createSlice } from "@reduxjs/toolkit";
import { mergeDate } from "../constants/timeFunctions";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    activityType: "Seeding",
    activityDate: mergeDate(new Date()),
    loading: false,
  },
  reducers: {
    setActivityType: (state, action) => {
      state.activityType = action.payload;
    },
    setActivityDate: (state, action) => {
      state.activityDate = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActivityType, setActivityDate, setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
