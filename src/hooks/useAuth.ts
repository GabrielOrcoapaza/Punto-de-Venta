import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { REGISTER_USER, LOGIN_USER, LOGOUT_USER, GET_CURRENT_USER } from '../graphql/mutations';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User | null;
  success: boolean;
  errors?: Array<{ field: string; message: string }>;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mutaciones
  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const [logoutUser] = useMutation(LOGOUT_USER);

  // Query para obtener usuario actual
  const { data: currentUserData, loading: currentUserLoading, refetch } = useQuery(GET_CURRENT_USER, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("✅ Usuario actual obtenido:", data);
      if (data?.me) {
        setUser(data.me);
      } else {
        setUser(null);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.log("🚨 No hay usuario autenticado:", error);
      setUser(null);
      setLoading(false);
    }
  });

  // Función para registrar usuario
  const register = async (userData: {
    username: string;
    email: string;
    password1: string;
    password2: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> => {
    try {
      const { data } = await registerUser({
        variables: {
          input: userData
        }
      });

      if (data.registerUser.success) {
        const { user } = data.registerUser;
        setUser(user);
        await refetch();
        return { user, success: true };
      } else {
        return { user: null, success: false, errors: data.registerUser.errors };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      console.log("🔐 Iniciando proceso de login");
      
      const { data } = await loginUser({
        variables: {
          input: credentials
        }
      });

      console.log("📡 Respuesta del servidor:", data);

      if (data.loginUser.success) {
        const { user } = data.loginUser;
        console.log("✅ Login exitoso, usuario:", user);
        setUser(user);
        
        // Refrescar para confirmar sesión
        await refetch();
        
        return { user, success: true };
      } else {
        console.log("❌ Login fallido:", data.loginUser.errors);
        return { user: null, success: false, errors: data.loginUser.errors };
      }
    } catch (error) {
      console.error('🚨 Error en login:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      console.log("🚪 Cerrando sesión...");
      await logoutUser();
      setUser(null);
      console.log("✅ Sesión cerrada");
    } catch (error) {
      console.error('Error en logout:', error);
      setUser(null);
    }
  };

  // Función para verificar si está autenticado
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    user,
    loading: loading || currentUserLoading,
    register,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  };
};