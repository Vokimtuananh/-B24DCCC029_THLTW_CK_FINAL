import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import schoolReducer from './slices/schoolSlice';
import majorReducer from './slices/majorSlice';
import admissionBlockReducer from './slices/admissionBlockSlice';

export const store = configureStore({
  reducer: {
    school: schoolReducer,
    major: majorReducer,
    admissionBlock: admissionBlockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;