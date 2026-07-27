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
| `/products` | dinámica | Catálogo con búsqueda, filtro por categoría y paginación |
| `/categories` | estática | Las 24 categorías |

El redirect de `/` está en `next.config.ts` y no en un componente: los redirects de configuración se resuelven **antes** del filesystem y antes de renderizar, así que no se gasta un render de React para después descartarlo.

Quedó en `permanent: false` (307) a propósito. Con 308 el navegador cachea el redirect para siempre y cambiar la home después se vuelve un problema.

`/main/carrito` convive con la ruta dinámica `/main/[id]`: Next resuelve los segmentos estáticos primero, así que no se pisan.

---

## Estructura

```
src/
├── app/                    rutas (App Router)
├── components/
│   ├── cart/               panel, página, botón agregar, medios de pago
│   ├── categories/         carrusel, listado, título
│   ├── favorites/          botón de corazón
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
/products     mediana 10 ms      /main/[id]      mediana 12 ms
```

Lo que no baja de ahí es la API de DummyJSON: **~230 ms** por petición, latencia de red pura. Por eso todo lo anticipable se precarga:

- `preconnect` a la API y al CDN de imágenes. La primera llamada pasó de 868 ms a 347 ms: más de 500 ms eran handshake TLS.
- `usePrefetch` de RTK Query en la paginación (precarga la página siguiente y la anterior) y en el hover de los enlaces de categoría. Pasar de página pasó de 225 ms a **1 ms**.

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

Carrito y favoritos sobreviven al refresh mediante **listener middlewares de Redux** que escriben en `localStorage`:

| Slice | Clave | Qué guarda |
|---|---|---|
| `cart` | `ecommerce_app.cart` | items completos con cantidad |
| `favorites` | `ecommerce_app.favorites` | solo los ids |

De favoritos se guardan **solo ids**: si se guardara el producto entero, un precio que cambie en la API quedaría congelado en el navegador del usuario.

Al leer, cada item se valida con un type guard. Un `localStorage` manipulado o de una versión vieja del esquema inyectaría objetos rotos que revientan al renderizar.

**El estado no se precarga en `makeStore`.** El servidor siempre renderiza el carrito vacío; si el cliente arrancara leyendo `localStorage`, el primer render no coincidiría con el HTML servido y habría error de hidratación. `StoreProvider` despacha la hidratación en un efecto, después del montaje.

La página del carrito usa un flag `hydrated` para mostrar skeletons en vez del estado vacío mientras eso ocurre.

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
- **`/main` y `/categories` perdieron el render en servidor de los datos.** Al mover el catálogo a RTK Query, los productos ya no viajan en el HTML: se ve el skeleton y llegan al ejecutar el JS. Es el precio del caché en Redux y afecta al SEO de esas dos rutas. `/main/[id]`, que es la que se comparte e indexa, sigue renderizándose en el servidor.
- **El `<title>` sigue siendo "Create Next App"**, el metadata por defecto de create-next-app.
- **`globals.css` fuerza `font-family: Arial`** en el `body`, así que las fuentes Geist que carga el layout no se aplican. Viene del template.
- **Las bandas de color usan `w-screen` (100vw)**, que incluye el ancho de la barra de scroll. No desborda porque `<main>` tiene `overflow-x-clip`; si se saca esa clase, aparece scroll horizontal.
- **La marca dice "Tienda"** en el header, el footer y el drawer: es un placeholder.

---

## Convenciones

Están en `CLAUDE.md` y `AGENTS.md`:

- Sin comentarios en el código; los nombres y la estructura explican.
- Prosa, títulos y markdown en español. Código (variables, tipos, archivos, carpetas) en inglés. Los campos de la API externa no se traducen.
- `Image` de `next/image` y `Link` de `next/link` obligatorios; nunca `<img>` ni `<a>` para rutas internas.
- axios para todo HTTP, nunca `fetch` nativo.
- Todo cambio se mide con `build` + `start` contra el presupuesto de 300 ms.
- Antes de escribir código, leer la guía correspondiente en `node_modules/next/dist/docs/`: esta versión de Next tiene cambios que rompen respecto de versiones anteriores (por ejemplo, el middleware pasó a llamarse **Proxy**).
