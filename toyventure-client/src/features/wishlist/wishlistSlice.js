import { createSlice } from '@reduxjs/toolkit';

// Check if there are saved favorites and unseen counts in the browser memory
const initialState = {
  wishlistItems: localStorage.getItem('wishlist') 
    ? JSON.parse(localStorage.getItem('wishlist')) 
    : [],
  unseenCount: localStorage.getItem('wishlistUnseen') 
    ? JSON.parse(localStorage.getItem('wishlistUnseen')) 
    : 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const existingIndex = state.wishlistItems.findIndex((item) => item._id === product._id);

      if (existingIndex >= 0) {
        // If it's already favorited, remove it
        state.wishlistItems.splice(existingIndex, 1);
        // Optionally decrement unseen count if they remove an item they haven't "seen" yet
        if (state.unseenCount > 0) state.unseenCount -= 1;
      } else {
        // If it's not favorited, add it and increment the notification badge
        state.wishlistItems.push(product);
        state.unseenCount += 1;
      }

      // Save to browser storage
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
      localStorage.setItem('wishlistUnseen', JSON.stringify(state.unseenCount));
    },
    // NEW: Action to mark all favorites as "read"
    markFavoritesSeen: (state) => {
      state.unseenCount = 0;
      localStorage.setItem('wishlistUnseen', JSON.stringify(0));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.unseenCount = 0;
      localStorage.removeItem('wishlist');
      localStorage.removeItem('wishlistUnseen');
    }
  },
});

export const { toggleFavorite, markFavoritesSeen, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;