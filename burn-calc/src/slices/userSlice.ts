import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserResponseDto } from '../api/Api';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: null as string | null,
    isExpert: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserResponseDto }>) => {
      state.name = action.payload.user.name;
      state.isExpert = action.payload.user.isExpert;
    },
    clearUser: (state) => {
      state.name = null;
      state.isExpert = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
