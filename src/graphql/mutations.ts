import { gql } from '@apollo/client';

// Mutación para registrar un nuevo usuario
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user {
        id
        username
        email
        firstName
        lastName
      }
      
      success
      errors {
        field
        message
      }
    }
  }
`;

// Mutación para iniciar sesión
export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      payload
      refreshExpiresIn
    }
  }
`;

// Mutación para cerrar sesión
export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;

// Query para obtener información del usuario actual
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      firstName
      lastName
    }
  }
`;

// Mutación para crear un nuevo producto
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        code
        price
        quantity
        laboratory
        alias
      }
      success
      errors {
        field
        message
      }
    }
  }
`;

// Query para obtener todos los productos
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      code
      price
      quantity
      laboratory
      alias
    }
  }
`;

// Query para buscar un producto por código de barras
export const GET_PRODUCT_BY_CODE = gql`
  query GetProductByCode($code: String!) {
    productByCode(code: $code) {
      id
      name
      code
      price
      quantity
      laboratory
      alias
    }
  }
`;


// Mutación para actualizar un producto
export const UPDATE_PRODUCTS = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      product {
        id
        name
        code
        price
        quantity
        laboratory
        alias
      }
      success
      errors {
        message
      }
    }
  }
`;


// Mutación para eliminar un producto
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;


// Mutación para crear una nueva compra
export const CREATE_PURCHASE = gql`
  mutation CreatePurchase($input: CreatePurchaseInput!) {
    createPurchase(input: $input) {
      purchase {
        id
        product {
          id
          name
        }
        price
        quantity
        subtotal
        total
        typeReceipt
        typePay
        date
      }
      success
      errors {
        message
      }
    }
  }
`; 

// Query para obtener todos las compras
export const GET_PURCHASE = gql`
  query GetPurchase {
    purchases {
      id
        product {
          id
          name
        }
        price
        quantity
        subtotal
        total
        typeReceipt
        typePay
        date
    }
  }
`; 

export const UPDATE_PURCHASE = gql`
  mutation UpdatePurchase($id: ID!, $input: UpdatePurchaseInput!) {
    updatePurchase(id: $id, input: $input) {
      purchase {
        id
        product { id name }
        price
        quantitys
        subtotal
        total
        typeReceipt
        typePay
        date
      }
      success
      errors { message }
    }
  }
`;

// Mutación para crear un nuevo cliente/proveedor
export const CREATE_CLIENTSUPPLIER = gql`
  mutation CreateClientSupplier($input: CreateClientSupplierInput!) {
    createClientSupplier(input: $input) {
      clientSupplier {
        id
        name
        address
        phone
        mail
        nDocument
        typeDocument
        typePerson
      }
      success
      errors {
        message
      }
    }
  }
`;


// Query para obtener todos los clientes/proveedores
export const GET_CLIENTSUPPLIER = gql`
  query GetClientSuppliers {
    clientSuppliers {
      id
      name
      address
      phone
      mail
      nDocument
      typeDocument 
      typePerson
    }
  }
`;

// Mutación para actualizar un cliente/proveedor
export const UPDATE_CLIENTSUPPLIER = gql`
  mutation UpdateClientSupplier($id: ID!, $input: UpdateClientSupplierInput!) {
    updateClientSupplier(id: $id, input: $input) {
      clientSupplier {
        id
        name
        address
        phone
        mail
        nDocument
        typeDocument
        typePerson
      }
      success
      errors {
        message
      }
    }
  }
`;

// Mutación para eliminar un cliente/proveedor
export const DELETE_CLIENTSUPPLIER = gql`
  mutation DeleteClientSupplier($id: ID!) {
    deleteClientSupplier(id: $id) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

// Mutación para crear una nueva venta (con múltiples productos)
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

// Query para obtener todas las ventas
export const GET_SALES = gql`
  query GetSales {
    sales {
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
  }
`;

export const OPEN_CASH = gql`
  mutation OpenCash($input: OpenCashInput!) {
    openCash(input: $input) {
      cash {
        id
        status
        initialAmount
        dateOpen
        subsidiary { id }
      }
      success
      errors { messages }
    }
  }
`;

export const CLOSE_CASH = gql`
  mutation CloseCash($input: CloseCashInput!) {
    closeCash(input: $input) {
      cash {
        id
        status
        closingAmount
        difference
        dateClose
      }
      summary {
        byMethod { method total }
        totalExpected
        totalCounted
        difference
      }
      success
      errors { messages }
    }
  }
`;

export const CURRENT_CASH = gql`
  query CurrentCash($subsidiaryId: ID!) {
    currentCash(subsidiaryId: $subsidiaryId) {
      id
      status
      initialAmount
      dateOpen
    }
  }
`;

export const CASH_PAYMENTS = gql`
  query CashPayments($cashId: ID!) {
    cashPayments(cashId: $cashId) {
      id
      paymentType
      paymentMethod
      status
      paymentDate
      totalAmount
      paidAmount
      referenceNumber
      notes
    }
  }
`;

export const CREATE_EXPENSE_PAYMENT = gql`
  mutation CreateExpensePayment($input: CreateExpensePaymentInput!) {
    createExpensePayment(input: $input) {
      payment {
        id
        paymentType
        paymentMethod
        status
        paymentDate
        totalAmount
        paidAmount
      }
      success
      errors { messages }
    }
  }
`;

export const CASH_SUMMARY = gql`
  query CashSummary($cashId: ID!) {
    cashSummary(cashId: $cashId) {
      byMethod { method total }
      totalExpected
      totalCounted
      difference
    }
  }
`;

export const GET_CASHES = gql`
  query GetCashes {
    cashes {
      id
      name
      status
      initialAmount
      closingAmount
      difference
      dateOpen
      dateClose
      subsidiary { id }
    }
  }
`;
