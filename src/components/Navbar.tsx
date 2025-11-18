import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaInfoCircle,
  FaCogs,
  FaEnvelope,
  FaArrowRight,
  FaTimes,
  FaBars,
  FaUsers,
  FaQuoteLeft,
  FaCalendarAlt,
  FaDownload,
  FaChevronDown,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function NavbarComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("#home");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileEventDropdownOpen, setMobileEventDropdownOpen] = useState(false);
  const location = useLocation();
  // @ts-ignore
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll to toggle backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Debounce scroll handler to prevent excessive updates
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        // Update active menu based on scroll position
        const sections = [
          { id: "home", ref: document.getElementById("home") },
          { id: "about", ref: document.getElementById("about") },
          { id: "programs", ref: document.getElementById("programs") },
          { id: "testimonials", ref: document.getElementById("testimonials") },
          { id: "team", ref: document.getElementById("team") },
          { id: "contact", ref: document.getElementById("contact") },
        ];

        const scrollPosition = window.scrollY + 150; // Offset for navbar

        // Find the section that's currently in view
        let currentSection = "#home"; // Default to home
        let minDistance = Infinity;

        for (const section of sections) {
          if (section.ref) {
            //@ts-ignore
            const { offsetTop, offsetHeight } = section.ref;
            const distance = Math.abs(scrollPosition - offsetTop);
            
            // Find the section with the minimum distance to the current scroll position
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = `#${section.id}`;
            }
          }
        }

        // Only update if the section has actually changed
        if (activeMenu !== currentSection) {
          setActiveMenu(currentSection);
        }
      }, 50); // 50ms debounce
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeMenu]);

  // Update active menu when location hash changes
  useEffect(() => {
    if (location.hash) {
      setActiveMenu(location.hash);
    } else {
      setActiveMenu("#home");
    }
  }, [location]);

  // Fungsi untuk smooth scroll ke section dengan perbaikan active state
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // Mencegah default anchor behavior
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    // Close dropdown if open
    if (activeDropdown) {
      setActiveDropdown(null);
    }

    // Update active menu immediately
    setActiveMenu(href);
    
    // Get target element
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Calculate offset for fixed navbar
      const offset = 100; // Adjust based on navbar height
      const elementPosition = targetElement.offsetTop - offset;
      
      // Smooth scroll
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      
      // Update URL hash
      window.history.pushState(null, "", href);
    }
  }, [isMobileMenuOpen, activeDropdown]);

  // Fungsi untuk navigasi ke halaman berbeda (untuk Free Preset)
  const navigateToPage = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // Mencegah default anchor behavior
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    // Close dropdown if open
    if (activeDropdown) {
      setActiveDropdown(null);
    }

    // Update active menu immediately
    setActiveMenu(href);
    
    // Navigate to the page
    window.location.href = href;
  }, [isMobileMenuOpen, activeDropdown]);

  // Event dropdown items dengan warna ikon
  const eventDropdownItems = [
    { name: "Free Preset", href: "/event/free-preset", icon: FaDownload, color: "text-purple-500" },
  ];

  // Menu items yang disesuaikan dengan section yang ada
  const menuItems = [
    { name: "Home", href: "#home", icon: FaHome, color: "text-gray-600" },
    { name: "About", href: "#about", icon: FaInfoCircle, color: "text-gray-600" },
    { name: "Programs", href: "#programs", icon: FaCogs, color: "text-gray-600" },
    { name: "Testimonials", href: "#testimonials", icon: FaQuoteLeft, color: "text-gray-600" },
    { name: "Team", href: "#team", icon: FaUsers, color: "text-gray-600" },
    { name: "Contact", href: "#contact", icon: FaEnvelope, color: "text-gray-600" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg shadow-gray-400/10 w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7xl rounded-full mt-5"
            : "bg-white w-full"
        }`}
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-2 text-green-500"
            >
              <div className="w-15 h-15 -my-5 flex items-center justify-center">
                <img src="/image/warmog_logo.png" alt="" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                Waroeng Mograph
              </span>
            </motion.div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.href;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-green-400 to-green-500 shadow-md"
                        : `${item.color} hover:text-green-500 hover:bg-green-50`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="mr-2 text-sm" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </motion.a>
                );
              })}
              
              {/* Event Dropdown - Desktop dengan Tooltip Style */}
              <div className="relative">
                <motion.button
                  onMouseEnter={() => setActiveDropdown("event")}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-green-500 hover:bg-green-50`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCalendarAlt className="mr-2 text-sm text-orange-500" />
                  <span className="text-sm font-medium">Event</span>
                  <FaChevronDown className="ml-1 text-xs transition-transform duration-200" 
                    style={{ 
                      transform: activeDropdown === "event" ? "rotate(180deg)" : "rotate(0deg)" 
                    }} 
                  />
                </motion.button>
                
                <AnimatePresence>
                  {activeDropdown === "event" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onMouseEnter={() => setActiveDropdown("event")}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* Tooltip Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                      
                      {/* Dropdown Content */}
                      <div className="relative bg-white rounded-2xl p-2">
                        {eventDropdownItems.map((item, index) => {
                          const Icon = item.icon;
                          const isExternalLink = item.href.startsWith("/");
                          return (
                            <motion.a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                // Close dropdown
                                setActiveDropdown(null);
                                
                                // Update active menu immediately
                                setActiveMenu(item.href);
                                
                                // Use different navigation function based on link type
                                if (isExternalLink) {
                                  navigateToPage(e, item.href);
                                } else {
                                  scrollToSection(e, item.href);
                                }
                              }}
                              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r ${
                                index === 0 ? "hover:from-purple-50 hover:to-purple-100" :
                                index === 1 ? "hover:from-blue-50 hover:to-blue-100" :
                                index === 2 ? "hover:from-red-50 hover:to-red-100" :
                                "hover:from-orange-50 hover:to-orange-100"
                              } group`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                                index === 0 ? "bg-purple-100" :
                                index === 1 ? "bg-blue-100" :
                                index === 2 ? "bg-red-100" :
                                "bg-orange-100"
                              }`}>
                                <Icon className={`text-sm ${
                                  index === 0 ? "text-purple-500" :
                                  index === 1 ? "text-blue-500" :
                                  index === 2 ? "text-red-500" :
                                  "text-orange-500"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                  {item.name}
                                </span>
                                <div className="text-xs text-gray-500">
                                  {index === 0 ? "Download free assets" :
                                   index === 1 ? "Join our workshops" :
                                   index === 2 ? "Watch live sessions" :
                                   "Participate now"}
                                </div>
                              </div>
                            </motion.a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button with Dropdown */}
            <div className="md:hidden relative">
              <motion.button
                onClick={toggleMobileMenu}
                className="text-green-500 focus:outline-none p-2"
                whileTap={{ scale: 0.9 }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </motion.button>

              {/* Mobile Menu Dropdown */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-5 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="space-y-2">
                        {menuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeMenu === item.href;
                          return (
                            <motion.a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                
                                // Update active menu immediately
                                setActiveMenu(item.href);
                                
                                // Get target element
                                const targetId = item.href.replace("#", "");
                                const targetElement = document.getElementById(targetId);
                                
                                if (targetElement) {
                                  const offset = 100;
                                  const elementPosition = targetElement.offsetTop - offset;
                                  
                                  window.scrollTo({
                                    top: elementPosition,
                                    behavior: "smooth",
                                  });
                                  
                                  window.history.pushState(null, "", item.href);
                                }
                                
                                setIsMobileMenuOpen(false);
                              }}
                              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive
                                  ? "text-green-500 bg-green-50 border-l-4 border-green-500"
                                  : "text-gray-600 hover:text-green-500 hover:bg-green-50"
                              }`}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon className="mr-3 text-lg" />
                              <span className="text-base font-medium">{item.name}</span>
                            </motion.a>
                          );
                        })}
                        
                        {/* Event Dropdown - Mobile */}
                        <div className="pt-2 pb-1">
                          <motion.button
                            onClick={() => setMobileEventDropdownOpen(!mobileEventDropdownOpen)}
                            className="flex items-center px-4 py-2 text-orange-500 font-medium w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaCalendarAlt className="mr-2" />
                            <span>Event</span>
                            <FaChevronDown className="ml-auto text-xs transition-transform duration-200" 
                              style={{ 
                                transform: mobileEventDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" 
                              }} 
                            />
                          </motion.button>
                          
                          <AnimatePresence>
                            {mobileEventDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="pl-4 pr-2 py-1 space-y-1 overflow-hidden"
                              >
                                {eventDropdownItems.map((item, index) => {
                                  const Icon = item.icon;
                                  const isExternalLink = item.href.startsWith("/");
                                  return (
                                    <motion.a
                                      key={item.name}
                                      href={item.href}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        
                                        // Update active menu immediately
                                        setActiveMenu(item.href);
                                        
                                        // Use different navigation function based on link type
                                        if (isExternalLink) {
                                          navigateToPage(e, item.href);
                                        } else {
                                          // Get target element
                                          const targetId = item.href.replace("#", "");
                                          const targetElement = document.getElementById(targetId);
                                          
                                          if (targetElement) {
                                            const offset = 100;
                                            const elementPosition = targetElement.offsetTop - offset;
                                            
                                            window.scrollTo({
                                              top: elementPosition,
                                              behavior: "smooth",
                                            });
                                          
                                            window.history.pushState(null, "", item.href);
                                          }
                                        }
                                        
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className="flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-gray-600 hover:text-green-500 hover:bg-green-50"
                                      whileHover={{ scale: 1.02, x: 3 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${
                                        index === 0 ? "bg-purple-100" :
                                        index === 1 ? "bg-blue-100" :
                                        index === 2 ? "bg-red-100" :
                                        "bg-orange-100"
                                      }`}>
                                        <Icon className={`text-xs ${
                                          index === 0 ? "text-purple-500" :
                                          index === 1 ? "text-blue-500" :
                                          index === 2 ? "text-red-500" :
                                          "text-orange-500"
                                        }`} />
                                      </div>
                                      <span className="text-sm">{item.name}</span>
                                    </motion.a>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          
                          // Update active menu immediately
                          setActiveMenu("#about");
                          
                          // Scroll to contact section
                          const AboutElement = document.getElementById("about");
                          if (AboutElement) {
                            const offset = 100;
                            const elementPosition = AboutElement.offsetTop - offset;
                            window.scrollTo({
                              top: elementPosition,
                              behavior: "smooth",
                            });
                            window.history.pushState(null, "", "#about");
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 mt-4 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex gap-2 items-center">
                          Explore <FaArrowRight className="ml-2" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explore Button - Desktop */}
            <motion.button
              type="button"
              onClick={() => {
                // Update active menu immediately
                setActiveMenu("#about");
                
                // Scroll to contact section
                const contactElement = document.getElementById("about");
                if (contactElement) {
                  const offset = 100;
                  const elementPosition = contactElement.offsetTop - offset;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: "smooth",
                  });
                  window.history.pushState(null, "", "#about");
                }
              }}
              className={`hidden md:flex items-center bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold px-6 py-2.5 transition-all duration-300 shadow-lg ${
                isScrolled ? "rounded-full" : "rounded-lg"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex gap-2 items-center">
                Explore <FaArrowRight className="ml-2" />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}