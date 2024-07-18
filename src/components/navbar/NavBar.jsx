import { useContext } from "react";
import { NavLink } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import ThemeToggle from "../themeToggle/ThemeToggle";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
  const { auth, logout } = useContext(AuthContext);

  // console.log(auth);

  return (
    <Navbar expand="lg" className=" bg-[var(--navbarBg)]">
      <Container>
        <Navbar.Brand href="#" className="flex gap-2 text-[var(--textColor)]">
          <img
            src="/planet-earth.png"
            width={30}
            height={20}
            className="object-cover"
          />
          Travel Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto items-center">
            <NavLink
              to={`/`}
              className={({ isActive }) =>
                isActive ? "px-2 py-1 border-b-2 border-current" : "px-2 py-1 "
              }
            >
              Home
            </NavLink>
            <NavLink
              to={`/explore`}
              className={({ isActive }) =>
                isActive ? "px-2 py-1 border-b-2 border-current" : "px-2 py-1 "
              }
            >
              Explore
            </NavLink>
            {auth.isLoggedIn && (
              <NavLink
                to={`/write`}
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border-b-2 border-current"
                    : "px-2 py-1 "
                }
              >
                Write
              </NavLink>
            )}
            {auth.isLoggedIn && auth.user.isAdmin === 1 && (
              <NavLink
                to={`/users`}
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border-b-2 border-current"
                    : "px-2 py-1 "
                }
              >
                Users
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
        {!auth.isLoggedIn && (
          <NavDropdown
            title="Authentication"
            id="basic-nav-dropdown"
            className="mr-5"
          >
            <NavLink to={`/signup`} className="w-full inline-block py-1 px-3">
              Sign Up
            </NavLink>
            <NavDropdown.Divider />
            <NavLink to={`/login`} className="w-full inline-block py-1 px-3">
              Login
            </NavLink>
          </NavDropdown>
        )}
        {auth.isLoggedIn && (
          <div className="flex items-center gap-1 mr-5">
            <p className="mr-2">
              Hi,
              <span className="font-semibold"> {auth.user.name}</span>
            </p>
            <div className="relative inline-block mr-4">
              <img
                src={auth.user.image || "/noavatar.png"}
                width={30}
                height={30}
                className="object-cover rounded-full aspect-square border-white border-1"
              />
              {auth.user.isAdmin === 1 && (
                <img
                  width={12}
                  height={12}
                  src="/crown.png"
                  alt="crown image"
                  className="absolute top-[-10px] left-1/2 transform -translate-x-1/2"
                />
              )}
            </div>
            <button className="p-2 text-red-600" onClick={logout}>
              Logout
            </button>
          </div>
        )}
        <ThemeToggle />
      </Container>
    </Navbar>
  );
};

export default NavBar;
