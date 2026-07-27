import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FavoritesState = {
  ids: string[];
};

const initialState: FavoritesState = {
  ids: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const index = state.ids.indexOf(action.payload);

      if (index === -1) state.ids.push(action.payload);
      else state.ids.splice(index, 1);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    clearFavorites(state) {
      state.ids = [];
    },
    hydrateFavorites(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
  },
  selectors: {
    selectFavoriteIds: (state) => state.ids,
    selectFavoritesCount: (state) => state.ids.length,
  },
});

export const {
  toggleFavorite,
  removeFavorite,
  clearFavorites,
  hydrateFavorites,
} = favoritesSlice.actions;

export const { selectFavoriteIds, selectFavoritesCount } =
  favoritesSlice.selectors;

export default favoritesSlice.reducer;
