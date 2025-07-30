import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// URL de tu backend Django GraphQL (ajusta según tu configuración)
const httpLink = createHttpLink({
  uri: 'http://localhost:8006/graphql/', // Cambia el puerto si es diferente
});

// Link para agregar headers de autenticación si es necesario
const authLink = setContext((_, { headers }) => {
  // Obtener el token del localStorage si existe
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Crear el cliente Apollo
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});