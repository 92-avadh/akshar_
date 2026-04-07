import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // THIS LINE IS CRITICAL: It loads the saved cart from the browser memory
  cartItems: sessionStorage.getItem('cartItems') ? JSON.parse(sessionStorage.getItem('cartItems')) : [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        existingItem.qty += item.qty; 
      } else {
        state.cartItems.push(item);
      }
      
      // CRITICAL: Save to local storage after adding
      sessionStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);
      if (item) {
        item.qty = qty;
      }
      sessionStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      sessionStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      sessionStorage.removeItem('cartItems');
    },
    // NEW: Cloud Hydration Reducer
    setCart: (state, action) => {
      state.cartItems = action.payload;
      sessionStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;