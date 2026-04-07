import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = sessionStorage.getItem('token'); 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Product', 'Order', 'User', 'Contact'],
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
    login: builder.mutation({ 
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }) 
    }),
    register: builder.mutation({ 
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }) 
    }),
    
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
    createOrder: builder.mutation({
      query: ({ idempotencyKey, ...data }) => ({
        url: '/orders',
        method: 'POST',
        body: data,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
      }),
    }),

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
      query: ({ idempotencyKey, ...data }) => ({
        url: '/payments/razorpay/order',
        method: 'POST',
        body: data,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
      })
    }),
    
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({ url: '/payments/razorpay/verify', method: 'POST', body: data })
    }),

    // ==========================================
    // CONTACT MESSAGES (NEW)
    // ==========================================
    submitContactMessage: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),

    getAllContactMessages: builder.query({
      query: () => '/contact',
      providesTags: ['Contact'],
    }),

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
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,     
  useVerifyOtpMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery, 
  useGetAllOrdersQuery,    
  useDeliverOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  
  // NEW EXPORTS FOR CONTACT MESSAGES
  useSubmitContactMessageMutation,
  useGetAllContactMessagesQuery
} = apiSlice;