import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
// import { Member } from "./membersSlice";

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName?: string | null;
  attendanceDate: string;
  status: "present" | "absent" | "late" | "excused";
  checkInTime: string;
  notes?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

const initialState: AttendanceState = {
  records: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (params: { 
    page?: number; 
    size?: number; 
    attendance_date?: string; 
    status?: string;
    member_id?: string;
  } = {}) => {
    const { page = 1, size = 10, attendance_date, status, member_id } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });

    if (attendance_date) queryParams.append("attendance_date", attendance_date);
    if (status) queryParams.append("status", status);
    if (member_id) queryParams.append("member_id", member_id);

    // Using trailing slash to prevent FastAPI 307 redirects
    const response = await api.get(`/attendance/?${queryParams}`);
    return response.data;
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload.items;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.pageSize || action.payload.page_size,
          total: action.payload.total,
          pages: action.payload.totalPages || action.payload.total_pages,
        };
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch attendance records";
      });
  },
});

export const { clearError, setPagination } = attendanceSlice.actions;
export default attendanceSlice.reducer;
