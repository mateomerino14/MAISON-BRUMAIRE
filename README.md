# Maison Brumaire

Tienda ficticia de tés franceses contada con una escena 3D que avanza con el scroll. La tetera humea en la bruma, la lata se abre y suelta las hojas, la colección surge de la niebla y, al final, la tetera sirve una taza.

**Sitio:** https://mateomerino14.github.io/MAISON-BRUMAIRE/

> Proyecto de portafolio. La marca, los productos y los precios son inventados; el carrito es de demostración y no procesa pagos.

![Portada con la tetera y la taza en la bruma](docs/capturas/portada.png)

| La colección | El ritual |
|---|---|
| ![Las cuatro latas sobre el catálogo](docs/capturas/coleccion.png) | ![La tetera sirviendo el té en la taza](docs/capturas/ritual.png) |

## Stack

| Parte | Herramienta |
|---|---|
| Sitio | Vite, React 19 y TypeScript estricto |
| 3D | Three.js con React Three Fiber y drei |
| Scroll suave | Lenis |
| Modelos | Scripts de Blender en Python (`tools/blender/`) que exportan `.glb` |
| Pruebas | Vitest y Testing Library |
| Calidad | oxlint, TypeScript y Ruff para los scripts |
| Publicación | GitHub Actions y GitHub Pages |

## Cómo funciona

1. **Paradas.** Cada sección de la página mide lo mismo y lleva `data-stop`. `useSmoothScroll` convierte la posición del scroll en un progreso medido en paradas: vale `0` en la portada, `1` en la tetera, y así hasta `6` en el cierre.
2. **Cámara.** `src/scroll/keyframes.ts` guarda una pose de cámara por parada. `sampleCamera` interpola entre las dos más cercanas con una curva suave, y `CameraRig` la aplica en cada cuadro con un leve paralaje que sigue al puntero.
3. **Animaciones.** `src/scene/timeline.ts` define en qué tramo del recorrido pasa cada cosa (abrir la lata, el vuelo de las hojas, servir el té, llenar la taza). Son funciones puras del progreso: al subir el scroll todo se rebobina solo.
4. **Sin renders de más.** El progreso vive en un objeto fuera de React; la escena lo lee dentro de `useFrame`, así que el scroll no vuelve a renderizar componentes.
5. **Pantallas angostas.** En un celular la cámara abre el ángulo, se aleja y apunta al centro de cada objeto, porque los textos pasan a la parte de abajo.

## Estructura

```
src/
├── content/      Textos de la marca y catálogo de tés
├── scroll/       Progreso del scroll, scroll suave y poses de la cámara
├── scene/        Escena 3D: tetera, taza, latas, hojas, vapor y línea de tiempo
├── shop/         Carrito (funciones puras + contexto) y formato de precios
├── ui/           Secciones HTML, encabezado y panel del carrito
└── styles/       Estilos globales
tools/blender/    Modelado procedural de las piezas
public/models/    Modelos .glb exportados
```

## Desarrollo

```bash
npm install
npm run dev        # servidor local
npm run lint       # oxlint
npm run typecheck  # TypeScript
npm test           # Vitest
npm run build      # compilación para GitHub Pages
```

### Regenerar los modelos

Los `.glb` salen de `tools/blender/models.py`; para cambiar una pieza se cambia el script y se vuelve a exportar.

```bash
pip install bpy                       # Blender como módulo de Python
python3 tools/blender/models.py       # o: blender --background --python tools/blender/models.py
```

## Convenciones

Ramas, commits y estilo de código en [reglas.md](reglas.md).
