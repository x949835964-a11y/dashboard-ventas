# Dashboard de Ventas · Mercado Andino

Dashboard de ventas interactivo y responsivo para una tienda en línea (ficticia) de Lima, Perú. Muestra indicadores clave, tendencias y transacciones en un rango de fechas elegido, y permite exportar los datos a CSV.

🔗 **Demo en vivo:** https://x949835964-a11y.github.io/dashboard-ventas/

<img width="1917" height="954" alt="image" src="https://github.com/user-attachments/assets/400c772e-6510-4d23-ae22-37181d0d65e3" />


> Los datos son de ejemplo: se generan en el navegador con una semilla fija, así que siempre se ven igual y no se necesita backend.

## Funcionalidades

- **Indicadores (KPIs):** ventas totales, número de pedidos, ticket promedio y tasa de conversión, cada uno comparado con el periodo anterior de la misma duración.
- **Filtro por rango de fechas:** Hoy, Últimos 7 días, Este mes y Personalizado (con validación de fechas).
- **Gráfico de tendencia:** área con las ventas por día (o por hora cuando el rango es un solo día) y el periodo anterior como línea punteada.
- **Ventas por categoría:** gráfico de dona con montos y porcentajes.
- **Productos más vendidos:** gráfico de barras horizontales con el top 7 por ingresos.
- **Tabla de transacciones:** búsqueda, ordenamiento por fecha o total, paginación y estados (Completado, Pendiente, Reembolsado).
- **Exportar a CSV:** descarga todas las transacciones del filtro actual, compatible con Excel (UTF-8 con BOM).
- **Diseño responsivo** para escritorio, tablet y móvil, con **modo claro y oscuro** automático según el sistema.

## Tecnologías

- HTML5
- CSS3: variables, CSS Grid, Flexbox y media queries
- JavaScript (ES6+), sin frameworks
- [Chart.js 4](https://www.chartjs.org/) vía CDN
- API `Intl` para formatear soles (PEN) y fechas en español

## Estructura del proyecto

```
dashboard-ventas/
├── index.html    # Estructura de la página
├── styles.css    # Estilos, temas y diseño responsivo
├── script.js     # Datos de ejemplo, filtros, gráficos, tabla y exportación
└── README.md
```

## Cómo ejecutarlo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/x949835964-a11y/dashboard-ventas.git
   ```
2. Abre `index.html` en tu navegador.

No requiere instalación. Solo necesita conexión a internet para cargar Chart.js y las fuentes.

## Cómo funciona

- **Datos de ejemplo:** `script.js` genera 150 días de sesiones y pedidos con un generador pseudoaleatorio con semilla (`mulberry32`). Simula variación por hora y día de la semana, y picos en días de quincena.
- **Comparación de periodos:** para un rango de *N* días, se compara con los *N* días inmediatamente anteriores.
- **Tasa de conversión:** pedidos válidos ÷ sesiones del periodo. Los pedidos reembolsados no se cuentan en ventas ni en pedidos.

## Próximas mejoras

- Conectar a una API real (por ejemplo, un backend en Flask + MySQL) reemplazando la función `generate()` por un `fetch`.
- Filtro por categoría y método de pago.
- Exportar también a Excel (.xlsx).

## Autor

**Diego Gamonal Paucar** — Estudiante de Ingeniería de Sistemas, Universidad Autónoma del Perú

- GitHub: [@x949835964-a11y](https://github.com/x949835964-a11y)
- LinkedIn: [edson-diego-gamonal-paucar](https://www.linkedin.com/in/edson-diego-gamonal-paucar-567260426)
