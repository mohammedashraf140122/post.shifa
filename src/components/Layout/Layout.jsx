import React from 'react'
import { Outlet } from 'react-router-dom';
import { MyNavbar } from './../Navbar/MyNavbar';
export default function Layout() {
  return (
    <>

    <MyNavbar />
    
    <Outlet />

    
    </>
  )
}
