import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDataId: null,
  selectedTaxonomyId: null,
  isOpen: false,
  formType: {
    entity: null,
    new: false
  }
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
    },
    setFormType: (state, action) => {
      state.formType.entity = action.payload.entity;
      state.formType.new = action.payload.new;
    }
  }
});

export const {
  setSelectedDataId,
  setSelectedTaxonomyId,
  setIsOpen,
  setFormType
} = selectionsSlice.actions;

export default selectionsSlice.reducer;

export const selectSelectedDataId = (state) => state.selections.selectedDataId;
export const selectSelectedTaxonomyId = (state) =>
  state.selections.selectedTaxonomyId;
export const selectIsOpen = (state) => state.selections.isOpen;
export const selectFormType = (state) => state.selections.formType;
