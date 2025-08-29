import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import AuthContextProvider from './Context/AuthContext';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SinglePost from './components/SinglePost/SinglePost';

const router = createBrowserRouter([

  
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
       {
        path: "home",
        element: <ProtectedRoute> <Home /> </ProtectedRoute>
      },
      {
    path: "/post/:id",
    element: <SinglePost />,
  },

     {
        path: "profile",
        element: <ProtectedRoute> <Profile /> </ProtectedRoute>
      },
    ],
  },
]);

export default function App() {
  return (

<AuthContextProvider>
  <RouterProvider router={router} />
</AuthContextProvider>
  );
}
