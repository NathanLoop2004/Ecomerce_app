import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice.ts";
import { cartPersistenceMiddleware } from "./middleware/cartPersistence.ts";
import { productsApi } from "./api/productsApi.ts";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(cartPersistenceMiddleware.middleware)
        .concat(productsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
