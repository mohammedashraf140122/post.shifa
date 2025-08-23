import { useContext } from "react";
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export function MyNavbar() {
  const { Atoken, saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // مسح التوكن من الـ state و localStorage
    saveToken(null);
    localStorage.removeItem("userToken");
    // إعادة التوجيه للصفحة Login
    navigate("/login");
  };

  return (
    <Navbar fluid rounded className="bg-[#167D56] text-white">
      <NavbarBrand href="">
        <img src="/logo.png" className="mr-3 h-8 sm:h-10" alt="Shifa Hospital Logo" />
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
        <Link to="/home">
          <NavbarLink className="!text-white hover:!text-[#A7D7C5]"><i className="fa fa-home fa-lg"></i></NavbarLink>
        </Link>
        <Link to="/profile">
          <NavbarLink className="!text-white hover:!text-[#A7D7C5]"><i className="fa-solid fa-user fa-lg"></i></NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}
