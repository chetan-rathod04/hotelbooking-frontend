import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (user) setAuthUser(user);
  }, []);

  const login = (userData) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    setAuthUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
