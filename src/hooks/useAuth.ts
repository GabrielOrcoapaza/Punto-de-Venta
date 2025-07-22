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

  // Query para obtener usuario actual
  const { data: currentUserData, loading: currentUserLoading } = useQuery(GET_CURRENT_USER, {
    skip: !localStorage.getItem('authToken'),
  });

  // Efecto para manejar el usuario actual
  useEffect(() => {
    if (currentUserData?.me) {
      setUser(currentUserData.me);
    }
    setLoading(currentUserLoading);
  }, [currentUserData, currentUserLoading]);

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
      const { data } = await loginUser({
        variables: {
          input: credentials
        }
      });

      if (data.loginUser.success) {
        const { user, token } = data.loginUser;
        localStorage.setItem('authToken', token);
        setUser(user);
        return data.loginUser;
      } else {
        return data.loginUser;
      }
    } catch (error) {
      console.error('Error en login:', error);
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
    return !!user && !!localStorage.getItem('authToken');
  };

  return {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  };
}; 