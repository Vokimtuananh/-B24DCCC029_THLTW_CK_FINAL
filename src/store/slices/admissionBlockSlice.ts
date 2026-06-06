import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AdmissionBlock } from '../../types';

interface AdmissionBlockState {
  admissionBlocks: AdmissionBlock[];
}

const initialState: AdmissionBlockState = {
  admissionBlocks: [
    { id: '1', majorId: '1', code: 'A00', subjects: ['Toán', 'Vật lý', 'Hóa học'] },
    { id: '2', majorId: '1', code: 'A01', subjects: ['Toán', 'Vật lý', 'Tiếng Anh'] },
  ],
};

const admissionBlockSlice = createSlice({
  name: 'admissionBlock',
  initialState,
  reducers: {
    addAdmissionBlock: (state, action: PayloadAction<AdmissionBlock>) => {
      state.admissionBlocks.push(action.payload);
    },
    updateAdmissionBlock: (state, action: PayloadAction<AdmissionBlock>) => {
      const index = state.admissionBlocks.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.admissionBlocks[index] = action.payload;
      }
    },
    deleteAdmissionBlock: (state, action: PayloadAction<string>) => {
      state.admissionBlocks = state.admissionBlocks.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAdmissionBlock, updateAdmissionBlock, deleteAdmissionBlock } = admissionBlockSlice.actions;
export default admissionBlockSlice.reducer;