// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const { token } = getState().auth;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials
      })
    }),
    // The `getPosts` endpoint is a "query" operation that returns data
    getTaxonomies: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => 'api/taxonomy'
    })
  })
});

// Export the auto-generated hooks for each endpoint
export const { useSigninMutation, useGetTaxonomiesQuery } = apiSlice;
