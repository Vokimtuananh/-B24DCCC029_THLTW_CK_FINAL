import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Major } from '../../types';

interface MajorState {
  majors: Major[];
}

const initialState: MajorState = {
  majors: [
    { id: '1', schoolId: '1', code: '7480201', name: 'Công nghệ thông tin' },
    { id: '2', schoolId: '1', code: '7480202', name: 'An toàn thông tin' },
  ],
};

const majorSlice = createSlice({
  name: 'major',
  initialState,
  reducers: {
    addMajor: (state, action: PayloadAction<Major>) => {
      state.majors.push(action.payload);
    },
    updateMajor: (state, action: PayloadAction<Major>) => {
      const index = state.majors.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.majors[index] = action.payload;
      }
    },
    deleteMajor: (state, action: PayloadAction<string>) => {
      state.majors = state.majors.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMajor, updateMajor, deleteMajor } = majorSlice.actions;
export default majorSlice.reducer;