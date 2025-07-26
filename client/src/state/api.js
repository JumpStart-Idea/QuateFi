import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "Settings",
    "Documents",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: "client/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation({
      query: ({ id, ...updatedProduct }) => ({
        url: `client/products/${id}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `client/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    createCustomer: build.mutation({
      query: (newCustomer) => ({
        url: "client/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: build.mutation({
      query: ({ id, ...updatedCustomer }) => ({
        url: `client/customers/${id}`,
        method: "PUT",
        body: updatedCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: build.mutation({
      query: (id) => ({
        url: `client/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    createAdmin: build.mutation({
      query: (newAdmin) => ({
        url: "client/admins",
        method: "POST",
        body: newAdmin,
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: build.mutation({
      query: ({ id, ...updatedAdmin }) => ({
        url: `client/admins/${id}`,
        method: "PUT",
        body: updatedAdmin,
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `client/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation({
      query: (user) => ({
        url: "auth/register",
        method: "POST",
        body: user,
      }),
    }),
    // Settings endpoints
    getUserSettings: build.query({
      query: (userId) => `settings/${userId}`,
      providesTags: ["Settings"],
    }),
    updateUserSettings: build.mutation({
      query: ({ userId, settings }) => ({
        url: `settings/${userId}`,
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
    resetUserSettings: build.mutation({
      query: (userId) => ({
        url: `settings/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSettingsField: build.mutation({
      query: ({ userId, field, value }) => ({
        url: `settings/${userId}/field/${field}`,
        method: "PATCH",
        body: { value },
      }),
      invalidatesTags: ["Settings"],
    }),

    // File upload endpoints
    uploadProfilePicture: build.mutation({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        return {
          url: `settings/${userId}/profile-picture`,
          method: "POST",
          body: formData,
          // Don't set Content-Type header, let the browser set it with boundary
        };
      },
      invalidatesTags: ["Settings"],
    }),

    uploadDocuments: build.mutation({
      query: ({ userId, files, description, category }) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('documents', file);
        });
        if (description) formData.append('description', description);
        if (category) formData.append('category', category);
        
        return {
          url: `settings/${userId}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Documents", "Settings"],
    }),

    getDocuments: build.query({
      query: (userId) => `settings/${userId}/documents`,
      providesTags: ["Documents"],
    }),

    deleteDocument: build.mutation({
      query: ({ userId, documentId }) => ({
        url: `settings/${userId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents", "Settings"],
    }),

    downloadDocument: build.query({
      query: ({ userId, documentId }) => ({
        url: `settings/${userId}/documents/${documentId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
  useResetUserSettingsMutation,
  useUpdateSettingsFieldMutation,
  useUploadProfilePictureMutation,
  useUploadDocumentsMutation,
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useDownloadDocumentQuery,
} = api;
