import { useState, useEffect } from 'react';
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
  user: User;
  token: string;
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

  // Query para obtener usuario actual - solo se ejecuta si hay token
  const { data: currentUserData, loading: currentUserLoading, error: currentUserError } = useQuery(GET_CURRENT_USER, {
    skip: !localStorage.getItem('authToken'),
    errorPolicy: 'all',
    onError: (error) => {
      console.log("🚨 Error en GET_CURRENT_USER:", error);
    }
  });

  // Efecto para inicializar el estado de autenticación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      console.log("🔍 Token encontrado, verificando validez...");
      // Si hay token, intentar verificar el usuario
      // Si no hay datos del usuario, mantener el token pero no establecer usuario
    } else {
      console.log("🔍 No hay token, usuario no autenticado");
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // Efecto para manejar los datos del usuario actual
  useEffect(() => {
    if (currentUserData?.me) {
      console.log("✅ Usuario encontrado en caché:", currentUserData.me);
      setUser(currentUserData.me);
    } else if (currentUserError) {
      console.log("❌ Error al verificar usuario con token:", currentUserError);
      
      // Verificar si es un error de autenticación específico de Django
      const isAuthError = currentUserError.graphQLErrors?.some(err => 
        err.extensions?.code === 'UNAUTHENTICATED' || 
        err.message?.includes('authentication') ||
        err.message?.includes('token') ||
        err.message?.includes('unauthorized') ||
        err.message?.includes('permission') ||
        err.message?.includes('login')
      );
      
      if (isAuthError) {
        console.log("🚫 Token inválido o expirado, limpiando localStorage");
        localStorage.removeItem('authToken');
        setUser(null);
      } else {
        console.log("⚠️ Error de red o servidor, manteniendo token");
        // No eliminar el token si es un error de red o servidor
      }
    }
  }, [currentUserData, currentUserError]);

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
        const { user, token } = data.registerUser;
        localStorage.setItem('authToken', token);
        setUser(user);
        return data.registerUser;
      } else {
        return data.registerUser;
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
      console.log("🔐 Iniciando proceso de login con credenciales:", credentials);
      
      const { data } = await loginUser({
        variables: {
          input: credentials
        }
      });

      console.log("📡 Respuesta del servidor GraphQL:", data);

      if (data.loginUser.success) {
        const { user, token } = data.loginUser;
        console.log("✅ Login exitoso, guardando token y usuario:", { user, token });
        localStorage.setItem('authToken', token);
        setUser(user);
        return data.loginUser;
      } else {
        console.log("❌ Login fallido, errores:", data.loginUser.errors);
        return data.loginUser;
      }
    } catch (error) {
      console.error('🚨 Error en login:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  // Función para verificar si está autenticado
  const isAuthenticated = (): boolean => {
    const hasUser = !!user;
    const hasToken = !!localStorage.getItem('authToken');
    console.log("🔍 Verificando autenticación:", { hasUser, hasToken, user });
    
    // Si hay token, considerar autenticado (el servidor validará si es válido)
    // Si no hay token, definitivamente no está autenticado
    return hasToken;
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