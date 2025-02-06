import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userInfoReducer from "./userInfoSlice";
import notificationCount from "./NotificationCountSlice";
import themeColor from "./themeColorSlice";

// Step 1: Combine your reducers
const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  notificationCount: notificationCount,
  themeColor: themeColor,
});

// Step 2: Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userInfo", "notificationCount", "themeColor"],
};

// Step 3: Wrap combined reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check
    }),
});

// Step 5: Create persistor
export const persistor = persistStore(store);

export default store;
