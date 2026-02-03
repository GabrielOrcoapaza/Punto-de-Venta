import { gql } from '@apollo/client';

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