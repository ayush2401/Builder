import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "@/lib/slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
