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
    
    // ==========================================
    // PRODUCTS
    // ==========================================
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

    createReview: builder.mutation({
      query: (data) => ({
          url: `/products/${data.productId}/reviews`,
          method: 'POST',
          body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),

    // ==========================================
    // ADMIN PRODUCTS (CRUD)
    // ==========================================
    createProduct: builder.mutation({
      query: () => ({ url: '/products', method: 'POST' }),
      invalidatesTags: ['Product'], // Auto-refreshes your product table!
    }),
    
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    
    // ==========================================
    // AUTHENTICATION
    // ==========================================
    sendOtp: builder.mutation({ query: (data) => ({ url: '/auth/send-otp', method: 'POST', body: data }) }),
    verifyOtp: builder.mutation({ query: (data) => ({ url: '/auth/verify-otp', method: 'POST', body: data }) }),
    
    // ==========================================
    // USER PROFILE
    // ==========================================
    getUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // ==========================================
    // ORDERS (USER)
    // ==========================================
    createOrder: builder.mutation({ query: (data) => ({ url: '/orders', method: 'POST', body: data }) }),

    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      providesTags: ['Order'], 
    }),

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================
    getAllOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'], 
    }),

    // ==========================================
    // RAZORPAY PAYMENTS
    // ==========================================
    createRazorpayOrder: builder.mutation({
      query: (data) => ({ url: '/payments/razorpay/order', method: 'POST', body: data })
    }),
    
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({ url: '/payments/razorpay/verify', method: 'POST', body: data })
    })

  }),
});

// EXPORT ALL HOOKS
export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useCreateReviewMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSendOtpMutation,     
  useVerifyOtpMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery, 
  useGetAllOrdersQuery,    
  useDeliverOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation
} = apiSlice;