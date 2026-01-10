import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { client } from '../apollo/client';
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

  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const [logoutUser] = useMutation(LOGOUT_USER);

  // 🔵 Cargar TOKEN desde Electron PRELOAD
  useEffect(() => {
    const init = async () => {
      const token = await window.electronAPI?.loadToken();
      if (!token) {
        setLoading(false);
        return;
      }
      await refetch();
      setLoading(false);
    };

    init();
  }, []);

  // 🔵 Consultar usuario actual
  const { refetch, loading: currentUserLoading } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("✅ Usuario actual obtenido:", data);
      setUser(data?.me ?? null);
      setLoading(false);
    },
    onError: () => {
      console.log("❌ No autenticado");
      setUser(null);
      setLoading(false);
    }
  });

  // 🟢 REGISTRO
  const register = async (userData:any): Promise<AuthResponse> => {
    const { data } = await registerUser({ variables: { input: userData }});
    if (data.registerUser.success) {
      setUser(data.registerUser.user);
      await refetch();
      return { user: data.registerUser.user, success: true };
    }
    return { user: null, success: false, errors: data.registerUser.errors };
  };

  // 🟢 LOGIN
  const login = async (username: string, password: string) => {
    try {
      console.log('🔐 Intentando login con:', { username });
      
      const { data } = await loginUser({
        variables: { username, password },
      });

      console.log('📦 Respuesta del servidor:', data);

      if (data?.tokenAuth?.token) {
        const token = data.tokenAuth.token;
        console.log('✅ Token recibido:', token.substring(0, 20) + '...');
        
        // 🔐 GUARDAR TOKEN EN ELECTRON
        await window.electronAPI.saveToken(token);
        console.log('💾 Token guardado exitosamente');
        
        // IMPORTANTE: Usar clearStore en lugar de resetStore para evitar
        // condiciones de carrera con las queries activas.
        // clearStore borra la caché pero no refetchea automáticamente.
        await client.clearStore();
        
        console.log('🔄 Obteniendo usuario...');
        
        // Usamos refetch() del hook para obtener el usuario y actualizar el estado
        // Esto asegura que el estado del hook y la caché de Apollo estén sincronizados
        const { data: userData } = await refetch();

        console.log('📦 userData:', userData);

        if (userData?.me) {
          // El setUser se debería llamar automáticamente por el onCompleted del useQuery,
          // pero lo hacemos aquí explícitamente para asegurar la respuesta inmediata
          setUser(userData.me);
          return { success: true, user: userData.me };
        } else {
          return { 
            success: false, 
            errors: ['No se pudo obtener la información del usuario'] 
          };
        }
      }

      return { success: false, errors: ['No se recibió token'] };
      
    } catch (error: any) {
      console.error('🚨 Error en login:', error);
      return { 
        success: false, 
        errors: [error.message || 'Error desconocido'] 
      };
    }
  };

  // 🔴 LOGOUT
  const logout = async () => {
    try {
      setUser(null);
      await window.electronAPI.clearToken();
      await window.electronAPI.clearRefreshToken();
      // Limpiar completamente el store de Apollo
      await client.clearStore();
      console.log("🚪 Sesión cerrada y store limpiado");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return {
    user,
    loading: loading || currentUserLoading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
