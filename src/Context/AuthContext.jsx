import React, { createContext, useState } from "react";

// 1️⃣ إنشاء الـ Context
export const AuthContext = createContext();

// 2️⃣ Provider
export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);

  // دالة لحفظ التوكن
  const saveToken = (userToken) => {
    setToken(userToken);
    localStorage.setItem("userToken", userToken);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
}
