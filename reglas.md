# Estándares de desarrollo

Maison Brumaire — convenciones de ramas, commits, codificación y arquitectura de la tienda 3D.

---

## ESTÁNDARES DE RAMAS

| Rama | Uso |
|---|---|
| `main` | Versión estable; desde aquí se publica en GitHub Pages |
| `develop` | Integración de los módulos terminados |
| `feat/<modulo>` | Desarrollo de un módulo o sección, en `snake_case` (ej. `feat/escena_3d`) |
| `fix/<tema>` | Corrección puntual sobre `develop` |
| `style/<tema>` | Cambio visual sin tocar la lógica |
| `refactor/<tema>` | Reestructuración o limpieza sin cambiar el comportamiento |
| `test/<tema>` | Pruebas nuevas o ajustes de pruebas |
| `docs/<tema>` | Documentación (README, reglas) |
| `build/<tema>` | Compilación y publicación del sitio |

### Flujo

1. Cada módulo se desarrolla en su rama, creada desde `develop`.
2. Al terminarlo se abre un Pull Request hacia `develop`. GitHub Actions debe pasar antes del merge.
3. Cuando `develop` reúne una entrega completa, se abre un Pull Request de `develop` hacia `main`.
4. Después del merge, la rama de trabajo se borra; en el repositorio solo quedan `main` y `develop`.

---

## ESTÁNDARES DE COMMITS

Se usa Conventional Commits, con todos los commits a nombre del autor del repositorio y sin coautores.

### Tipos de commit

| Tipo | Uso |
|---|---|
| `feat` | Nueva sección o funcionalidad |
| `fix` | Corrección de errores |
| `style` | Cambios visuales, de luz o de animación sin afectar la lógica |
| `refactor` | Reestructuración de código sin modificar el comportamiento |
| `docs` | Documentación |
| `test` | Creación o actualización de pruebas |
| `chore` | Configuración del proyecto, dependencias, CI y herramientas |
| `build` | Compilación y publicación en GitHub Pages |

### Formato

```
<tipo>: <Descripción>
```

### Ejemplos válidos

```
feat: Agrega la tetera que sirve el té al final del recorrido
fix: Evita que la cámara salte al recargar a mitad de página
style: Calienta la luz de la sección del ritual
test: Prueba que el carrito no baja de cero unidades
```

### Reglas

- El mensaje comienza con mayúscula después del prefijo.
- Describe la funcionalidad, no los archivos modificados.
- Un commit representa una única funcionalidad, corrección o mejora.
- Evitar mensajes genéricos: `cambios`, `correcciones`, `actualización`, `prueba`.

---

## ESTÁNDARES DE CODIFICACIÓN

### Idioma

- El código se escribe en inglés: componentes, funciones, variables, tipos y constantes.
- Los textos que ve el visitante, los comentarios y la documentación van en español.
- Los nombres de los tés y de la casa van en francés, porque son parte de la marca.

### Comentarios

- Cada componente y cada función lleva un comentario `/** */` de una línea que dice su propósito.
- Dentro de las funciones solo se dejan avisos importantes, de una línea.
- Eliminar el código comentado antes de cada commit.

```tsx
/** Suma una lata al carrito sin pasar del máximo por pedido. */
export function addItem(cart: Cart, id: TeaId): Cart {
  const current = cart[id] ?? 0
  return { ...cart, [id]: Math.min(current + 1, MAX_UNITS_PER_TEA) }
}
```

### Sintaxis

El formato y el lint se validan con oxlint (`npm run lint`) y el tipado con TypeScript en modo estricto (`npm run typecheck`). El código muerto se revisa con knip (`npx knip` debe salir sin hallazgos). Las herramientas en Python se validan con Ruff (`ruff check tools` y `ruff format --check tools`).

**Tipado estricto siempre.** No se usa `any`; las props de cada componente tienen su tipo.

**No usar el operador ternario (`a ? b : c`) en la lógica ni en el JSX**; se prefieren bloques `if`/`else`, un valor por defecto que se reemplaza o `&&` para mostrar algo condicionalmente.

```tsx
// Correcto
let label = 'Agregar'
if (units > 0) {
  label = `En el carrito (${units})`
}

// Incorrecto
const label = units > 0 ? `En el carrito (${units})` : 'Agregar'
```

