import { useUIStore } from "../store/useUIStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const { isLoggedIn, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);
  const [searchText, setSearchText] =
    useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (
      e.key === "Enter" &&
      searchText.trim()
    ) {
      navigate(
        `/search?title=${searchText}`
      );

      setSearchText("");
      toggleSearch();
    }
  };

  return (
    <nav className="bg-bg text-text px-6 py-4 border-b border-primary/20">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-primary">
          ALHANKAR
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm tracking-wide">
          <li>
            <Link
              to="/"
              className="cursor-pointer hover:text-primary"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/category"
              className="cursor-pointer hover:text-primary"
            >
              Category
            </Link>
          </li>

          <li>
            <Link
              to="/product"
              className="cursor-pointer hover:text-primary"
            >
              Products
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="cursor-pointer hover:text-primary"
            >
              About Us
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">

          {/* Search */}
          <div className="relative">
            <Search
              className="cursor-pointer"
              onClick={toggleSearch}
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              onKeyDown={handleSearch}
              placeholder="Search..."
              className={`absolute right-7 top-0 transition-all duration-300
              ${
                isSearchOpen
                  ? "w-48 opacity-100"
                  : "w-0 opacity-0"
              }
              px-3 py-1 border border-primary/30 rounded
              bg-surface text-text outline-none`}
            />
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <Link to="/cart">
              <ShoppingBag />

              <span className="absolute -top-2 -right-2 bg-primary text-bg text-xs px-1 rounded-full">
                2
              </span>
            </Link>
          </div>

          {/* Profile Hamburger */}
          <div className="relative hidden md:block">
            <button
              onClick={() =>
                setProfileMenuOpen(
                  !profileMenuOpen
                )
              }
              className="cursor-pointer"
            >
              <Menu />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-surface border border-primary/20 rounded-lg shadow-lg p-3 z-50">
                <Link to="/profile">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 rounded">
                    Profile
                  </button>
                </Link>

                <Link to="/my-orders">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 rounded">
                    My Orders
                  </button>
                </Link>

                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-sm hover:bg-primary/10 rounded"
                      onClick={() =>
                        setProfileMenuOpen(
                          false
                        )
                      }
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-sm hover:bg-primary/10 rounded"
                      onClick={() =>
                        setProfileMenuOpen(
                          false
                        )
                      }
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(
                        false
                      );
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 rounded"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          {menuOpen ? (
            <X
              className="md:hidden cursor-pointer"
              onClick={() =>
                setMenuOpen(false)
              }
            />
          ) : (
            <Menu
              className="md:hidden cursor-pointer"
              onClick={() =>
                setMenuOpen(true)
              }
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm">
          <Link to="/">Home</Link>
          <Link to="/category">
            Category
          </Link>
          <Link to="/product">
            Products
          </Link>
          <Link to="/about">
            About Us
          </Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}