import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { School } from '../../types';
import api from '../../services/api';

interface SchoolState {
  schools: School[];
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  schools: [], // Xóa mock data, bắt đầu với mảng rỗng
  loading: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

// Lấy danh sách trường
export const fetchSchools = createAsyncThunk('school/fetchSchools', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/schools');
    return response.data; // Giả sử API trả về mảng trực tiếp trong data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
  }
});

// Thêm trường mới
export const createSchool = createAsyncThunk('school/createSchool', async (newSchool: Omit<School, 'id'>, { rejectWithValue }) => {
  try {
    const response = await api.post('/schools', newSchool);
    return response.data; // API backend thường trả về object vừa được tạo có kèm ID thật trong DB
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm mới');
  }
});

// Cập nhật trường
export const updateSchoolAsync = createAsyncThunk('school/updateSchool', async (school: School, { rejectWithValue }) => {
  try {
    const response = await api.put(`/schools/${school.id}`, school);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật');
  }
});

// Xóa trường
export const deleteSchoolAsync = createAsyncThunk('school/deleteSchool', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/schools/${id}`);
    return id; // Trả về ID để reducer biết cần xóa phần tử nào khỏi state
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa');
  }
});

// --- SLICE CONFIG ---
const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {}, // Không dùng reducers đồng bộ nữa
  extraReducers: (builder) => {
    builder
      // Xử lý fetchSchools
      .addCase(fetchSchools.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSchools.fulfilled, (state, action: PayloadAction<School[]>) => {
        state.loading = false;
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý createSchool
      .addCase(createSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.schools.push(action.payload);
      })
      // Xử lý updateSchool
      .addCase(updateSchoolAsync.fulfilled, (state, action: PayloadAction<School>) => {
        const index = state.schools.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })
      // Xử lý deleteSchool
      .addCase(deleteSchoolAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.schools = state.schools.filter((s) => s.id !== action.payload);
      });
  },
});

export default schoolSlice.reducer;