import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find((item) => item.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({ ...action.payload, quantity: 1 });
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return;

      if (action.payload.quantity < 1) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        return;
      }

      item.quantity = action.payload.quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
  selectors: {
    selectItems: (state) => state.items,
    selectCount: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
    selectSubtotal: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },
});

export const { addItem, removeItem, setQuantity, clearCart } =
  cartSlice.actions;

export const { selectItems, selectCount, selectSubtotal } = cartSlice.selectors;

export default cartSlice.reducer;
