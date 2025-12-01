# Solución: Modificar Backend para Aceptar Múltiples Productos

## Problema Actual

Tu `CreateSaleInput` actual solo acepta **un producto por venta**:

```python
class CreateSaleInput(graphene.InputObjectType):
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    typeReceipt = graphene.String(required=True)
    typePay = graphene.String(required=True)
    date = graphene.DateTime()
```

Esto significa que si el usuario selecciona múltiples productos en el frontend, solo se puede registrar uno.

## Solución Recomendada

Modifica el backend para que acepte **múltiples productos en una sola llamada**. Esto es más eficiente y correcto desde el punto de vista de negocio.

### 1. Nuevo Input Type para Detalles de Venta

```python
class DetailSaleInput(graphene.InputObjectType):
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    observation = graphene.String(required=False)
```

### 2. Input Type Modificado para la Venta

```python
class CreateSaleInput(graphene.InputObjectType):
    providerId = graphene.ID(required=False)  # Cliente (ClientSupplier) - opcional
    subsidiaryId = graphene.ID(required=False)  # Sucursal - opcional
    typeReceipt = graphene.String(required=True)  # 'B', 'F', 'T'
    typePay = graphene.String(required=True)  # 'E', 'Y', 'P'
    date = graphene.DateTime(required=False)  # Si no se envía, usar datetime.now()
    details = graphene.List(DetailSaleInput, required=True)  # Lista de productos
```

### 3. Mutación Corregida

```python
class CreateSale(graphene.Mutation):
    class Arguments:
        input = CreateSaleInput(required=True)

    sale = graphene.Field(SaleType)
    success = graphene.Boolean()
    errors = graphene.List(AuthErrorType)

    def mutate(self, info, input):
        try:
            from django.utils import timezone
            from decimal import Decimal
            
            # Validar que haya al menos un producto
            if not input.details or len(input.details) == 0:
                return CreateSale(
                    sale=None,
                    success=False,
                    errors=[AuthErrorType(message="Debe incluir al menos un producto")]
                )
            
            # Obtener el empleado actual (si tienes autenticación)
            employee = None
            if info.context.user.is_authenticated:
                try:
                    employee = info.context.user.employee  # Ajusta según tu modelo
                except:
                    pass
            
            # Obtener cliente si se proporciona
            provider = None
            if input.providerId:
                try:
                    provider = ClientSupplier.objects.get(id=input.providerId)
                except ClientSupplier.DoesNotExist:
                    return CreateSale(
                        sale=None,
                        success=False,
                        errors=[AuthErrorType(message=f"Cliente '{input.providerId}' no encontrado")]
                    )
            
            # Obtener sucursal si se proporciona
            subsidiary = None
            if input.subsidiaryId:
                try:
                    subsidiary = Subsidiary.objects.get(id=input.subsidiaryId)
                except Subsidiary.DoesNotExist:
                    return CreateSale(
                        sale=None,
                        success=False,
                        errors=[AuthErrorType(message=f"Sucursal '{input.subsidiaryId}' no encontrada")]
                    )
            
            # Calcular el total de la venta sumando todos los detalles
            total_sale = Decimal('0.00')
            detail_objects = []
            
            # Validar y preparar los detalles
            for detail_input in input.details:
                try:
                    product = Product.objects.get(id=detail_input.productId)
                except Product.DoesNotExist:
                    return CreateSale(
                        sale=None,
                        success=False,
                        errors=[AuthErrorType(message=f"Producto '{detail_input.productId}' no encontrado")]
                    )
                
                # Validar stock disponible (si aplica)
                if product.quantity < detail_input.quantity:
                    return CreateSale(
                        sale=None,
                        success=False,
                        errors=[AuthErrorType(
                            message=f"Stock insuficiente para el producto '{product.name}'. Disponible: {product.quantity}, Solicitado: {detail_input.quantity}"
                        )]
                    )
                
                total_sale += Decimal(str(detail_input.total))
                
                # Preparar objeto DetailSales (aún no guardado)
                detail_obj = DetailSales(
                    product=product,
                    quantity=detail_input.quantity,
                    price=detail_input.price,
                    subtotal=detail_input.subtotal,
                    total=detail_input.total,
                    observation=getattr(detail_input, 'observation', None)
                )
                detail_objects.append(detail_obj)
            
            # Crear la venta (Sales)
            sale = Sales.objects.create(
                date_creation=input.date if input.date else timezone.now(),
                employee_creation=employee,
                type_receipt=input.typeReceipt,
                type_pay=input.typePay,
                total=total_sale,
                provider=provider,
                subsidiary=subsidiary
            )
            
            # Crear los detalles de venta (DetailSales) y actualizar stock
            for detail_obj in detail_objects:
                detail_obj.sale = sale
                detail_obj.save()
                
                # Actualizar stock del producto
                detail_obj.product.quantity -= detail_obj.quantity
                detail_obj.product.save()
            
            return CreateSale(sale=sale, success=True, errors=None)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return CreateSale(
                sale=None,
                success=False,
                errors=[AuthErrorType(message=str(e))]
            )
```

## Cambios en el Frontend

Una vez que modifiques el backend, actualiza la mutación GraphQL en `mutations.ts`:

```typescript
export const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      sale {
        id
        total
        typeReceipt
        typePay
        date
        provider {
          id
          name
        }
        details {
          id
          product {
            id
            name
          }
          quantity
          price
          subtotal
          total
        }
      }
      success
      errors {
        message
      }
    }
  }
`;
```

Y actualiza el componente `salesCreate.tsx` para enviar todos los productos:

```typescript
const { data } = await createSale({
  variables: {
    input: {
      providerId: selectedClient?.id || null,
      typeReceipt: formData.type_receipt,
      typePay: formData.type_pay,
      date: saleDate,
      details: selectedProducts.map(sp => ({
        productId: sp.product.id,
        quantity: sp.quantity,
        price: sp.unitPrice,
        subtotal: sp.totalPrice / (1 + sp.igvPercentage / 100),
        total: sp.totalPrice,
      })),
    }
  }
});
```

## Ventajas de esta Solución

1. ✅ **Una sola transacción**: Todos los productos se crean en una sola operación
2. ✅ **Consistencia de datos**: La venta y sus detalles se crean juntos
3. ✅ **Mejor rendimiento**: Una sola llamada al backend en lugar de múltiples
4. ✅ **Manejo de errores mejorado**: Si falla un producto, toda la venta falla (transacción atómica)
5. ✅ **Cálculo correcto del total**: El backend calcula el total sumando todos los detalles

## Nota Importante

Si prefieres mantener la estructura actual (un producto por llamada), necesitarías:
- Hacer múltiples llamadas desde el frontend (una por producto)
- Manejar el caso donde algunas llamadas fallan y otras no
- Agrupar los productos en una sola venta de alguna manera

**Recomendación**: Modifica el backend para aceptar múltiples productos. Es la solución más robusta y correcta.

