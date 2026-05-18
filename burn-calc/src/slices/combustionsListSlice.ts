import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api';
import type { CombustionListResponseDto, CompleteCombustionDto } from '../api/Api';

interface CombustionsState {
  items: CombustionListResponseDto[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    formedAtFrom?: string;
    formedAtTo?: string;
    creatorName?: string;
  };
}

// Вспомогательная функция для получения сегодняшней даты в формате YYYY-MM-DD
const getTodayDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialState: CombustionsState = {
  items: [],
  isLoading: false,
  error: null,
  filters: {
    status: '',
    formedAtFrom: getTodayDate(),
    formedAtTo: getTodayDate(),
    creatorName: '',
  },
};

// Получение списка заявок с фильтрами
export const fetchCombustionsList = createAsyncThunk(
  'combustions/fetchList',
  async (filters: CombustionsState['filters'], { rejectWithValue }) => {
    try {
      // Передаем фильтры в query параметры API
      const res = await apiClient.api.combustionControllerFindAll({
        status: filters.status,
        formedAtFrom: filters.formedAtFrom || undefined,
        formedAtTo: filters.formedAtTo || undefined,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки заявок');
    }
  }
);

// Завершение заявки (Approve/Reject)
export const completeCombustion = createAsyncThunk(
  'combustions/complete',
  async ({ id, action }: { id: number; action: CompleteCombustionDto }, { rejectWithValue }) => {
    try {
      const res = await apiClient.api.combustionControllerComplete(id, action);
      return res.data; // Возвращаем обновленные данные заявки (или список, зависит от бэка)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка завершения заявки');
    }
  }
);

const combustionsListSlice = createSlice({
  name: 'combustionsList',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CombustionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCombustionsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCombustionsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCombustionsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // При успешном завершении заявки обновляем её статус в списке
      .addCase(completeCombustion.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(completeCombustion.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters } = combustionsListSlice.actions;
export default combustionsListSlice.reducer;
