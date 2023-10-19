// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const { token } = getState().auth;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials
      })
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: 'auth/signup',
        method: 'POST',
        body: credentials
      })
    }),
    getData: builder.query({
      query: (params) =>
        `api/user/${params.userId}/taxonomy/${params.taxonomyId}/data`,
      providesTags: ['Data']
    }),
    getObservations: builder.query({
      query: (params) => {
        let url = `api/data/${params.dataId}/observations?page=${params.page}`;

        if (params.query) {
          url += `&query=${params.query}`;
        }

        if (params.sort) {
          url += `&sort=${params.sort}`;
        }

        if (params.filter) {
          url += `&filter=${params.filter}`;
        }

        return url;
      },
      providesTags: ['Observations']
    }),
    getCategories: builder.query({
      query: (taxonomyId) => `api/taxonomy/${taxonomyId}/categories`
    }),
    assignCategory: builder.mutation({
      query: (params) => ({
        url: `/api/${params.observationId}/category`,
        method: 'POST',
        body: {
          categoryId: params.categoryId,
          datasetAssignmentId: params.datasetAssignmentId
        }
      }),
      invalidatesTags: ['Observations']
    }),
    getTaxonomies: builder.query({
      query: (userId) => `api/user/${userId}/taxonomy`,
      providesTags: ['Taxonomies']
    }),
    addTaxonomy: builder.mutation({
      query: (data) => ({
        url: 'api/taxonomy',
        method: 'POST',
        body: data,
        formData: true
      }),
      invalidatesTags: ['Taxonomies']
    }),
    assignTaxonomy: builder.mutation({
      query: (params) => ({
        url: `api/user/${params.userId}/taxonomy`,
        method: 'POST',
        body: { taxonomyId: params.taxonomyId }
      }),
      invalidatesTags: ['Taxonomies', 'Users']
    }),
    getTeamUsers: builder.query({
      query: (teamId) => `api/team/${teamId}/user`,
      providesTags: ['Users']
    }),
    addData: builder.mutation({
      query: (data) => ({
        url: 'api/data',
        method: 'POST',
        body: data,
        formData: true
      }),
      invalidatesTags: ['Data', 'Users']
    }),
    assignData: builder.mutation({
      query: (params) => ({
        url: `api/user/${params.userId}/data`,
        method: 'POST',
        body: { dataId: params.dataId }
      }),
      invalidatesTags: ['Users', 'Data']
    }),
    getTaxonomyUsers: builder.query({
      query: (taxonomyId) => `api/taxonomy/${taxonomyId}/user`,
      providesTags: ['Users']
    }),
    getDataByTaxonomy: builder.query({
      query: (taxonomyId) => `api/taxonomy/${taxonomyId}/data`,
      providesTags: ['Data']
    }),
    deleteData: builder.mutation({
      query: (dataId) => ({
        url: `api/data/${dataId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Data']
    }),
    getDataUsers: builder.query({
      query: (dataId) => `api/data/${dataId}/user`,
      providesTags: ['Users']
    }),
    findUser: builder.query({
      query: (email) => `api/user?query=${email}`
    }),
    addTeam: builder.mutation({
      query: (data) => ({
        url: 'api/team',
        method: 'POST',
        body: data
      })
    }),
    assignTeam: builder.mutation({
      query: (data) => ({
        url: `api/user/team`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    removeTeam: builder.mutation({
      query: (userId) => ({
        url: `api/user/${userId}/team`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users', 'Taxonomies', 'Data']
    }),
    deleteTaxonomy: builder.mutation({
      query: (taxonomyId) => ({
        url: `api/taxonomy/${taxonomyId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Taxonomies']
    }),
    getUserAssignedCategories: builder.query({
      query: (params) =>
        `api/user/${params.userId}/observations?obIds=${params.obIds}`
    })
  })
});

// Export the auto-generated hooks for each endpoint
export const {
  useSigninMutation,
  useSignupMutation,
  useGetDataQuery,
  useLazyGetObservationsQuery,
  useGetCategoriesQuery,
  useAssignCategoryMutation,
  useGetTaxonomiesQuery,
  useAddTaxonomyMutation,
  useAssignTaxonomyMutation,
  useGetTeamUsersQuery,
  useAddDataMutation,
  useAssignDataMutation,
  useGetTaxonomyUsersQuery,
  useLazyGetTaxonomyUsersQuery,
  useGetDataByTaxonomyQuery,
  useDeleteDataMutation,
  useGetDataUsersQuery,
  useLazyFindUserQuery,
  useAddTeamMutation,
  useAssignTeamMutation,
  useRemoveTeamMutation,
  useDeleteTaxonomyMutation,
  useGetUserAssignedCategoriesQuery,
  useLazyGetUserAssignedCategoriesQuery
} = apiSlice;
