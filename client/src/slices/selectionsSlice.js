import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDataId: null,
  selectedTaxonomyId: null,
  isOpen: false,
  formType: {
    entity: null,
    new: false
  },
  comparedUsers: {
    user1: null,
    user2: null
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
    },
    setComparedUsers: (state, action) => {
      state.comparedUsers = action.payload;
    }
  }
});

export const {
  setSelectedDataId,
  setSelectedTaxonomyId,
  setIsOpen,
  setFormType,
  setComparedUsers
} = selectionsSlice.actions;

export default selectionsSlice.reducer;

export const selectSelectedDataId = (state) => state.selections.selectedDataId;
export const selectSelectedTaxonomyId = (state) =>
  state.selections.selectedTaxonomyId;
export const selectIsOpen = (state) => state.selections.isOpen;
export const selectFormType = (state) => state.selections.formType;
export const selectComparedUsers = (state) => state.selections.comparedUsers;
