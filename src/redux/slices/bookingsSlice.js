import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    fetchBookingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createBookingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action) => {
      state.loading = false;
      state.bookings = [...state.bookings, action.payload];
      state.currentBooking = action.payload;
      state.error = null;
    },
    createBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
});

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBookingStart,
  createBookingSuccess,
  createBookingFailure,
  setCurrentBooking,
  clearCurrentBooking,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
