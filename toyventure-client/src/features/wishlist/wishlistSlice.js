import { createSlice } from '@reduxjs/toolkit';

// Check if there are saved favorites in the browser memory
const initialState = {
  wishlistItems: localStorage.getItem('wishlist') 
    ? JSON.parse(localStorage.getItem('wishlist')) 
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const existingIndex = state.wishlistItems.findIndex((item) => item._id === product._id);

      if (existingIndex >= 0) {
        // If it's already favorited, remove it!
        state.wishlistItems.splice(existingIndex, 1);
      } else {
        // If it's not favorited, add it!
        state.wishlistItems.push(product);
      }

      // Save to browser storage so it survives a page refresh
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem('wishlist');
    }
  },
});

export const { toggleFavorite, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;