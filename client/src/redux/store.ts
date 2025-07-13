import { configureStore} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';
import projectReducer from './slices/projectSlice';
import workspaceReducer from './slices/workspaceSlice'; // ✅

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  projects: projectReducer,
  workspace: workspaceReducer, // ✅ included here
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ✅ FIXED RootState using rootReducer (not store.getState)
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
