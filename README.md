Tetris Binario (HTML/CSS/JS)

Descripción
- Juego tipo Tetris para practicar binario con 8 bits o menos. Cada celda ocupada vale 1 y vacía 0. El valor binario de cada fila (MSB a la izquierda) se convierte a decimal. Si coincide con uno de los 4 objetivos mostrados, esa fila se elimina y se repone el objetivo con otro número aleatorio.
- Incluye selector de bits (8/6/5/4), puntuación, récord por nivel, vista de la siguiente pieza, temas light/dark y una ventana modal con los récords de todos los niveles.

Reglas y puntuación
- 0/1 por celda; MSB en la columna izquierda. Pesos mostrados en la parte superior (p.ej. 128 64 32 16 8 4 2 1).
- Objetivos: 4 números decimales únicos entre 1 y 2^bits − 1. Se reponen al limpiar.
- Limpieza: se elimina la fila si su valor decimal coincide con cualquiera de los objetivos.
- Puntuación: +100 por cada fila eliminada.

Controles
- Teclado: ← → mover, ↑ rotar, ↓ bajar un paso, Espacio caída, P pausa, R reiniciar.
- Botones: Iniciar, Pausa/Reanudar, Reiniciar, Tema, Records, Selector de bits.

Records
- Récord por nivel (número de bits). Se guarda en localStorage con clave `tetris_binario_highscore_<BITS>`.
- Botón “Records” abre un modal con la tabla de récords para 4b/5b/6b/8b.

Temas
- Botón “Tema” conmutador Light/Dark. Preferencia persistida en localStorage (`theme`).

Ejecución
- No requiere build. Abre `index.html` en tu navegador.

Estructura
- `index.html`
  - Layout general, paneles, botones, modal de récords.
- `style.css`
  - Estilos del tablero, temas, modal, tipografías, y UI.
- `script.js`
  - Lógica del juego: piezas, colisiones, caída, limpieza, objetivos, puntuación, récord por nivel, modal de récords y tema light/dark.

Personalización rápida
- Cambiar ancho por defecto de bits: `index.html` selector “Bits”.
- Ajustar velocidad de caída: `script.js` variable `dropInterval` (ms).
- Colores de piezas: `TYPE_COLOR` en `script.js`.
- Paleta de temas: variables CSS en `style.css` (`:root` y `.theme-light`).

Créditos
- Javier Feijóo López — Docente Informática en Secundaria, Xunta de Galicia — GitHub: https://github.com/javier-feijoo

Estado del modal “Records”
- Implementado: botón `Records` (cabecera), modal con backdrop, lista de niveles y puntuaciones, apertura/cierre con click/Escape, estilos para ambos temas.
- Si quieres ampliar niveles (por ejemplo 3b/7b/10b), añade el valor a `LEVELS` en `script.js` y, si procede, opciones al selector de bits en `index.html`.
