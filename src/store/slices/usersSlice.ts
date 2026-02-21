import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export type UserRole = "super_admin" | "calling_team" | "texting_team";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  calling_team: "Calling Team",
  texting_team: "Texting Team",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  calling_team: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  texting_team:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export interface SystemUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  fullName: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  email?: string;
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}

interface UsersState {
  users: SystemUser[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getErrorMessage = (e: any, fallback: string) => {
  const detail = e.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
  if (detail) return JSON.stringify(detail);
  return fallback;
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: { page?: number; pageSize?: number; role?: UserRole } = {},
    { rejectWithValue },
  ) => {
    try {
      const { page = 1, pageSize = 20, role } = params;
      const q = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (role) q.append("role", role);
      const response = await api.get(`/users?${q}`);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(getErrorMessage(e, "Failed to fetch users"));
    }
  },
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/", data);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(getErrorMessage(e, "Failed to create user"));
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, data }: { id: string; data: UpdateUserPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(getErrorMessage(e, "Failed to update user"));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(getErrorMessage(e, "Failed to delete user"));
    }
  },
);

export const resetUserPassword = createAsyncThunk(
  "users/resetPassword",
  async (
    { id, newPassword }: { id: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`, {
        newPassword,
      });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(getErrorMessage(e, "Failed to reset password"));
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.items;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Reset password
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
