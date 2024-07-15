import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await fetch("http://localhost:3000/php/authenticate.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data);
      setAuth(data);
    };

    checkLoginStatus();
  }, []);

  const login = (user) => {
    setAuth({ isLoggedIn: true, user });
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3000/php/authenticate.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.message) {
        setAuth({ isLoggedIn: false, user: null });
      } else {
        console.error("Failed to log out:", data.error);
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
