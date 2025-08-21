// redux/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from "./authSlice.js"; // adjust path if needed
import themeReducer from './themeSlice.js'
import blogSlice from './blogSlice.js'
import commentSlice from './commentSlice.js'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  blog: blogSlice,
  comment: commentSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store; // ✅ default export
