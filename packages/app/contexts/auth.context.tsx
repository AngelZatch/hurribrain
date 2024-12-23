import { createContext, useContext } from "react";
import { useStorageState } from "@/hooks/useStorageState";

export type User = {
  uuid: string;
  name: string;
  email: string;
  role: "standard" | "admin";
};

const AuthContext = createContext<{
  isLoading: boolean;
  user: string | null;
  login: () => void;
  logout: () => void;
}>({
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  const value = useContext(AuthContext);

  console.log("AUTH CONTEXT VALUE", value);

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
        login: () => {
          // TODO: Ping the login API to authenticate
          setUser("dummy-auth-token");
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
