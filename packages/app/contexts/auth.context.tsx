import { createContext, useCallback, useMemo, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  uuid: string;
  name: string;
  email: string;
  role: "standard" | "admin";
};

const initialState: {
  token: string | null;
  user: User | null;
} = {
  token: null,
  user: null,
};

const AuthContext = createContext<{
  token: string | null;
  user: User | null;
  login: () => void;
  logout: () => void;
}>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

const authReducer = (
  state: any,
  action: {
    type: string;
    user?: User | null;
    token?: string | null;
  }
) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
        token: action.token,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
      };
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = useCallback(() => {
    dispatch({
      type: "LOGIN",
      token: "dummy-auth-token",
      user: {
        uuid: "35b0f1e8-4530-4633-a8c4-65b5aef16b13",
        name: "Siege",
        email: "siege@gmail.com",
        role: "standard",
      },
    });
  }, []);

  const login = useCallback(async () => {
    console.log("LOGIN CALLED");
    await AsyncStorage.setItem("hurribrain-access-token", "dummy-auth-token");
    dispatch({
      type: "LOGIN",
      token: "dummy-auth-token",
      user: {
        uuid: "35b0f1e8-4530-4633-a8c4-65b5aef16b13",
        name: "Siege",
        email: "siege@gmail.com",
        role: "standard",
      },
    });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT", token: null, user: null });
  }, []);

  const value = useMemo(() => {
    return {
      token: state.token,
      user: state.user,
      register,
      login,
      logout,
    };
  }, [state.token, state.user, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
