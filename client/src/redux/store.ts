  import { configureStore } from '@reduxjs/toolkit';
  import authReducer from './slices/authSlice';
  import { persistReducer, persistStore } from 'redux-persist';
  import storage from 'redux-persist/lib/storage'; // defaults to localStorage
  import { combineReducers } from 'redux';
  import loadingReducer from './slices/loadingSlice'; 
  import projectReducer from './slices/projectSlice'; // Assuming you have a project slice
  


  const rootReducer = combineReducers({
    auth: authReducer,
    loading: loadingReducer,
    projects: projectReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
