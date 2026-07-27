# Ecommerce App

Tienda construida con **Next.js 16** (App Router), **React 19**, **Redux Toolkit** y **Tailwind CSS v4**, consumiendo la API pública de [DummyJSON](https://dummyjson.com).

---

## Cómo iniciar el proyecto

Requiere Node 20 o superior (desarrollado con Node 24).

```bash
npm install
npm run dev
```

La app queda en <http://localhost:3000>. La raíz redirige a `/main`.

### Para medir rendimiento

**No midas en `npm run dev`.** El servidor de desarrollo compila cada ruta la primera vez que entrás y da tiempos de segundos que no son reales. Usá siempre:

```bash
npm run build
npm start
```

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build (usar esto para medir) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Chequeo de tipos |
| `npx next typegen` | Regenera los tipos de rutas (necesario tras crear una ruta nueva) |

---

## Rutas

| Ruta | Render | Qué es |
|---|---|---|
| `/` | redirect 307 | Redirige a `/main` |
| `/main` | estática | Home: carrusel de categorías, grilla de productos, marquee del catálogo y filas por categoría con scroll infinito |
| `/main/[id]` | dinámica | Detalle del producto con galería deslizable |
| `/main/carrito` | estática | Carrito completo con resumen y medios de pago |
| `/main/favoritos` | estática | Los productos marcados con el corazón |
| `/products` | dinámica | Catálogo con búsqueda, filtro por categoría y paginación |
| `/categories` | estática | Las 24 categorías |

El redirect de `/` está en `next.config.ts` y no en un componente: los redirects de configuración se resuelven **antes** del filesystem y antes de renderizar, así que no se gasta un render de React para después descartarlo.

Quedó en `permanent: false` (307) a propósito. Con 308 el navegador cachea el redirect para siempre y cambiar la home después se vuelve un problema.

`/main/carrito` y `/main/favoritos` conviven con la ruta dinámica `/main/[id]`: Next resuelve los segmentos estáticos primero, así que no se pisan. El día que exista un producto con id `carrito`, gana la ruta estática.

Ninguna de las dos está en el nav principal. Se llega al carrito desde el panel del header y a favoritos desde el corazón con contador, al lado del toggle de tema.

---

## Estructura

```
src/
├── app/                    rutas (App Router)
├── components/
│   ├── cart/               panel, página, botón agregar, medios de pago
│   ├── categories/         carrusel, listado, título
│   ├── favorites/          botón de corazón, enlace del header, listado
│   ├── footer/
│   ├── header/             nav, drawer mobile, links
│   ├── products/           card, grilla, filas, marquee, galería, búsqueda, paginación
│   ├── skeleton/           todos los estados de carga
│   └── theme/              toggle claro/oscuro
├── interfaces/             tipos de la API
│   ├── api/                paginación y errores (reusable)
│   └── products/           producto, categoría, reseña, params, respuestas
├── services/               axios y llamadas desde el servidor
└── store/
    ├── api/                RTK Query + base query con axios
    ├── features/           slices (cart, favorites)
    ├── middleware/         persistencia en localStorage
    ├── hooks.ts            hooks tipados
    └── store.ts
```

---

## Decisiones técnicas

### El store se crea por request, no una sola vez

```ts
export const makeStore = () => configureStore({ ... });
```

En el App Router el código del store también corre en el servidor. Un store exportado a nivel de módulo se compartiría entre peticiones de usuarios distintos: el carrito de uno se filtraría al otro. `StoreProvider` crea uno nuevo por render con `useState(makeStore)`.

### Las interfaces salieron de inspeccionar la API, no de la documentación

Se bajaron los 194 productos y se analizó campo por campo. Dos hallazgos que cambian los tipos:

- **`brand` es opcional.** Falta en 92 de los 194 productos. Es el único campo que no viene siempre.
- **Cuatro campos son conjuntos cerrados**, no `string` libre: `availabilityStatus` (3 valores), `returnPolicy` (5), `shippingInformation` (6) y `warrantyInformation` (10). Están tipados como uniones literales, así el editor autocompleta y TypeScript frena los valores inventados.

### axios obligatorio, y qué rompe eso

Todas las peticiones van con axios. El problema es que **axios no pasa por el caché de Next**: ese caché existe porque Next parchea el `fetch` global, así que las opciones `next: { revalidate, tags }` no aplican.

Sin resolverlo, cada visita pegaría a la API. Las dos soluciones que usa el proyecto:

- **Servidor**: `unstable_cache` de `next/cache` envolviendo la función del service.
- **Cliente**: RTK Query con un `axiosBaseQuery` propio (RTK Query usa `fetch` nativo por defecto, que violaría la regla).

### Solo se piden los campos que se usan

Las listas usan `select` en la API:

| | antes | ahora |
|---|---|---|
| `products?limit=50` | 70.9 KB | **12.1 KB** (−83%) |

Antes se traía el producto completo —`reviews`, `meta`, `dimensions`— para pintar una card que usa 8 campos. El tipo `ProductSummary` refleja eso, así que TypeScript impide pasarle a la card datos que no pidió.

### La búsqueda tiene debounce de 300 ms

El input navega solo, 300 ms después de la última tecla, con `router.replace`. Se usa `replace` y no `push` para que cada pausa al escribir no deje una entrada en el historial: volver atrás desde `/products` te devuelve a la ruta anterior, no a los seis estados intermedios de lo que tipeaste.

El botón y la tecla Enter siguen navegando en el momento, sin esperar los 300 ms.

**`ProductSearch` no puede llevar `key={search}`.** Lo llevaba: servía para resetear el input cuando la URL cambiaba desde afuera. Con debounce eso lo rompe todo, porque cada navegación remonta el componente y el input pierde el foco a media palabra. En su lugar hay un ref `lastPushed` con el último término que el componente mismo mandó a la URL: si `initialSearch` llega distinto de ese valor, el cambio vino de afuera (un enlace de categoría) y el input se sincroniza; si coincide, es el eco de la propia navegación y no se toca. Sin eso, seguir escribiendo durante la navegación pisaba las letras nuevas con el término viejo.

### El estado de productos vive en Redux, vía RTK Query

No hay un slice `products` escrito a mano. El estado está en `productsApi.reducer`, dentro del mismo store, y `useProductQuery` lo expone con los nombres que pide la consigna:

| Consigna | Equivalente |
|---|---|
| `items` | `products` |
| `status` (idle/loading/succeeded/failed) | `isLoading`, `isFetching`, `isError` |
| `error` | `errorMessage` |
| `page` | `skip` / `limit` (la página vive en la URL, no en el store) |
| `hasMore` | `total` contra `skip + limit` |

La página se deja en la URL a propósito: así una búsqueda o una página concreta se puede compartir por link y sobrevive al refresh, algo que un contador en memoria no da.

### Pull to refresh: solo con el dedo

`PullToRefresh` escucha `touchstart`/`touchmove`/`touchend` y dispara el `refetch` de RTK Query al soltar después de 64 px de arrastre. **No tiene equivalente con mouse**, porque el gesto no existe en escritorio; para probarlo hay que usar un teléfono o el modo dispositivo de las DevTools. En escritorio el camino equivalente es el botón "Reintentar" del estado de error.

`html` lleva `overscroll-behavior-y: contain`. Sin eso, Chrome en Android se queda con el gesto y recarga la página entera antes de que nuestro handler llegue a correr.

No hace falta `preventDefault()` en el `touchmove`: React registra esos listeners como pasivos y no dejaría, pero tampoco es necesario, porque con `overscroll-behavior` contenido el arrastre en `scrollY === 0` ya no mueve el documento.

### La búsqueda filtra en el cliente

La API tiene `/products/search?q=`, pero **busca en título y descripción**:

```
q="phone"    total 23  ->  titulo:8   descripcion:15
q="cruelty"  total  1  ->  titulo:0   descripcion:1
```

Buscar "phone" devolvía 15 productos que no son teléfonos. Y no existe endpoint de filtro por campo: `/products/filter` da 404, ese patrón solo existe para `/users`.

La solución fue traer el catálogo completo una vez (49.8 KB) y filtrar por título en el cliente: cada búsqueda pasa de ~230 ms a **0,03 ms**, y además permite combinar búsqueda con categoría, algo que la API no soporta.

Esto funciona porque son 194 productos. Con un catálogo real de miles habría que volver al servidor.

### Una sola petición alimenta tres cosas

`getAllProducts` es la misma entrada de caché para la búsqueda, el marquee del catálogo y las filas por categoría. Las 24 filas salen de **una** petición en vez de 24. Y no se pide al cargar la home: se dispara con un `IntersectionObserver` cuando el usuario se acerca.

### Presupuesto de 300 ms

Toda interacción —navegar, hacer click, traer datos— tiene que estar bajo 300 ms, medido sobre `npm start`.

```
/main         mediana  4 ms      /main/carrito   mediana  3 ms
/products     mediana 10 ms      /main/[id]      mediana  5 ms
```

Lo que no baja de ahí es la API de DummyJSON: **~230 ms** por petición, latencia de red pura. Por eso todo lo anticipable se precarga:

- `preconnect` a la API y al CDN de imágenes. La primera llamada pasó de 868 ms a 347 ms: más de 500 ms eran handshake TLS.
- `usePrefetch` de RTK Query en la paginación (precarga la página siguiente y la anterior) y en el hover de los enlaces de categoría. Pasar de página pasó de 225 ms a **1 ms**.

### `/main/[id]` se prerenderiza en el build, no a pedido

Era una ruta dinámica (`ƒ`), y eso costaba dos veces:

```
prefetch del <Link>   220 bytes   <- vacío: Next no prefetchea rutas dinámicas sin loading.js
RSC en frío           229-869 ms  <- el primero que entraba a cada producto pagaba la API
```

Con `generateStaticParams` sobre los 194 ids del catálogo la ruta pasa a `●` (SSG + ISR con `revalidate = 3600`):

| | antes | ahora |
|---|---|---|
| prefetch del `<Link>` | 220 bytes (vacío) | **28 KB** en 5 ms |
| RSC en frío | 229–869 ms | **5 ms** |
| HTML, primera carga | 240 ms | **5 ms** |
| peticiones a la API en runtime | 1 por id no cacheado | **0** |

Las 194 páginas se generan en 2.7 s con 10 workers. El click deja de disparar trabajo: el payload ya está en memoria del navegador cuando la card entra en pantalla.

`dynamicParams` queda en `true` (el default): si la API agrega un producto 195, esa ruta se renderiza a pedido y queda cacheada en vez de dar 404. El costo es que un id inexistente cuesta ~500 ms antes del 404, porque va a preguntarle a la API.

**No se le agrega `loading.tsx`.** En una ruta estática empeora las cosas: Next pasa de prefetchear la página entera a prefetchear solo hasta el boundary del loading, y apaga el TTL del caché de cliente. Además rompe el `notFound()`, que es el problema documentado más abajo.

---

## Problemas resueltos que no son obvios

Costaron encontrarlos; conviene no re-introducirlos.

### `loading.tsx` rompe el 404 de `notFound()`

Con un `loading.tsx` en el segmento, Next abre un boundary de Suspense y **empieza a transmitir la respuesta con status 200** antes de que el componente ejecute `notFound()`. Cuando el 404 llega, la cabecera ya se envió.

`/main/99999` devolvía 200 con la UI de "no encontrado", lo que significa que Google indexaría productos inexistentes. Se eliminó ese `loading.tsx`.

### `backdrop-filter` rompe `position: fixed`

Un elemento con `backdrop-filter` (igual que `filter` o `transform`) se vuelve el **bloque contenedor** de sus descendientes `fixed`. El header tenía `backdrop-blur` y el drawer vivía adentro, así que el panel se medía contra el header en vez del viewport: quedaba del alto de la barra y los links se desbordaban afuera.

El blur ahora está en un div decorativo hermano del contenido, no en el `<header>`.

### Flexbox necesita `min-w-0` para que un scroller scrollee

Un contenedor con `overflow-x-auto` dentro de una cadena flex no se limita al ancho del padre: se estira al de su contenido y empuja la página. Hay `min-w-0` en los 7 niveles de la cadena (`main` → contenedor → sección → filas → scroller).

### Tailwind v4 ya no compone todo en `transform`

```css
.hover\:scale-\[1.03\]:hover { scale: 1.03 }       /* propiedad `scale`, no `transform` */
.motion-reduce\:transform-none { transform: none }  /* no anula `scale` */
```

La guarda de accesibilidad para `prefers-reduced-motion` no servía. Hay que anular explícitamente con `motion-reduce:hover:scale-100`.

### El marquee usa `mr-4`, no `gap-4`

Con `gap`, dos copias de N items tienen 2N−1 huecos, pero una copia sola tiene N−1. Falta exactamente un `gap` y el `translateX(-50%)` no cae donde debe:

```
con gap-4:  desfase de 8 px por vuelta  -> salto visible
con mr-4:   desfase de 0 px             -> costura exacta
```

Además el riel repite la lista hasta un mínimo de items antes de duplicarla, porque una categoría de 3 productos no llenaría la pantalla y se vería el hueco del bucle.

### Un `<button>` no puede ir dentro de un `<a>`

Es HTML inválido y al tocarlo el navegador navega en vez de ejecutar la acción. El botón de agregar al carrito y el corazón de favoritos son **hermanos** del `Link`, no hijos; el corazón se posiciona en absoluto sobre la imagen.

Para el efecto de "presionado" de la card se usa `has-[a:active]:scale-[0.97]` en vez de `active:`, porque `:active` se propaga a los ancestros: apretar el botón de agregar encogía la card entera.

### Los carruseles manuales cortan la última card

Con `scroll-snap`, al llegar al final del recorrido el scroll no puede avanzar más y el navegador no tiene margen para alinear: la primera card visible queda partida. Pasa siempre que el total de items no es múltiplo exacto de los que entran en pantalla.

Por eso las bandas destacadas usan marquee automático y no scroll manual.

---

## Persistencia

La consigna pedía `AsyncStorage`, que es una API de **React Native** y no existe en el navegador. `localStorage` es el equivalente en web y es lo que se usa acá: misma idea (clave-valor persistente por origen), API sincrónica en vez de basada en promesas.

Carrito y favoritos sobreviven al refresh mediante **listener middlewares de Redux** que escriben en `localStorage`:

| Slice | Clave | Qué guarda |
|---|---|---|
| `cart` | `ecommerce_app.cart` | items completos con cantidad |
| `favorites` | `ecommerce_app.favorites` | solo los ids |

De favoritos se guardan **solo ids**: si se guardara el producto entero, un precio que cambie en la API quedaría congelado en el navegador del usuario. La página de favoritos reconstruye los productos cruzando esos ids contra el catálogo cacheado, así que mostrar los favoritos no cuesta ninguna petición extra.

Al leer, cada item se valida con un type guard. Un `localStorage` manipulado o de una versión vieja del esquema inyectaría objetos rotos que revientan al renderizar.

**El estado no se precarga en `makeStore`.** El servidor siempre renderiza el carrito y los favoritos vacíos; si el cliente arrancara leyendo `localStorage`, el primer render no coincidiría con el HTML servido y habría error de hidratación. `StoreProvider` despacha la hidratación en un efecto, después del montaje.

Los dos slices llevan un flag `hydrated` para que las páginas muestren skeletons en vez del estado vacío mientras eso ocurre. Sin él, entrar directo a `/main/carrito` o `/main/favoritos` mostraría "está vacío" por un instante aunque tuvieras cosas guardadas.

---

## Tema claro/oscuro

Tailwind v4 usa `prefers-color-scheme` por defecto, o sea que ningún botón podría cambiarlo. La variante está redefinida:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Las 89 utilidades `dark:` del proyecto siguen funcionando sin tocarlas.

Para que no haya parpadeo al recargar, un `<script>` inline en el `<head>` lee `localStorage` y aplica el atributo **antes del primer pintado** — es la técnica que documenta Next para esto. El `<html>` lleva `suppressHydrationWarning` porque el script modifica el DOM antes de que React hidrate.

El tema **no está en Redux**: el store se hidrata después del montaje, demasiado tarde para evitar el flash.

El botón tampoco usa estado de React. Los dos iconos están en el DOM y se muestran por CSS (`hidden dark:block`), lo que evita el desajuste de hidratación de un ícono que depende de una preferencia que el servidor desconoce.

Primera visita sin preferencia guardada: usa la del sistema operativo. Una vez que se toca el botón, la elección del usuario manda.

---

## Accesibilidad

- Todas las animaciones se neutralizan con `prefers-reduced-motion`, incluidos el marquee y el autoplay del carrusel.
- Los carruseles usan `aria-roledescription="carrusel"` y `"diapositiva"`, el patrón que esperan los lectores de pantalla.
- Los skeletons llevan `role="status"` con etiqueta.
- El drawer se cierra con Escape y bloquea el scroll del body mientras está abierto.
- Los paneles cerrados usan el atributo `inert`, así no son enfocables con Tab.
- En el marquee la copia duplicada lleva `aria-hidden` y `tabIndex={-1}` para no leer todo dos veces.

---

## Limitaciones conocidas

- **No hay checkout real.** El botón "Pagar" avisa que no hay pasarela conectada. Los distintivos de Visa, Mastercard, Bancard y AMEX están dibujados con CSS, no son logos oficiales.
- **`/main` y `/categories` perdieron el render en servidor de los datos.** Al mover el catálogo a RTK Query, los productos ya no viajan en el HTML: se ve el skeleton y llegan al ejecutar el JS. Es el precio del caché en Redux y afecta al SEO de esas dos rutas. `/main/[id]`, que es la que se comparte e indexa, se prerenderiza completa en el build.
- **La paginación es Anterior/Siguiente, no infinite scroll ni "Cargar más".** Es paginación real contra la API (`limit`/`skip`) y el número de página vive en la URL, así que una página concreta se puede compartir. Pero no es ninguno de los dos patrones que enumera la consigna.
- **El pull to refresh no funciona con mouse.** Es un gesto táctil; en escritorio hay que usar el modo dispositivo de las DevTools.
- **El `<title>` sigue siendo "Create Next App"**, el metadata por defecto de create-next-app.
- **`globals.css` fuerza `font-family: Arial`** en el `body`, así que las fuentes Geist que carga el layout no se aplican. Viene del template.
- **Las bandas de color usan `w-screen` (100vw)**, que incluye el ancho de la barra de scroll. No desborda porque `<main>` tiene `overflow-x-clip`; si se saca esa clase, aparece scroll horizontal.
- **La marca dice "Tienda"** en el header, el footer y el drawer: es un placeholder.
