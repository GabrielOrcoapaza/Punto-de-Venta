# Correcciones necesarias para la mutación CreateSale

## Problemas identificados:

1. **Campos incorrectos**: La mutación intenta crear `Sales` con campos que no existen en el modelo
2. **Estructura incorrecta**: Los productos deben crearse en `DetailSales`, no en `Sales`
3. **Falta soporte para múltiples productos**: La mutación debe crear una venta con varios productos

## Solución: Implementación correcta del backend

### 1. Input Type para GraphQL (en tu schema.py o types.py)

```python
class DetailSaleInput(graphene.InputObjectType):
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    observation = graphene.String(required=False)

class CreateSaleInput(graphene.InputObjectType):
    providerId = graphene.ID(required=False)  # Cliente (ClientSupplier)
    subsidiaryId = graphene.ID(required=False)  # Sucursal
    typeReceipt = graphene.String(required=True)  # 'B', 'F', 'T'
    typePay = graphene.String(required=True)  # 'E', 'Y', 'P'
    date = graphene.DateTime(required=False)  # Si no se envía, usar datetime.now()
    details = graphene.List(DetailSaleInput, required=True)  # Lista de productos
```

### 2. Mutación corregida

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
                    employee = info.context.user.employee  # Ajusta según tu modelo de usuario
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
                    observation=detail_input.observation if hasattr(detail_input, 'observation') else None
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

### 3. Registrar la mutación en tu schema

```python
class Mutation(graphene.ObjectType):
    # ... otras mutaciones ...
    create_sale = CreateSale.Field()
```

### 4. Type para Sale (si no lo tienes)

```python
class SaleType(DjangoObjectType):
    class Meta:
        model = Sales
        fields = '__all__'
    
    # Campos calculados o relacionados
    details = graphene.List('DetailSaleType')
    
    def resolve_details(self, info):
        return self.detailsales_set.all()

class DetailSaleType(DjangoObjectType):
    class Meta:
        model = DetailSales
        fields = '__all__'
```

## Cambios principales:

1. ✅ **Separación correcta**: `Sales` contiene la información de la venta, `DetailSales` contiene los productos
2. ✅ **Soporte para múltiples productos**: El input acepta una lista de `DetailSaleInput`
3. ✅ **Nombres de campos correctos**: Usa `type_receipt`, `type_pay`, `date_creation` según el modelo
4. ✅ **Validaciones**: Verifica existencia de productos, stock disponible, etc.
5. ✅ **Actualización de stock**: Reduce el stock cuando se crea la venta
6. ✅ **Cálculo de total**: Suma automáticamente el total de todos los detalles

## Frontend: La mutación GraphQL que necesitas

Agrega esto a tu archivo `mutations.ts`:

```typescript
export const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      sale {
        id
        total
        typeReceipt
        typePay
        dateCreation
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

