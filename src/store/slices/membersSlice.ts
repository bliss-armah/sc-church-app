import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Member {
  id: string;
  first_name: string;
  second_name?: string;
  other_names?: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  phone_number?: string;
  email?: string;
  address?: string;
  membership_status: "active" | "inactive" | "visitor";
  date_joined: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MembersState {
  members: Member[];
  currentMember: Member | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

const initialState: MembersState = {
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (params: { page?: number; size?: number; search?: string } = {}) => {
    const { page = 1, size = 10, search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await api.get(`/members?${queryParams}`);
    return response.data;
  },
);

export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },
);

export const createMember = createAsyncThunk(
  "members/createMember",
  async (memberData: Omit<Member, "id" | "created_at" | "updated_at">) => {
    const response = await api.post("/members", memberData);
    return response.data;
  },
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, data }: { id: string; data: Partial<Member> }) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id: string) => {
    await api.delete(`/members/${id}`);
    return id;
  },
);

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMember: (state) => {
      state.currentMember = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch members
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.items;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          total: action.payload.total,
          pages: action.payload.pages,
        };
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch members";
      })
      // Fetch member by ID
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.currentMember = action.payload;
      })
      // Create member
      .addCase(createMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.unshift(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create member";
      })
      // Update member
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (m) => m.id === action.payload.id,
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        if (state.currentMember?.id === action.payload.id) {
          state.currentMember = action.payload;
        }
      })
      // Delete member
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
        if (state.currentMember?.id === action.payload) {
          state.currentMember = null;
        }
      });
  },
});

export const { clearError, clearCurrentMember, setPagination } =
  membersSlice.actions;
export default membersSlice.reducer;
