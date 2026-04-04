import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }), 
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      // Notice how this provides a specific tag for this ID
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // Auth & Order endpoints remain the same...
    sendOtp: builder.mutation({ query: (data) => ({ url: '/auth/send-otp', method: 'POST', body: data }) }),
    verifyOtp: builder.mutation({ query: (data) => ({ url: '/auth/verify-otp', method: 'POST', body: data }) }),
    createOrder: builder.mutation({ query: (data) => ({ url: '/orders', method: 'POST', body: data }) }),

    // ==========================================
    // NEW: CREATE REVIEW MUTATION
    // ==========================================
    createReview: builder.mutation({
      query: (data) => ({
          url: `/products/${data.productId}/reviews`,
          method: 'POST',
          body: data,
      }),
      // This tells Redux to re-fetch the product immediately after a review is submitted!
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
  useCreateReviewMutation // <-- NEW EXPORT
} = apiSlice;