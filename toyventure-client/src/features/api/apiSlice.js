import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }), 
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // --- PRODUCT ENDPOINTS ---
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // --- AUTH ENDPOINTS ---
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data, 
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data, 
      }),
    }),

    // --- ORDER ENDPOINTS (NEW) ---
    createOrder: builder.mutation({
      query: (orderData) => ({
          url: '/orders',
          method: 'POST',
          body: orderData,
      }),
    }),

  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useSendOtpMutation,     
  useVerifyOtpMutation,
  useCreateOrderMutation // <--- NEW EXPORT
} = apiSlice;