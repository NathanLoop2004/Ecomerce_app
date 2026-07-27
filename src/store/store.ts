import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import favoritesReducer from "./features/favorites/favoritesSlice";
import { cartPersistenceMiddleware } from "./middleware/cartPersistence";
import { favoritesPersistenceMiddleware } from "./middleware/favoritesPersistence";
import { productsApi } from "./api/productsApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(cartPersistenceMiddleware.middleware)
        .prepend(favoritesPersistenceMiddleware.middleware)
        .concat(productsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
