import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
  filters: {
    location: '',
    priceRange: [0, 1000],
    rating: 0,
    dates: {
      checkIn: null,
      checkOut: null,
    },
  },
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    fetchHotelsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHotelsSuccess: (state, action) => {
      state.loading = false;
      state.hotels = action.payload;
      state.error = null;
    },
    fetchHotelsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    applyFilters: (state) => {
      // This is a placeholder for filter logic
      // Actual filtering would typically happen in a thunk or on the server
    },
  },
});

export const {
  fetchHotelsStart,
  fetchHotelsSuccess,
  fetchHotelsFailure,
  selectHotel,
  updateFilters,
  applyFilters,
} = hotelsSlice.actions;

export default hotelsSlice.reducer; 