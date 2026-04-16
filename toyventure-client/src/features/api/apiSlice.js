import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token'); 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  tagTypes: ['Product', 'Order', 'User', 'Contact', 'Coupon'],
  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: ({ keyword = '', tags = '', minPrice = '', maxPrice = '', minRating = '', sort = 'newest', inStock = '', outOfStock = '', isPopular = '', page = 1, limit = 12 } = {}) => {
        let url = `/products?page=${page}&limit=${limit}`;
        if (keyword) url += `&keyword=${keyword}`;
        if (tags) url += `&tags=${tags}`;
        if (minPrice !== '' && minPrice !== undefined) url += `&minPrice=${minPrice}`;
        if (maxPrice !== '' && maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
        if (minRating !== '' && minRating !== undefined) url += `&minRating=${minRating}`;
        if (sort) url += `&sort=${sort}`;
        if (inStock) url += `&inStock=${inStock}`;
        if (outOfStock) url += `&outOfStock=${outOfStock}`;
        
        // NEW: Added URL parameter for Popular flag
        if (isPopular) url += `&isPopular=${isPopular}`;
        return url;
      },
      providesTags: ['Product'],
    }),

    getProductById: builder.query({ query: (productId) => `/products/${productId}`, providesTags: (result, error, id) => [{ type: 'Product', id }] }),
    createReview: builder.mutation({ query: (data) => ({ url: `/products/${data.productId}/reviews`, method: 'POST', body: data }), invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }] }),
    deleteReview: builder.mutation({ query: ({ productId, reviewId }) => ({ url: `/products/${productId}/reviews/${reviewId}`, method: 'DELETE' }), invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }, 'Product'] }),
    notifyMeWhenAvailable: builder.mutation({ query: (data) => ({ url: `/products/${data.productId}/notify`, method: 'POST', body: { email: data.email } }) }),
    
    createProduct: builder.mutation({ query: (data) => ({ url: '/products', method: 'POST', body: data }), invalidatesTags: ['Product'] }),
    updateProduct: builder.mutation({ query: (data) => ({ url: `/products/${data._id}`, method: 'PUT', body: data }), invalidatesTags: ['Product'] }),
    deleteProduct: builder.mutation({ query: (productId) => ({ url: `/products/${productId}`, method: 'DELETE' }), invalidatesTags: ['Product'] }),
    
    login: builder.mutation({ query: (data) => ({ url: '/auth/login', method: 'POST', body: data }) }),
    register: builder.mutation({ query: (data) => ({ url: '/auth/register', method: 'POST', body: data }) }),
    sendOtp: builder.mutation({ query: (data) => ({ url: '/auth/send-otp', method: 'POST', body: data }) }),
    verifyOtp: builder.mutation({ query: (data) => ({ url: '/auth/verify-otp', method: 'POST', body: data }) }),
    
    getUserProfile: builder.query({ query: () => '/users/profile', providesTags: ['User'] }),
    updateUserProfile: builder.mutation({ query: (data) => ({ url: '/users/profile', method: 'PUT', body: data }), invalidatesTags: ['User'] }),
    
    getAllUsers: builder.query({ query: () => '/users', providesTags: ['User'] }),
    toggleUserBanStatus: builder.mutation({ query: (id) => ({ url: `/users/${id}/ban`, method: 'PUT' }), invalidatesTags: ['User'] }),
    updateUserRole: builder.mutation({ query: (id) => ({ url: `/users/${id}/role`, method: 'PUT' }), invalidatesTags: ['User'] }),
    requestAdminPromotion: builder.mutation({ query: () => ({ url: '/users/admin/request-promotion', method: 'POST' }) }),
    confirmAdminPromotion: builder.mutation({ query: (data) => ({ url: '/users/admin/confirm-promotion', method: 'POST', body: data }), invalidatesTags: ['User'] }),
    
    createOrder: builder.mutation({ query: ({ idempotencyKey, ...data }) => ({ url: '/orders', method: 'POST', body: data, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined }) }),
    createCodOrder: builder.mutation({ query: ({ idempotencyKey, ...data }) => ({ url: '/orders', method: 'POST', body: data, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined }), invalidatesTags: ['Order'] }),
    getMyOrders: builder.query({ query: () => '/orders/myorders', providesTags: ['Order'] }),
    
    getAllOrders: builder.query({ query: () => '/orders', providesTags: ['Order'] }),
    updateOrderStatus: builder.mutation({ query: ({ id, status, courierName, trackingLink }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: { status, courierName, trackingLink } }), invalidatesTags: ['Order'] }),
    
    createRazorpayOrder: builder.mutation({ query: ({ idempotencyKey, ...data }) => ({ url: '/payments/razorpay/order', method: 'POST', body: data, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined }) }),
    verifyRazorpayPayment: builder.mutation({ query: (data) => ({ url: '/payments/razorpay/verify', method: 'POST', body: data }) }),
    createDemoOrder: builder.mutation({ query: ({ idempotencyKey, ...data }) => ({ url: '/payments/demo', method: 'POST', body: data, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined }), invalidatesTags: ['Order'] }),
    
    submitContactMessage: builder.mutation({ query: (data) => ({ url: '/contact', method: 'POST', body: data }) }),
    getAllContactMessages: builder.query({ query: () => '/contact', providesTags: ['Contact'] }),
    
    getAllCoupons: builder.query({ query: () => '/coupons', providesTags: ['Coupon'] }),
    createCoupon: builder.mutation({ query: (data) => ({ url: '/coupons', method: 'POST', body: data }), invalidatesTags: ['Coupon'] }),
    deleteCoupon: builder.mutation({ query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }), invalidatesTags: ['Coupon'] }),
    toggleCoupon: builder.mutation({ query: (id) => ({ url: `/coupons/${id}/toggle`, method: 'PUT' }), invalidatesTags: ['Coupon'] }),
    validateCoupon: builder.mutation({ query: (data) => ({ url: '/coupons/validate', method: 'POST', body: data }) }),

  }),
});

export const { 
  useGetProductsQuery, useGetProductByIdQuery, useCreateReviewMutation, useDeleteReviewMutation, useNotifyMeWhenAvailableMutation, 
  useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation,
  useLoginMutation, useRegisterMutation, useSendOtpMutation, useVerifyOtpMutation,
  useGetUserProfileQuery, useUpdateUserProfileMutation,
  useGetAllUsersQuery, useToggleUserBanStatusMutation, useUpdateUserRoleMutation, useRequestAdminPromotionMutation, useConfirmAdminPromotionMutation, 
  useCreateOrderMutation, useCreateCodOrderMutation, useGetMyOrdersQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation,
  useCreateRazorpayOrderMutation, useVer9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8, useCreateDemoOrderMutation,
  useSubmitContactMessageMutation, useGetAllContactMessagesQuery,
  useGetAllCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation, useToggleCouponMutation, useValidateCouponMutation,
} = apiSlice;