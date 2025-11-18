import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaTimesCircle,
} from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //@ts-ignore
  const [cartCount, setCartCount] = useState(3);
  //@ts-ignore
  const [wishlistCount, setWishlistCount] = useState(7);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close search and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search logic here
  };

  // Animation variants for header
  const headerVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 20, duration: 0.5 },
    },
  };

  // Animation variants for child elements
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20, duration: 0.4 },
    },
  };

  // Animation variants for dropdown
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.3 },
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <motion.header
      className="bg-white fixed top-0 w-full z-50 border-b border-gray-100 shadow-sm"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1400px]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo/Title */}
          <motion.div
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            variants={itemVariants}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-400 rounded-lg flex items-center justify-center shadow-md">
              <FaCamera className="text-white text-base sm:text-lg" />
            </div>
            <div className="flex flex-col">
              <h1
                className="text-lg sm:text-xl font-semibold text-gray-800"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Free Preset
              </h1>
              <p
                className="text-xs sm:text-sm font-light text-gray-600 -mt-0.5"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Creative Filters
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            ref={searchInputRef}
            className={`relative w-full sm:w-64 lg:w-80 order-3 sm:order-none mt-2 sm:mt-0 transition-all duration-300 ${
              isSearchOpen ? "sm:w-80" : "sm:w-64"
            }`}
            variants={itemVariants}
          >
            <motion.form
              className="flex items-center bg-gray-50 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-opacity-50 transition-all duration-200"
              onSubmit={handleSearch}
            >
              <div className="flex items-center flex-1">
                <span className="text-green-500 pl-3 sm:pl-4">
                  <FaSearch className="text-base sm:text-lg" />
                </span>
                <input
                  type="text"
                  placeholder="Cari preset..."
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2 sm:px-3 py-2 text-sm sm:text-base font-light"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  aria-label="Search for presets"
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 pr-3 sm:pr-4"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                      searchInputRef.current?.focus();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Clear search"
                  >
                    <FaTimesCircle className="text-base sm:text-lg" />
                  </motion.button>
                )}
              </div>
              <motion.button
                type="submit"
                className="text-green-500 hover:text-green-600 bg-green-100 bg-opacity-40 px-3 sm:px-4 py-2 rounded-r-full transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Submit search"
              >
                <FaSearch className="text-base sm:text-lg" />
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Right Actions */}
          <motion.div
            className="flex items-center space-x-3 sm:space-x-4"
            variants={itemVariants}
          >
            {/* Wishlist */}
            <motion.button
              className="relative text-green-600 hover:text-green-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Wishlist"
            >
              <FaHeart className="text-lg sm:text-xl" />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              className="relative text-green-600 hover:text-green-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Cart"
            >
              <FaShoppingCart className="text-lg sm:text-xl" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Menu Button */}
            <div ref={menuRef} className="relative">
              <motion.button
                className="text-green-600 hover:text-green-700 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-lg sm:text-xl" />
                ) : (
                  <FaBars className="text-lg sm:text-xl" />
                )}
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-60 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden sm:max-h-[calc(100vh-80px)] sm:overflow-y-auto"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <nav className="py-2 text-sm sm:text-base">
                      {[
                        "Home",
                        "Preset Gratis",
                        "Workshop",
                        "Kompetisi",
                        "Akun Saya",
                        "Keranjang",
                      ].map((item) => (
                        <motion.a
                          key={item}
                          href="#"
                          className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          whileHover={{ x: 5 }}
                        >
                          {item}
                        </motion.a>
                      ))}
                      <div className="border-t border-gray-100 my-2" />
                      <motion.a
                        href="#"
                        className="block px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        Keluar
                      </motion.a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}