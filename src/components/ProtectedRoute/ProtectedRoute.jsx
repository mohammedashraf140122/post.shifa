import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import Login from './../Login/Login';
import Home from './../Home/Home';
import Profile from './../Profile/Profile';
import { AuthContext } from './../../Context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { Atoken } = useContext(AuthContext);

  // التحقق من التوكن
  const token = Atoken || localStorage.getItem("userToken");

  if (!token) {
    // لو مفيش توكن، رجعه على Login
    return <Navigate to="/login" replace />;
  }

  // لو موجود توكن، خلي الأطفال (الصفحة) يظهروا
  return children;
}