# Instrucciones para Implementar la Estructura Correcta

## ✅ Cambios Realizados en el Frontend

El frontend ya está actualizado y listo para enviar múltiples productos en una sola llamada.

### Archivos Modificados:
1. ✅ `src/graphql/mutations.ts` - Mutación actualizada para aceptar múltiples productos
2. ✅ `src/modules/sales/salesCreate.tsx` - Componente actualizado para enviar todos los productos

## 🔧 Pasos para Implementar en el Backend

### Paso 1: Modificar los Input Types

Reemplaza tu `CreateSaleInput` actual con el nuevo que acepta múltiples productos:

```python
# ELIMINA esto:
class CreateSaleInput(graphene.InputObjectType):
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    typeReceipt = graphene.String(required=True)
    typePay = graphene.String(required=True)
    date = graphene.DateTime()

# REEMPLAZA con esto:
class DetailSaleInput(graphene.InputObjectType):
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    observation = graphene.String(required=False)

class CreateSaleInput(graphene.InputObjectType):
    providerId = graphene.ID(required=False)
    subsidiaryId = graphene.ID(required=False)
    typeReceipt = graphene.String(required=True)
    typePay = graphene.String(required=True)
    date = graphene.DateTime(required=False)
    details = graphene.List(DetailSaleInput, required=True)  # Lista de productos
```

### Paso 2: Reemplazar la Mutación CreateSale

Copia el código completo de `BACKEND_CODIGO_COMPLETO.py` y reemplaza tu mutación `CreateSale` actual.

**Puntos clave de la nueva mutación:**
- ✅ Crea **UNA SOLA venta** (`Sales`)
- ✅ Crea **MÚLTIPLES detalles** (`DetailSales`) asociados a esa venta
- ✅ Calcula el total sumando todos los productos
- ✅ Valida stock disponible
- ✅ Actualiza el stock de cada producto

### Paso 3: Verificar los Types

Asegúrate de tener estos types en tu schema:

```python
class SaleType(DjangoObjectType):
    class Meta:
        model = Sales
        fields = '__all__'
    
    details = graphene.List('DetailSaleType')
    
    def resolve_details(self, info):
        return self.detailsales_set.all()

class DetailSaleType(DjangoObjectType):
    class Meta:
        model = DetailSales
        fields = '__all__'
```

### Paso 4: Probar

1. Inicia tu servidor Django
2. En el frontend, agrega múltiples productos (ej: Bismutol y Paracetamol)
3. Haz clic en "Pagar venta"
4. Verifica en la base de datos:
   - ✅ **1 registro** en `Sales` con el total de ambos productos
   - ✅ **2 registros** en `DetailSales`, ambos con el mismo `sale_id`

## 📊 Resultado Esperado

### Antes (Incorrecto):
```
Sales: 2 registros (una venta por producto)
DetailSales: 2 registros (cada uno en una venta diferente)
```

### Después (Correcto):
```
Sales: 1 registro (una sola venta)
DetailSales: 2 registros (ambos en la misma venta)
```

## 🔍 Verificación en la Base de Datos

Después de crear una venta con 2 productos, ejecuta:

```sql
-- Ver la venta creada
SELECT * FROM Sales WHERE id = [último_id];

-- Ver los detalles de esa venta
SELECT * FROM DetailSales WHERE sale_id = [último_id];
```

Deberías ver:
- 1 venta con `total = suma de ambos productos`
- 2 detalles, ambos con el mismo `sale_id`

## 📝 Archivos de Referencia

- `BACKEND_CODIGO_COMPLETO.py` - Código completo listo para copiar
- `BACKEND_MULTIPLE_PRODUCTS.md` - Explicación detallada
- `EXPLICACION_ESTRUCTURA_DB.md` - Explicación de la estructura de datos

## ⚠️ Nota Importante

Una vez que implementes estos cambios en el backend, el frontend funcionará correctamente y creará la estructura correcta en la base de datos.

