# Explicación: Cómo se Guarda en la Base de Datos

## Estructura de los Modelos

### Modelo `Sales` (Venta/Cabecera)
- Representa **UNA VENTA COMPLETA**
- Contiene información general de la venta:
  - Cliente (`provider`)
  - Tipo de comprobante (`type_receipt`)
  - Método de pago (`type_pay`)
  - Fecha (`date_creation`)
  - **Total de la venta** (`total`)

### Modelo `DetailSales` (Detalle de Venta)
- Representa **UN PRODUCTO dentro de una venta**
- Contiene información del producto específico:
  - Producto (`product`)
  - Cantidad (`quantity`)
  - Precio unitario (`price`)
  - Subtotal (`subtotal`)
  - Total del producto (`total`)
  - **Relación con la venta** (`sale` - ForeignKey a `Sales`)

## Relación entre Modelos

```
Sales (1) ────────< (N) DetailSales
Una venta tiene múltiples detalles (productos)
```

## Ejemplo: Venta con Bismutol y Paracetamol

### ✅ ESTRUCTURA CORRECTA (Lo que debería ser)

**Tabla `Sales`:**
| id | date_creation | type_receipt | type_pay | total | provider_id |
|----|---------------|--------------|----------|-------|-------------|
| 1  | 2024-12-15    | B            | E        | 640.00| 5           |

**Tabla `DetailSales`:**
| id | sale_id | product_id | quantity | price | subtotal | total |
|----|---------|------------|----------|-------|----------|-------|
| 1  | 1       | 10 (Bismutol) | 20     | 30.00 | 508.47   | 600.00|
| 2  | 1       | 15 (Paracetamol) | 2  | 20.00 | 33.90    | 40.00 |

**Resultado:**
- ✅ **1 registro en `Sales`** (una sola venta)
- ✅ **2 registros en `DetailSales`** (dos productos de esa venta)
- ✅ Ambos detalles apuntan a la misma venta (`sale_id = 1`)
- ✅ El total en `Sales` es la suma de ambos productos (640.00)

---

### ❌ ESTRUCTURA ACTUAL (Con el código temporal)

**Con el código actual que hace múltiples llamadas:**

**Tabla `Sales`:**
| id | date_creation | type_receipt | type_pay | total | provider_id |
|----|---------------|--------------|----------|-------|-------------|
| 1  | 2024-12-15    | B            | E        | 600.00| 5           |
| 2  | 2024-12-15    | B            | E        | 40.00 | 5           |

**Tabla `DetailSales`:**
| id | sale_id | product_id | quantity | price | subtotal | total |
|----|---------|------------|----------|-------|----------|-------|
| 1  | 1       | 10 (Bismutol) | 20     | 30.00 | 508.47   | 600.00|
| 2  | 2       | 15 (Paracetamol) | 2  | 20.00 | 33.90    | 40.00 |

**Resultado:**
- ❌ **2 registros en `Sales`** (dos ventas separadas)
- ✅ **2 registros en `DetailSales`** (uno por cada venta)
- ❌ Cada detalle apunta a una venta diferente
- ❌ No hay una venta única que agrupe ambos productos

---

## Comparación Visual

### ✅ CORRECTO (Una venta, múltiples productos):
```
Sales (id=1, total=640.00)
  ├── DetailSales (id=1, sale_id=1, product=Bismutol, total=600.00)
  └── DetailSales (id=2, sale_id=1, product=Paracetamol, total=40.00)
```

### ❌ ACTUAL (Múltiples ventas, un producto cada una):
```
Sales (id=1, total=600.00)
  └── DetailSales (id=1, sale_id=1, product=Bismutol, total=600.00)

Sales (id=2, total=40.00)
  └── DetailSales (id=2, sale_id=2, product=Paracetamol, total=40.00)
```

---

## ¿Por qué es importante la estructura correcta?

1. **Reportes y consultas**: Puedes consultar una venta completa con todos sus productos
2. **Facturación**: Una factura/boleta por venta, no múltiples
3. **Análisis de ventas**: Puedes analizar ventas completas, no productos individuales
4. **Cancelación**: Si cancelas una venta, cancelas todos sus productos juntos
5. **Integridad de datos**: Los datos están relacionados correctamente

---

## Solución: Modificar el Backend

Para lograr la estructura correcta, necesitas modificar el backend para que:

1. **Acepte múltiples productos en una sola llamada**
2. **Cree UNA venta (`Sales`)**
3. **Cree MÚLTIPLES detalles (`DetailSales`) asociados a esa venta**

Ver el archivo `BACKEND_MULTIPLE_PRODUCTS.md` para la implementación completa.

---

## Resumen

| Aspecto | Estructura Correcta | Estructura Actual (Temporal) |
|---------|---------------------|------------------------------|
| **Sales** | 1 registro | 2 registros (uno por producto) |
| **DetailSales** | 2 registros (ambos con `sale_id=1`) | 2 registros (cada uno con `sale_id` diferente) |
| **Total** | 640.00 (suma de ambos) | 600.00 y 40.00 (separados) |
| **Relación** | ✅ Correcta (1 venta → N detalles) | ❌ Incorrecta (N ventas → 1 detalle cada una) |

