import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDataId: null,
  selectedTaxonomyId: null,
  isOpen: false
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
    },
    setIsOpen: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { setSelectedDataId, setSelectedTaxonomyId, setIsOpen } =
  selectionsSlice.actions;

export default selectionsSlice.reducer;

export const selectSelectedDataId = (state) => state.selections.selectedDataId;
export const selectSelectedTaxonomyId = (state) =>
  state.selections.selectedTaxonomyId;
export const selectIsOpen = (state) => state.selections.isOpen;
