import { motion, type Variants } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaTiktok,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-green-950 text-green-300">
      <div className="container mx-auto px-6 lg:px-16 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Kolom 1: Brand / Identitas */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-15 h-15 -my-5 flex items-center justify-center">
                <img src="/image/warmog_logo.png" className="filter brightness-0 invert" alt="" />
              </div>
              <h3 className="text-xl font-bold text-white">Waroeng Mograph</h3>
            </div>
            <p className="text-green-300 text-sm leading-relaxed">
              Waroeng Mograph adalah komunitas kreatif yang fokus mengembangkan bakat dalam dunia motion graphics dan animasi.
            </p>
          </motion.div>

          {/* Kolom 2: Navigasi Cepat */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navigasi</h3>
            <ul className="space-y-2">
              {["Home", "About", "Programs", "Testimonials", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-green-300 hover:text-green-400 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Kolom 3: Media Sosial */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ikuti Kami</h3>
            <div className="flex space-x-4 mt-4">
              {[
                { icon: FaInstagram, label: "Instagram" },
                { icon: FaYoutube, label: "YouTube" },
                { icon: FaDiscord, label: "Discord" },
                { icon: FaTiktok, label: "TikTok" },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-green-300 hover:text-green-400 transition-transform transform hover:scale-110"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Kolom 4: Kontak */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-400 mt-1" />
                <span className="text-sm">Bandung, Indonesia</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-green-400" />
                <span className="text-sm">waroengmograph@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-green-400" />
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-green-800 mt-10 pt-4"
        >
          <p className="text-green-500 text-sm text-center">
            © {currentYear} Waroeng Mograph. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;