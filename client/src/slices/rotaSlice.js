// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config.json';

// Define our single API slice object
export const rotaSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'rota',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl:
      'https://api-inference.huggingface.co/models/rti-international/rota',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${config.ROTA_TOKEN}`);
      return headers;
    }
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getPredictions: builder.mutation({
      query: (data) => ({
        method: 'POST',
        body: data
      })
    })
  })
});

// Export the auto-generated hooks for each endpoint
export const { useGetPredictionsMutation } = rotaSlice;
