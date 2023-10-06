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
      query: (userId) => `api/user/${userId}/data`,
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
        console.log(url);
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
  useAssignCategoryMutation
} = apiSlice;
