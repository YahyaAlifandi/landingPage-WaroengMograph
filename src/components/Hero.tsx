import { useState, useEffect, useCallback } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BiDiamond } from "react-icons/bi";
import { FaArrowRight, FaArrowDown } from "react-icons/fa";
import { cn } from "../lib/utils";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 4px 15px rgba(34, 197, 94, 0.2)",
  },
  tap: { scale: 0.95 },
};

// New Interactive Motion Shapes Component with mobile optimization
const InteractiveMotionShapes = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update mouse position (disabled on mobile for performance)
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isMobile) {
        mouseX.set(event.clientX / window.innerWidth - 0.5);
        mouseY.set(event.clientY / window.innerHeight - 0.5);
      }
    },
    [mouseX, mouseY, isMobile]
  );

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [handleMouseMove, isMobile]);

  // Parallax effect for shapes (simplified on mobile)
  const translateX1 = useTransform(
    mouseX,
    [-0.5, 0.5],
    isMobile ? [-20, 20] : [-50, 50]
  );
  const translateY1 = useTransform(
    mouseY,
    [-0.5, 0.5],
    isMobile ? [-20, 20] : [-50, 50]
  );
  const translateX2 = useTransform(
    mouseX,
    [-0.5, 0.5],
    isMobile ? [15, -15] : [30, -30]
  );
  const translateY2 = useTransform(
    mouseY,
    [-0.5, 0.5],
    isMobile ? [15, -15] : [30, -30]
  );

  // Don't render complex animations on mobile for performance
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-8 h-8 bg-green-200/20 rounded-full left-1/4 top-1/4"></div>
        <div className="absolute w-6 h-6 bg-green-300/15 rounded-full right-1/4 bottom-1/4"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <motion.div
        className="absolute w-16 h-16 bg-green-200/30 rounded-full"
        style={{ x: translateX1, y: translateY1 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-12 h-12 bg-green-300/20 rounded-full left-1/4 top-3/4"
        style={{ x: translateX2, y: translateY2 }}
        animate={{ scale: [1, 0.8, 1], rotate: [360, 180, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function HeroSection() {
  // State for button loading
  const [isLoading, setIsLoading] = useState(false);

  // Intersection Observer for triggering animations
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Trigger animations when section is in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Handle CTA button click
  const handleGetStarted = () => {
    setIsLoading(true);
    // Simulate async action (e.g., API call or navigation)
    setTimeout(() => {
      setIsLoading(false);
      // window.location.href = "/services";
    }, 1000);
  };

  // Handle secondary button click
  const handleExplore = () => {
    // Example: navigate to about page
    // window.location.href = "/about";
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 p-4 sm:p-6 md:p-10"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)]"></div>
      </div>

      {/* Interactive Motion Shapes */}
      <InteractiveMotionShapes />

      {/* Main Content */}
      <motion.div
        className="z-10 flex flex-col items-center text-center w-full max-w-6xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Brand Badge - Smaller on mobile */}
        <motion.div
          variants={itemVariants}
          className="mb-4 sm:mb-6 flex items-center rounded-full border border-green-300 bg-green-300/20 p-1.5 sm:p-2"
        >
          <div className="rounded-full border border-green-300 bg-green-300 p-2 sm:p-3">
            <BiDiamond
              className="size-4 sm:size-5 text-white"
              aria-hidden="true"
            />
          </div>
          <h2 className="px-3 sm:px-5 text-lg sm:text-2xl font-semibold text-green-400">
            Waroeng Mograph
          </h2>
        </motion.div>

        {/* Hero Headline - Adjusted for mobile readability */}
        <motion.h1
          variants={itemVariants}
          className="mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-800 leading-tight"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
            Waroeng Mograph
          </span>
        </motion.h1>

        {/* Subheadline - Better spacing on mobile */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-3 sm:mt-4 max-w-xl text-base sm:text-lg text-gray-600 leading-relaxed"
        >
          Your one-stop solution for motion graphics. Transform your ideas into
          stunning visuals and animations with our expert services.
        </motion.p>

        {/* CTA Buttons - Full width on mobile */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleGetStarted}
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full bg-green-400 px-6 py-3 text-base sm:text-lg font-semibold text-white transition duration-300 w-full sm:w-auto",
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-green-500"
            )}
            aria-label="Get started with Waroeng Mograph services"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                Get Started <FaArrowRight className="ml-2" />
              </>
            )}
          </motion.button>

          {/* Secondary CTA Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleExplore}
            className="flex items-center justify-center gap-2 rounded-full border border-green-400 px-6 py-3 text-base sm:text-lg font-semibold text-green-400 hover:bg-green-50 transition duration-300 w-full sm:w-auto"
            aria-label="Explore Waroeng Mograph services"
          >
            Explore More <FaArrowDown className="ml-2" />
          </motion.button>
        </motion.div>

        {/* Social Proof - Better spacing on mobile */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-6 sm:gap-8 w-full"
        >
          <div className="flex flex-col items-center min-w-[80px]">
            <motion.span
              className="text-xl sm:text-2xl font-bold text-green-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              0
            </motion.span>
            <p className="text-xs sm:text-sm text-gray-500">Brands Trusted</p>
          </div>
          <div className="flex flex-col items-center min-w-[80px]">
            <motion.span
              className="text-xl sm:text-2xl font-bold text-green-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              50+
            </motion.span>
            <p className="text-xs sm:text-sm text-gray-500">
              Projects Completed
            </p>
          </div>
          <div className="flex flex-col items-center min-w-[80px]">
            <motion.span
              className="text-xl sm:text-2xl font-bold text-green-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              1
            </motion.span>
            <p className="text-xs sm:text-sm text-gray-500">
              Years of Experience
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-8 z-10 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          className="h-6 w-6 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </motion.div>
    </section>
  );
}
