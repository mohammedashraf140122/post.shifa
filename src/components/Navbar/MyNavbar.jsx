import { useContext } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export function MyNavbar() {
  const { Atoken, saveToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    saveToken(null);
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  // helper لتحديد إذا كان الرابط Active
  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Navbar fluid rounded className="bg-[#167D56] text-white">
      <NavbarBrand href="">
        <img
          src="/logo.png"
          className="mr-3 h-8 sm:h-10"
          alt="Shifa Hospital Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Shifa Hospital
        </span>
      </NavbarBrand>

      {/* زرار Logout */}
      <div className="flex md:order-2 gap-2">
        <Button
          onClick={handleLogout}
          className="bg-[#7eb4a1] text-[#0D4732] hover:bg-[#167D56] hover:text-white transition-transform duration-150 focus:outline-none focus:ring-0 active:scale-95 hover:shadow-md hover:border hover:border-[#A7D7C5]"
        >
          Logout
        </Button>
        <NavbarToggle />
      </div>

      {/* اللينكات + الأيقونات */}
      <NavbarCollapse>
        <NavbarLink
          as={Link}
          to="/home"
          className={`!text-white hover:!text-[#A7D7C5] ${
            isActive("/home") ? "!text-[#A7D7C5]" : ""
          }`}
        >
          <i className="fa fa-home fa-lg"></i>
        </NavbarLink>

        <NavbarLink
          as={Link}
          to="/profile"
          className={`!text-white hover:!text-[#A7D7C5] ${
            isActive("/profile") ? "!text-[#A7D7C5]" : ""
          }`}
        >
          <i className="fa-solid fa-user fa-lg"></i>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
