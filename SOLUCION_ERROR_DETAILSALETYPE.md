# Solución al Error: DetailSaleType doesn't look like a module path

## 🔴 Problema

El error ocurre porque `SaleType` está intentando usar `DetailSaleType` como referencia de string, pero Graphene no puede resolverla.

## ✅ Solución 1: Definir DetailSaleType ANTES de SaleType

**Orden correcto en tu archivo de types:**

```python
# PRIMERO define DetailSaleType
class DetailSaleType(DjangoObjectType):
    """Type para el detalle de venta (DetailSales)"""
    class Meta:
        model = DetailSales
        fields = '__all__'


# DESPUÉS define SaleType (que usa DetailSaleType)
class SaleType(DjangoObjectType):
    """Type para la venta (Sales)"""
    class Meta:
        model = Sales
        fields = '__all__'
    
    # Campo para obtener los detalles de la venta
    details = graphene.List(DetailSaleType)  # ← Sin comillas, ya está definido
    
    def resolve_details(self, info):
        """Obtener todos los detalles (productos) de esta venta"""
        return self.detailsales_set.all()
```

## ✅ Solución 2: Importar DetailSaleType directamente

Si `DetailSaleType` está en otro archivo, impórtalo:

```python
# En tu archivo donde defines SaleType
from .types import DetailSaleType  # o la ruta correcta

class SaleType(DjangoObjectType):
    class Meta:
        model = Sales
        fields = '__all__'
    
    details = graphene.List(DetailSaleType)  # ← Sin comillas, importado directamente
```

## ✅ Solución 3: Usar referencia completa del módulo

Si están en módulos diferentes, usa la ruta completa:

```python
class SaleType(DjangoObjectType):
    class Meta:
        model = Sales
        fields = '__all__'
    
    # Usa la ruta completa del módulo
    details = graphene.List('tu_app.types.DetailSaleType')
```

## 📝 Código Corregido Completo

```python
from graphene_django import DjangoObjectType
import graphene
from .models import Sales, DetailSales

# 1. PRIMERO define DetailSaleType
class DetailSaleType(DjangoObjectType):
    """Type para el detalle de venta (DetailSales)"""
    class Meta:
        model = DetailSales
        fields = '__all__'


# 2. DESPUÉS define SaleType (puede usar DetailSaleType sin comillas)
class SaleType(DjangoObjectType):
    """Type para la venta (Sales)"""
    class Meta:
        model = Sales
        fields = '__all__'
    
    # Sin comillas porque DetailSaleType ya está definido arriba
    details = graphene.List(DetailSaleType)
    
    def resolve_details(self, info):
        """Obtener todos los detalles (productos) de esta venta"""
        return self.detailsales_set.all()
```

## ⚠️ Importante

- Si ambos types están en el **mismo archivo**: Define `DetailSaleType` primero, luego `SaleType`
- Si están en **archivos diferentes**: Importa `DetailSaleType` directamente
- **Nunca uses comillas** si el type ya está definido o importado en el mismo archivo

## 🔍 Verificación

Después de corregir, ejecuta:

```bash
python manage.py runserver
```

No debería aparecer el error `DetailSaleType doesn't look like a module path`.



