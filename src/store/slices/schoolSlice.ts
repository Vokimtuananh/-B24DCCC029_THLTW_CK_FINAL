import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { School } from '../../types';
import api from '../../services/api';

interface SchoolState {
  schools: School[];
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  schools: [], 
  loading: false,
  error: null,
};

export const fetchSchools = createAsyncThunk('school/fetchSchools', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/schools');
    return response.data; 
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
  }
});

export const createSchool = createAsyncThunk('school/createSchool', async (newSchool: Omit<School, 'id'>, { rejectWithValue }) => {
  try {
    const response = await api.post('/schools', newSchool);
    return response.data; // API backend thường trả về object vừa được tạo có kèm ID thật trong DB
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm mới');
  }
});

export const updateSchoolAsync = createAsyncThunk('school/updateSchool', async (school: School, { rejectWithValue }) => {
  try {
    const response = await api.put(`/schools/${school.id}`, school);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật');
  }
});

export const deleteSchoolAsync = createAsyncThunk('school/deleteSchool', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/schools/${id}`);
    return id; // Trả về ID để reducer biết cần xóa phần tử nào khỏi state
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa');
  }
});

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchools.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSchools.fulfilled, (state, action: PayloadAction<School[]>) => {
        state.loading = false;
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.schools.push(action.payload);
      })
      .addCase(updateSchoolAsync.fulfilled, (state, action: PayloadAction<School>) => {
        const index = state.schools.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })
      .addCase(deleteSchoolAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.schools = state.schools.filter((s) => s.id !== action.payload);
      });
  },
});

export default schoolSlice.reducer;