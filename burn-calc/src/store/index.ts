import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import draftWidgetReducer from '../slices/draftWidgetSlice'
import combustionReducer from '../slices/combustionSlice'
import combustionsListReducer from '../slices/combustionsListSlice'
import filterReducer from '../slices/filterSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        draftWidget: draftWidgetReducer,
        combustion: combustionReducer,
        combustionsList: combustionsListReducer,
        filter: filterReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
