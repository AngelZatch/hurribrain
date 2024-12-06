import { createContext, useCallback, useMemo, useReducer } from "react";

const AuthContext = createContext<{
  token: string | null;
  logout: () => void;
}>({
  token: null,
  logout: () => {},
});

const authReducer = (
  state: any,
  action: {
    type: string;
    token?: string | null;
  }
) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.token,
      };

    case "LOGOUT":
      return {
        ...state,
        token: null,
      };
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
  });

  const register = useCallback(() => {
    dispatch({ type: "LOGIN", token: "dummy-auth-token" });
  }, []);

  const login = useCallback(() => {
    dispatch({ type: "LOGIN", token: "dummy-auth-token" });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const value = useMemo(() => {
    return {
      token: null,
      register,
      login,
      logout,
    };
  }, [state.token, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
