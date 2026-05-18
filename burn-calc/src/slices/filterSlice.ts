import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Интерфейс состояния слайса
interface FilterState {
  query: string;
}

// Начальное состояние
const initialState: FilterState = {
  query: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetQuery: (state) => {
      state.query = '';
    },
  },
});

export const { setQuery, resetQuery } = filterSlice.actions;
export default filterSlice.reducer;
