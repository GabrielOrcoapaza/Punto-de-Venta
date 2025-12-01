# ============================================================================
# CÓDIGO COMPLETO DEL BACKEND PARA ESTRUCTURA CORRECTA
# ============================================================================
# Este archivo contiene todo el código que necesitas implementar en tu backend
# para que acepte múltiples productos en una sola venta.
# ============================================================================

# 1. INPUT TYPES (Agregar a tu archivo de types/inputs)

class DetailSaleInput(graphene.InputObjectType):
    """Input para un producto individual en la venta"""
    productId = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    price = graphene.Decimal(required=True)
    subtotal = graphene.Decimal(required=True)
    total = graphene.Decimal(required=True)
    observation = graphene.String(required=False)


class CreateSaleInput(graphene.InputObjectType):
    """Input para crear una venta con múltiples productos"""
    providerId = graphene.ID(required=False)  # Cliente (ClientSupplier) - opcional
    subsidiaryId = graphene.ID(required=False)  # Sucursal - opcional
    typeReceipt = graphene.String(required=True)  # 'B', 'F', 'T'
    typePay = graphene.String(required=True)  # 'E', 'Y', 'P'
    date = graphene.DateTime(required=False)  # Si no se envía, usar datetime.now()
    details = graphene.List(DetailSaleInput, required=True)  # Lista de productos


# 2. MUTACIÓN (Reemplazar tu CreateSale actual)

class CreateSale(graphene.Mutation):
    """Mutación para crear una venta con múltiples productos"""
    
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
                    # Ajusta esto según tu modelo de usuario/empleado
                    employee = info.context.user.employee
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
                    from hrmn.models import Subsidiary
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
            
            # Crear la venta (Sales) - UNA SOLA VENTA
            sale = Sales.objects.create(
                date_creation=input.date if input.date else timezone.now(),
                employee_creation=employee,
                type_receipt=input.typeReceipt,
                type_pay=input.typePay,
                total=total_sale,  # Total de todos los productos
                provider=provider,
                subsidiary=subsidiary
            )
            
            # Crear los detalles de venta (DetailSales) - MÚLTIPLES DETALLES
            # Todos asociados a la misma venta
            for detail_obj in detail_objects:
                detail_obj.sale = sale  # Asociar a la misma venta
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


# 3. TYPES (Si no los tienes, agrega estos)
# IMPORTANTE: Define DetailSaleType PRIMERO, luego SaleType

class DetailSaleType(DjangoObjectType):
    """Type para el detalle de venta (DetailSales)"""
    class Meta:
        model = DetailSales
        fields = '__all__'


class SaleType(DjangoObjectType):
    """Type para la venta (Sales)"""
    class Meta:
        model = Sales
        fields = '__all__'
    
    # Campo para obtener los detalles de la venta
    # Sin comillas porque DetailSaleType ya está definido arriba
    details = graphene.List(DetailSaleType)
    
    def resolve_details(self, info):
        """Obtener todos los detalles (productos) de esta venta"""
        return self.detailsales_set.all()


# 4. REGISTRAR EN EL SCHEMA

# En tu archivo schema.py, asegúrate de tener:

class Mutation(graphene.ObjectType):
    # ... tus otras mutaciones ...
    create_sale = CreateSale.Field()


class Query(graphene.ObjectType):
    # ... tus otras queries ...
    # (tu SaleQuery ya está bien)


# ============================================================================
# RESULTADO ESPERADO EN LA BASE DE DATOS
# ============================================================================
# 
# Ejemplo: Venta con Bismutol y Paracetamol
#
# Tabla Sales:
# | id | date_creation | type_receipt | type_pay | total  | provider_id |
# |----|---------------|--------------|----------|--------|-------------|
# | 1  | 2024-12-15    | B            | E        | 640.00 | 5           |
#
# Tabla DetailSales:
# | id | sale_id | product_id | quantity | price | subtotal | total  |
# |----|---------|------------|----------|-------|----------|--------|
# | 1  | 1       | 10         | 20       | 30.00 | 508.47   | 600.00 |
# | 2  | 1       | 15         | 2        | 20.00 | 33.90    | 40.00  |
#
# ✅ 1 registro en Sales (una sola venta)
# ✅ 2 registros en DetailSales (ambos con sale_id=1)
# ✅ Total en Sales = suma de ambos productos (640.00)
#
# ============================================================================

