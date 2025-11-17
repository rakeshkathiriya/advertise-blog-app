import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';

// Persist config
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create RootState type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Auto-expire user after 7 days
store.subscribe(() => {
  const state = store.getState();
  const user = state.auth.user;

  if (user?.expireAt && Date.now() > user.expireAt) {
    // Use globalThis instead of window
    globalThis.localStorage?.removeItem('persist:auth');

    globalThis.location?.reload();
  }
});

export const persist = persistStore(store);
