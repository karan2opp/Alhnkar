import { useUIStore } from "../store/useUIStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore"; // ✅ Import cart store
import {
  Search,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react"; // ✅ Added useEffect
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";

export default function Navbar() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const { isLoggedIn, logout } = useAuthStore();
  const { cartItems, loading: cartLoading, fetchUserCart } = useCartStore(); // ✅ Get cart state

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch cart when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn, fetchUserCart]);

  // ✅ Calculate total quantity in cart (handles multiple items + quantities)
  const cartCount = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      navigate(`/search?title=${searchText}`);
      setSearchText("");
      toggleSearch();
    }
  };

  // ✅ Mobile logout handler
  const handleMobileLogout = () => {
    logout();
    setMenuOpen(false);
    showToast.success("Logged out successfully", "Goodbye!", 2000);
    
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

          {/* ✅ Cart - Dynamic Count from Backend */}
          <div className="relative cursor-pointer">
            <Link to="/cart">
              <ShoppingBag />
              
              {/* ✅ Show badge only if cart has items */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-bg text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartLoading ? "…" : cartCount}
                </span>
              )}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm pb-4 border-b border-primary/10">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/category" onClick={() => setMenuOpen(false)}>Category</Link>
          <Link to="/product" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          
          {/* Conditional Auth Links for Mobile */}
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
              {/* Mobile Logout Button */}
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