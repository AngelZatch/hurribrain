import { createContext, useContext } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { useLogin } from "@/api/auth.api";

export type User = {
  uuid: string;
  name: string;
  email: string;
  role: "standard" | "admin";
};

const AuthContext = createContext<{
  isLoading: boolean;
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
}>({
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  const value = useContext(AuthContext);
  return value;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [[isLoading, user], setUser] = useStorageState(
    "hurribrain-access-token"
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: (token) => {
          setUser(token);
        },
        logout: () => {
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
