import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDataId: null,
  selectedTaxonomyId: null
};

const selectionsSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    setSelectedDataId: (state, action) => {
      state.selectedDataId = action.payload;
    },
    setSelectedTaxonomyId: (state, action) => {
      state.selectedTaxonomyId = action.payload;
    }
  }
});

export const { setSelectedDataId, setSelectedTaxonomyId } =
  selectionsSlice.actions;

export default selectionsSlice.reducer;

export const selectSelectedDataId = (state) => state.selections.selectedDataId;
export const selectSelectedTaxonomyId = (state) =>
  state.selections.selectedTaxonomyId;
