import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// URL de tu backend Django GraphQL (ajusta según tu configuración)
const httpLink = createHttpLink({
  uri: 'http://localhost:8006/graphql/', // Cambia el puerto si es diferente
  credentials: 'include', // ⬅️ ESTO ES LO MÁS IMPORTANTE
});


// Crear el cliente Apollo
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only', // Opcional: evita cache de autenticación
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    },
  },
});
