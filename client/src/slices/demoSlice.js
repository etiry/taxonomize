// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import config from '../../config.json';

const REACT_APP_COOK_COUNTY_TOKEN = process.env.REACT_APP_COOK_COUNTY_TOKEN;

console.log(REACT_APP_COOK_COUNTY_TOKEN);

// Define our single API slice object
export const demoDataSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'demo',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://datacatalog.cookcountyil.gov/resource/apwk-dzx8.json',
    prepareHeaders: (headers) => {
      headers.set('X-App-Token', `${REACT_APP_COOK_COUNTY_TOKEN}`);
      return headers;
    }
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getDemoData: builder.query({
      query: () =>
        `?$limit=10&$select=max(charge_id) as id,disposition_charged_offense_title as text&$group=disposition_charged_offense_title`
    })
  })
});

// Export the auto-generated hooks for each endpoint
export const { useGetDemoDataQuery } = demoDataSlice;
