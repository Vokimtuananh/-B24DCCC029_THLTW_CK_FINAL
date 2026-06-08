import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface ApplicationState {
    applications: any[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    error?: string | null;
}

const initialState: ApplicationState = {
    applications: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
    error: null
};

export const fetchApplications = createAsyncThunk(
    'application/fetchApplications',
    async ({ page = 1, limit = 20, filters = {} }: any) => {
        const res = await api.get('/applications', { params: { page, limit, ...filters } });
        return { data: res.data.data || res.data, total: res.data.total || res.data.total || 0, page, limit };
    }
);

export const updateApplicationStatus = createAsyncThunk(
    'application/updateStatus',
    async ({ id, status }: { id: string; status: string }) => {
        const res = await api.put(`/applications/${id}/status`, { status });
        return res.data;
    }
);

const slice = createSlice({
    name: 'application',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || 20;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load applications';
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                const idx = state.applications.findIndex((a) => a._id === action.payload._id || a.id === action.payload.id);
                if (idx !== -1) state.applications[idx] = action.payload;
            });
    }
});

export default slice.reducer;
