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
      token
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
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      user {
        id
        username
        email
        firstName
        lastName
      }
      token
      success
      errors {
        field
        message
      }
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
        sale_price
        quantity
        laboratory
        alias
        createdAt
        updatedAt
      }
      success
      errors {
        field
        message
      }
    }
  }
`;
