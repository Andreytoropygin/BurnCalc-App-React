import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Получение состояния черновика
export const fetchDraftBrief = createAsyncThunk(
  'combustion/fetchDraftBrief',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.combustionControllerGetCombustionIcon();
      // Адаптируйте под реальный ответ бэка, если поля называются иначе
      return {
        combustionId: response.data.combustionId ?? null,
        compoundsCount: response.data.compoundsCount ?? 0,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки заявки');
    }
  }
);

// Добавление соединения в черновик
export const addToDraft = createAsyncThunk(
  'combustion/addToDraft',
  async (compoundId: number, { rejectWithValue }) => {
    try {
      // Вызов сгенерированного метода POST /api/compounds-combustions/{compoundId}
      const response = await apiClient.api.compoundCombustionControllerAddToCombustion(compoundId);
      return { combustionId: response.data.combustionId};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка добавления');
    }
  }
);

const draftWidgetSlice = createSlice({
  name: 'combustion',
  initialState: {
    combustionId: null as number | null,
    compoundsCount: 0,
  },
  reducers: {
    resetDraftWidget: (state) => {
      state.combustionId = null;
      state.compoundsCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftBrief.pending, () => {})
      .addCase(fetchDraftBrief.fulfilled, (state, action) => {
        state.combustionId = action.payload.combustionId;
        state.compoundsCount = action.payload.compoundsCount;
      })
      .addCase(fetchDraftBrief.rejected, () => {})
      .addCase(addToDraft.pending, () => {})
      .addCase(addToDraft.fulfilled, (state, action) => {
        if (state.combustionId === null) state.combustionId = action.payload.combustionId
        state.compoundsCount += 1;
      })
      .addCase(addToDraft.rejected, () => {});
  },
});

export const { resetDraftWidget } = draftWidgetSlice.actions;
export default draftWidgetSlice.reducer;
