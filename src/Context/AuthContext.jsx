import React, { createContext, useState } from "react";

// 1️⃣ إنشاء الـ Context
export const AuthContext = createContext();

// 2️⃣ Provider
export default function AuthContextProvider({ children }) {
  const [Atoken, setAToken] = useState(null);

  // دالة لحفظ التوكن
  function saveToken(userToken) {
    setAToken(userToken);
  }

  return (
    // 3️⃣ تمرير القيم للمكونات الأبناء
    <AuthContext.Provider value={{ Atoken, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
}
