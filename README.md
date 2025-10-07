Tetris Binario

Aplicación web para practicar la conversión entre binario y decimal a través de una mecánica inspirada en Tetris. Cada celda ocupada vale 1 y cada celda vacía 0. El valor binario de cada fila (MSB a la izquierda) se convierte a decimal. Si coincide con uno de los 4 objetivos propuestos, la fila se elimina y los objetivos se reponen, reforzando el cálculo mental y el reconocimiento de patrones de bits.

Objetivos educativos
- Reforzar la conversión mental entre base 2 y base 10 con 8 bits o menos.
- Interiorizar los pesos de bit (128, 64, 32, 16, 8, 4, 2, 1) y su suma.
- Fomentar la agilidad en la lectura de patrones binarios dentro de una dinámica lúdica.
- Proveer al profesorado de un recurso listo para proyectar y configurable.

Características principales
- Selector de anchura en bits: 8, 6, 5 o 4 (MSB a la izquierda, pesos visibles arriba).
- Nube de 4 objetivos decimales únicos (entre 1 y 2^bits − 1) que se regeneran al limpiar.
- Piezas tipo Tetris con colores clásicos por tetrominó y vista “Siguiente”.
- Puntuación +100 por fila eliminada y récord por nivel (se guarda en localStorage).
- Modal de “Records”: muestra la mejor puntuación para 4b/5b/6b/8b.
- Temas Light/Dark conmutables y persistentes.
- Controles completos por teclado y botones accesibles.

Mecánica y puntuación
- 0/1 por celda; el valor binario de cada fila se convierte a decimal.
- Limpieza de fila si su valor decimal coincide con cualquiera de los 4 objetivos.
- 0 no aparece como objetivo para evitar limpiar filas vacías.
- Puntuación: +100 por cada fila eliminada. Se guarda récord por cada nivel de bits en `localStorage`.

Controles
- Teclado: ← → mover | ↑ rotar | ↓ bajar | Espacio caída | P pausa | R reiniciar.
- Botones: Iniciar, Pausa/Reanudar, Reiniciar, Tema, Records, Selector de bits.

Puesta en marcha
1. Clona o descarga este repositorio.
2. Abre `index.html` en un navegador moderno (no requiere servidor ni compilación).
3. Elige el número de bits, pulsa `Iniciar` y juega. Usa `Records` para consultar las mejores marcas.

Estructura del proyecto

```
TETRIS BINARIO/
├── index.html   # Estructura de la vista, controles y modal de récords
├── style.css    # Estilos, temas Light/Dark, tablero y modal
└── script.js    # Lógica de piezas, colisiones, caída, limpieza, objetivos, puntuación y récords
```

Ideas de uso en el aula
- Proyecta el juego y pide a la clase anticipar el valor decimal de filas “casi completas”.
- Trabaja con 4–5 bits al inicio; aumenta a 6–8 bits conforme sube la soltura.
- Invita a verbalizar cómo se combinan los pesos (p.ej., “64 + 16 + 8 = 88”).
- Usa el modal de “Records” para motivar retos por niveles.

Personalización rápida
- Velocidad de caída: ajusta `dropInterval` (ms) en `script.js`.
- Paleta de piezas: modifica `TYPE_COLOR` en `script.js`.
- Temas y colores de UI: edita variables en `style.css` (`:root`, `.theme-light`).
- Niveles visibles en el modal: cambia el array `LEVELS` en `script.js`.

Compatibilidad
- Funciona offline y sin dependencias. Probado en navegadores modernos (Chromium/Firefox/Edge). 

Créditos
- Javier Feijóo López — Docente Informática en Secundaria, Xunta de Galicia — GitHub: https://github.com/javier-feijoo

Licencia
- Creative Commons CC BY‑SA 4.0. Si lo reutilizas o adaptas, cita la autoría y comparte mejoras con la misma licencia.
