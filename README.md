# Calculadora de caja

Calculadora para mostrador: aplica descuento e IVA sobre un importe, calcula el cambio a devolver y lo desglosa en los billetes y monedas concretos con los que darlo.

La idea sale de haber estado años en caja: la cuenta es fácil, lo que cansa es pensar rápido con qué monedas devolver el cambio cuando hay cola.

## Uso

Abre `index.html` en el navegador. No necesita servidor ni instalación.

## Detalles técnicos

- HTML, CSS y JavaScript, sin librerías ni dependencias.
- **Todos los importes se manejan en céntimos, con números enteros.** Si se usaran decimales, operaciones como `0.1 + 0.2` dan `0.30000000000000004` por cómo se representan los números en coma flotante, y con dinero eso acaba en descuadres de un céntimo.
- El desglose del cambio usa un algoritmo voraz: empieza por la denominación más alta que cabe y va bajando. Con el sistema de monedas del euro, esto siempre da el mínimo número de piezas.
