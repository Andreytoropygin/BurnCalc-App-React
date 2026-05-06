// src/slices/combustionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';
import type { CombustionListResponseDto, CombustionSingleResponseDto, CompoundCombustionResponseDto, UpdateCombustionDto, UpdateCompoundCombustionDto } from '../api/Api';

export const fetchCombustion = createAsyncThunk(
  'combustion/fetch',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.combustionControllerFindById(id);
      return response.data as CombustionSingleResponseDto;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки заявки');
    }
  }
);

export const updateCombustion = createAsyncThunk(
  'combustion/update',
  async ( data: Partial<UpdateCombustionDto>, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.combustionControllerUpdate(data);
      return response.data as CombustionSingleResponseDto;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка сохранения');
    }
  }
);

export const removeCompoundFromCombustion = createAsyncThunk(
  'combustion/removeCompound',
  async (compoundId: number, { rejectWithValue }) => {
    try {
      await apiClient.api.compoundCombustionControllerRemoveFromCombustion(compoundId);
      return compoundId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления соединения');
    }
  }
);

export const updateCompoundCombustion = createAsyncThunk(
  'combustion/updateCompound',
  async (body: {compoundId: number, data: UpdateCompoundCombustionDto}, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.compoundCombustionControllerUpdateInCombustion(body.compoundId, body.data);
      return response.data as CompoundCombustionResponseDto;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка обновления соединения');
    }
  }
);

export const formCombustion = createAsyncThunk(
  'combustion/form',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.combustionControllerForm();
      return response.data as CombustionListResponseDto;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка формирования');
    }
  }
);

export const deleteCombustion = createAsyncThunk(
  'combustion/deleteApplication',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.api.combustionControllerRemove();
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления заявки');
    }
  }
);

const combustionSlice = createSlice({
  name: 'combustion',
  initialState: {
    combustion: null as CombustionSingleResponseDto | null
  },
  reducers: {
    clearCombustion: (state) => {
      state.combustion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCombustion.fulfilled, (s, a) => { s.combustion = a.payload; })
      
      .addCase(updateCombustion.fulfilled, (s, a) => { 
        if (s.combustion) {
          s.combustion.sampleDescription = a.payload.sampleDescription;
          s.combustion.co2Volume = a.payload.co2Volume;
          s.combustion.h2oVolume = a.payload.h2oVolume;
        };
      })
      
      .addCase(removeCompoundFromCombustion.fulfilled, (s, a) => {
        if (s.combustion) s.combustion.compounds = s.combustion.compounds.filter(c => c.id !== a.payload);
      })

      .addCase(updateCompoundCombustion.fulfilled, (s, a) => {
        if (s.combustion) s.combustion.compounds = s.combustion.compounds.map(c => {
          if (c.id == a.payload.compoundId) c.comment = a.payload.comment
          return c
        })
      })
      
      .addCase(formCombustion.fulfilled, (s, a) => {
        if (s.combustion) {
            s.combustion.status = a.payload.status;
            s.combustion.formedAt = a.payload.formedAt;
          }; 
      })
      
      .addCase(deleteCombustion.fulfilled, (s) => { s.combustion = null; })
  },
});

export const { clearCombustion } = combustionSlice.actions;
export default combustionSlice.reducer;