**Evitar valores mágicos**; se declaran como constantes con nombre en `CONSTANT_CASE`. Las posiciones y tiempos de la escena viven en tablas de configuración (`src/scroll/keyframes.ts`, `src/scene/layout.ts`, `src/scene/timeline.ts`). Los datos del catálogo y los textos no cuentan como valores mágicos.

**Exportar solo lo que se usa fuera del módulo.** Las constantes internas no se exportan; las que leen las pruebas sí.

**Nombres:**

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes y sus archivos | `PascalCase` | `TeaTin.tsx` |
| Otros módulos | `camelCase` | `keyframes.ts` |
| Funciones y variables | `camelCase` | `sampleCamera()` |
| Hooks | prefijo `use` | `useScrollProgress()` |
| Tipos | `PascalCase` | `CameraKeyframe` |
| Constantes | `CONSTANT_CASE` | `MAX_UNITS_PER_TEA` |
| Clases CSS | `kebab-case` | `tea-card` |

---

## DISEÑO

- Los colores y fuentes se definen como variables en `src/styles/global.css`. En el CSS se usan las variables; una transparencia de un color de la paleta se escribe como `rgb()` del mismo valor. En la escena, los colores van en constantes con nombre.
- Todo texto debe superar un contraste de 4.5:1 sobre su fondo (3:1 si mide 24 px o más). El oro `#B08D57` es solo para líneas y filetes, nunca para texto.
- Fraunces para títulos y Figtree para el texto. Las etiquetas de las latas usan las mismas fuentes.
- Los textos que pasan sobre la escena llevan el velo de bruma.

---

## ARQUITECTURA

### Estructura

```
src/
├── content/          Textos de la marca y catálogo de tés (datos, sin lógica)
├── scroll/           Progreso del scroll, scroll suave y fotogramas clave de la cámara
├── scene/            Escena 3D: lienzo, cámara, piezas y efectos
├── shop/             Estado del carrito y sus reglas
├── ui/               Secciones HTML que acompañan a la escena
└── styles/           Estilos globales y variables de diseño
tools/blender/        Scripts que modelan las piezas; nada de aquí entra al sitio
public/models/        Modelos .glb exportados por los scripts
```

### Responsabilidades

| Capa | Puede | No puede |
|---|---|---|
| `scroll/` | Medir el progreso y calcular la pose de la cámara | Tocar objetos de la escena |
| `scene/` | Leer el progreso y animar cámara y piezas en `useFrame` | Guardar estado de la tienda o renderizar HTML |
| `shop/` | Mantener el carrito con funciones puras y un contexto de React | Conocer la escena 3D |
| `ui/` | Mostrar textos y llamar a las acciones del carrito | Leer el progreso dentro de `useFrame` |
| `content/` | Exportar datos | Contener lógica |

**El progreso del scroll vive en una referencia, no en el estado de React**, para que la escena se anime a 60 fps sin volver a renderizar componentes.

**Las animaciones de la escena se calculan a partir del progreso**, con funciones puras y probadas; así subir el scroll rebobina todo sin estados intermedios.

---

## PRUEBAS

- Las pruebas usan Vitest y viven junto al módulo que prueban, con el sufijo `.test.ts` o `.test.tsx`.
- Las funciones puras (fotogramas clave, carrito, formato de precios) tienen pruebas unitarias.
- Las secciones HTML se prueban con Testing Library.
- En cada Pull Request, GitHub Actions corre el lint, el tipado, las pruebas y la compilación.

---

## ASSETS

- Los modelos salen de `tools/blender/models.py` y se exportan a `public/models/` en `.glb`, en metros.
- Para cambiar un modelo se cambia su script y se vuelve a exportar; los `.glb` no se editan a mano.
- Las etiquetas de las latas se dibujan desde el código, para no depender de imágenes.

---

## BUENAS PRÁCTICAS GENERALES

- Cada archivo tiene una única responsabilidad principal.
- Evitar código duplicado y código sin uso.
- No incluir credenciales en el repositorio.
- La marca es ficticia: el sitio lo indica en el pie de página y no procesa pagos reales.
