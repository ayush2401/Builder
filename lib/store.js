import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "@/lib/slices/dashboardSlice";
import databaseReducer from "@/lib/slices/databaseSlice"

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    database: databaseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
