import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hotelsReducer from './slices/hotelsSlice';
import bookingsReducer from './slices/bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelsReducer,
    bookings: bookingsReducer,
  },
}); 