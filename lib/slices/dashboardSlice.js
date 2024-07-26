import { createSlice } from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
  name: "counter",
  initialState: {
    database: [],
    activityType: "Seeding",
    activityDate: new Date(),
    populatedData: [],
  },
  reducers: {
    setDatabase: (state, action) => {
      state.database = action.payload;
    },
    setPopulatedData: (state, action) => {
      state.populatedData = action.payload;
    },
    setActivityType: (state, action) => {
      state.activityType = action.payload;
    },
    setActivityDate: (state, action) => {
      state.activityDate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDatabase, setPopulatedData, setActivityType, setActivityDate } = dashboardSlice.actions;

export default dashboardSlice.reducer;
