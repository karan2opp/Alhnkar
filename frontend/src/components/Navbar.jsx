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
import { showToast } from "../utils/showToast"; // ✅ Import toast utility

export default function Navbar() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const { isLoggedIn, logout } = useAuthStore(); // ✅ logout from store

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      navigate(`/search?title=${searchText}`);
      setSearchText("");
      toggleSearch();
    }
  };

  // ✅ Mobile logout handler
  const handleMobileLogout = () => {
    logout(); // Clear auth state
    setMenuOpen(false); // Close mobile menu
    showToast.success("Logged out successfully", "Goodbye!", 2000);
    
    // Redirect after toast is visible
    setTimeout(() => {
      navigate("/");
    }, 1500);
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
            <Link to="/" className="cursor-pointer hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/category" className="cursor-pointer hover:text-primary">
              Category
            </Link>
          </li>
          <li>
            <Link to="/product" className="cursor-pointer hover:text-primary">
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" className="cursor-pointer hover:text-primary">
              About Us
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">

          {/* Search */}
          <div className="relative">
            <Search className="cursor-pointer" onClick={toggleSearch} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search..."
              className={`absolute right-7 top-0 transition-all duration-300
                ${isSearchOpen ? "w-48 opacity-100" : "w-0 opacity-0"}
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

          {/* Profile Hamburger (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-sm hover:bg-primary/10 rounded"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                      showToast.success("Logged out!", "", 2000);
                      setTimeout(() => navigate("/"), 1500);
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
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <Menu
              className="md:hidden cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* ✅ Mobile Menu - UPDATED WITH CONDITIONAL LOGOUT */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm pb-4 border-b border-primary/10">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/category" onClick={() => setMenuOpen(false)}>Category</Link>
          <Link to="/product" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          
          {/* ✅ Conditional Auth Links for Mobile */}
          {!isLoggedIn ? (
            <>
              <Link 
                to="/login" 
                className="text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/profile" 
                onClick={() => setMenuOpen(false)}
                className="hover:text-primary"
              >
                Profile
              </Link>
              <Link 
                to="/my-orders" 
                onClick={() => setMenuOpen(false)}
                className="hover:text-primary"
              >
                My Orders
              </Link>
              {/* ✅ Mobile Logout Button */}
              <button
                onClick={handleMobileLogout}
                className="text-left text-accent hover:opacity-80 font-medium transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}