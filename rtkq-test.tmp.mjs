import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost:3000/",
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = await import("react");
const { act, useState, createElement: h } = React;
const { createRoot } = await import("react-dom/client");
const ReactRedux = await import("react-redux");

const axios = (await import("axios")).default;
let requestCount = 0;
const requested = [];
axios.interceptors = axios.interceptors;

const { makeStore } = await import("./ptmp/store.ts");
const { productsApi, useGetProductsQuery, useGetCategoriesQuery } = await import(
  "./ptmp/api/productsApi.ts"
);
const { api } = await import("./ptmp/api.ts");

api.interceptors.request.use((config) => {
  requestCount++;
  requested.push((config.url ?? "") + " " + JSON.stringify(config.params ?? {}));
  return config;
});

let store;
function Root({ children }) {
  const [s] = useState(makeStore);
  store = s;
  return h(ReactRedux.Provider, { store: s }, children);
}

let productsState = null;
function ProductsPage() {
  const q = useGetProductsQuery({ limit: 20 });
  productsState = q;
  return null;
}
function CategoriesPage() {
  useGetCategoriesQuery();
  return null;
}

const container = dom.window.document.getElementById("root");
const root = createRoot(container);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

console.log("=== 1. entra a /main (monta ProductsPage) ===");
await act(async () => {
  root.render(h(Root, null, h(ProductsPage)));
});
await act(async () => {
  await wait(1500);
});
console.log("peticiones http hasta ahora:", requestCount);
console.log("productos en cache:", productsState?.data?.products?.length ?? 0);

console.log("\n=== 2. navega a /categories (desmonta productos) ===");
await act(async () => {
  root.render(h(Root, null, h(CategoriesPage)));
});
await act(async () => {
  await wait(1500);
});
console.log("peticiones http hasta ahora:", requestCount);

console.log("\n=== 3. VUELVE a /main (mismo query) ===");
const before = requestCount;
await act(async () => {
  root.render(h(Root, null, h(ProductsPage)));
});
await act(async () => {
  await wait(1200);
});
console.log("peticiones http nuevas al volver:", requestCount - before);
console.log("productos disponibles al instante:", productsState?.data?.products?.length ?? 0);
console.log("isLoading al volver:", productsState?.isLoading);

console.log("\n--- peticiones realizadas ---");
requested.forEach((r, i) => console.log(` ${i + 1}. ${r}`));

const cacheKeys = Object.keys(store.getState().productsApi.queries);
console.log("\nentradas cacheadas en redux:", JSON.stringify(cacheKeys));
console.log(
  requestCount - before === 0
    ? "\nRESULTADO: volver a /main NO disparo ningun fetch (sirve del cache de Redux)"
    : "\nRESULTADO: FALLA - volvio a pedir a la API",
);
