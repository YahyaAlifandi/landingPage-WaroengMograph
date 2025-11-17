import { useEffect, useRef } from "react";
import AboutUsSection from "../components/AboutUsSection";
import FooterSection from "../components/Footer";
import HeroSection from "../components/Hero";
import NavbarComponent from "../components/Navbar";
import ActivitiesSection from "../components/ProgramsSection";
import TeamSection from "../components/TeamSection";
import TestimonialsSection from "../components/Testimonial";

// Komponen halaman utama dengan smooth scrolling
export default function Index() {
  // Refs untuk setiap section
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const programsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Fungsi untuk smooth scroll ke section tertentu
  const scrollToSection = (sectionId: string) => {
    // Fixed type definition to handle null values
    const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {
      home: heroRef,
      about: aboutRef,
      programs: programsRef,
      testimonials: testimonialsRef,
      team: teamRef,
      contact: contactRef,
    };

    const ref = refs[sectionId];
    if (ref.current) {
      const offset = 80; // Offset untuk navbar fixed
      const elementPosition = ref.current.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle URL hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        // Delay sedikit untuk memastikan semua komponen sudah ter-render
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update URL hash saat scroll (optional)
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "home", ref: heroRef },
        { id: "about", ref: aboutRef },
        { id: "programs", ref: programsRef },
        { id: "testimonials", ref: testimonialsRef },
        { id: "team", ref: teamRef },
        { id: "contact", ref: contactRef },
      ];

      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            if (window.location.hash !== `#${section.id}`) {
              window.history.pushState(null, "", `#${section.id}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <NavbarComponent />
      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="min-h-screen"
      >
        <HeroSection />
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="scroll-mt-20"
      >
        <AboutUsSection />
      </section>

      {/* Programs/Activities Section */}
      <section
        id="programs"
        ref={programsRef}
        className="scroll-mt-20"
      >
        <ActivitiesSection />
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        ref={testimonialsRef}
        className="scroll-mt-20"
      >
        <TestimonialsSection />
      </section>

      {/* Team Section */}
      <section
        id="team"
        ref={teamRef}
        className="scroll-mt-20"
      >
        <TeamSection />
      </section>

      {/* Contact Section (dalam footer) */}
      <section
        id="contact"
        ref={contactRef}
        className="scroll-mt-20"
      >
        <FooterSection />
      </section>
    </>
  );
}