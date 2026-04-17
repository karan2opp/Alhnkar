import { useUIStore } from "../store/useUIStore";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
export default function Navbar() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-bg text-text px-6 py-4 border-b border-primary/20">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-primary">
          ALHANKAR
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm tracking-wide">
          <li className="cursor-pointer hover:text-primary">Home</li>
          <li className="cursor-pointer hover:text-primary">Category</li>
          <li className="cursor-pointer hover:text-primary">Products</li>
          <li className="cursor-pointer hover:text-primary">About Us</li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">

          {/* Search */}
          <div className="relative">
            <Search className="cursor-pointer" onClick={toggleSearch} />

            <input
              type="text"
              placeholder="Search..."
              className={`absolute right-7 top-0 transition-all duration-300 
              ${isSearchOpen ? "w-48 opacity-100" : "w-0 opacity-0"} 
              px-3 py-1 border border-primary/30 rounded bg-surface text-text outline-none`}
            />
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <ShoppingBag />
            <span className="absolute -top-2 -right-2 bg-primary text-bg text-xs px-1 rounded-full">
              2
            </span>
          </div>

          {/* Profile */}
          <User className="cursor-pointer" />

          {/* Mobile Toggle */}
          {menuOpen ? (
            <X className="md:hidden cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <Menu className="md:hidden cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm">
          <span>Home</span>
          <span>Category</span>
          <span>Products</span>
          <span>About Us</span>
        </div>
      )}
    </nav>
  );
}