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
    if (window.electronAPI) {
      window.electronAPI.loadToken().then((token: string | null) => {
        if (token) {
          document.cookie = `sessionid=${token}; path=/;`;
        }
      });
    }
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
  const login = async (credentials: { username: string; password: string; }): Promise<AuthResponse> => {
    console.log("🔐 Iniciando login…");

    const { data } = await loginUser({
      variables: { input: credentials },
      fetchPolicy: "no-cache"
    });

    console.log("📡 Respuesta:", data);

    if (data.loginUser.success) {
      const user = data.loginUser.user;

      console.log("🟢 Login OK:", user);

      setUser(user);

      // ⬅️ OBTENER EL TOKEN (sessionid) DEL RESPONSE
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionid="));

      if (sessionCookie) {
        const token = sessionCookie.replace("sessionid=", "");
        // ⬅️ GUARDAR TOKEN EN ELECTRON
        if (window.electronAPI) {
          window.electronAPI.saveToken(token);
        }
      }

      await refetch();
      return { user, success: true };
    }

    return { user: null, success: false, errors: data.loginUser.errors };
  };

  // 🔴 LOGOUT
  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);

    // 🔴 ELIMINAR TOKEN GUARDADO EN ELECTRON
    if (window.electronAPI) {
      window.electronAPI.clearToken();
    }

    console.log("🚪 Sesión cerrada");
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
