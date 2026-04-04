import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Check if the item is already in the cart using MongoDB's _id
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        // If it exists, just increase the quantity
        existingItem.quantity += item.quantity;
      } else {
        // If it's new, add it to the array
        state.cartItems.push(item);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;