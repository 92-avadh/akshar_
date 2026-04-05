import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    // NEW: Automatically attach the JWT token to requests if the user is logged in
    prepareHeaders: (headers, { getState }) => {
      // Assuming you save the token to localStorage upon login. 
      // If you named the key something else (e.g., 'userToken' or inside 'userInfo'), update the string below!
      const token = localStorage.getItem('token'); 
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    
    // UPGRADED: Now accepts search, filter, and pagination parameters
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
    
    // This will now automatically send the token thanks to prepareHeaders!
    createOrder: builder.mutation({ query: (data) => ({ url: '/orders', method: 'POST', body: data }) }),

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
  useCreateReviewMutation 
} = apiSlice;