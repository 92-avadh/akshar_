import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: ({ keyword = '', tag = '', page = 1, limit = 12 } = {}) => {
        return `/products?keyword=${keyword}&tag=${tag}&page=${page}&limit=${limit}`;
      },
      providesTags: ['Product'],
    }),
    
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    sendOtp: builder.mutation({ query: (data) => ({ url: '/auth/send-otp', method: 'POST', body: data }) }),
    verifyOtp: builder.mutation({ query: (data) => ({ url: '/auth/verify-otp', method: 'POST', body: data }) }),
    
    createOrder: builder.mutation({ query: (data) => ({ url: '/orders', method: 'POST', body: data }) }),

    // ==========================================
    // NEW: Query to fetch the user's orders
    // ==========================================
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      providesTags: ['Order'], // This tag ensures data refreshes if a new order is placed
    }),

    createReview: builder.mutation({
      query: (data) => ({
          url: `/products/${data.productId}/reviews`,
          method: 'POST',
          body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),

  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useSendOtpMutation,     
  useVerifyOtpMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery, // <-- NEW EXPORT
  useCreateReviewMutation 
} = apiSlice;