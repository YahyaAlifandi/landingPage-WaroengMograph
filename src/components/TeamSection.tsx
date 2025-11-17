import { useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { useRef } from "react";

// Type definition for team members
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

// Team data
const team: TeamMember[] = [
  {
    id: 1,
    name: "Yahya Alifandi",
    role: "Programmer Komunitas",
    image: "https://i.pravatar.cc/150?img=11",
    social: {
      instagram: "#",
      linkedin: "#",
      email: "yahya@waroengmograph.com",
    },
  },
  {
    id: 2,
    name: "Aulia Putri",
    role: "Wakil Ketua",
    image: "https://i.pravatar.cc/150?img=12",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Rafi Pratama",
    role: "Koordinator Media",
    image: "https://i.pravatar.cc/150?img=13",
    social: {
      instagram: "#",
      github: "#",
    },
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    role: "Divisi Kreatif",
    image: "https://i.pravatar.cc/150?img=14",
    social: {
      instagram: "#",
      email: "siti@waroengmograph.com",
    },
  },
  {
    id: 5,
    name: "Budi Santoso",
    role: "Divisi Teknis",
    image: "https://i.pravatar.cc/150?img=15",
    social: {
      github: "#",
      linkedin: "#",
    },
  },
  {
    id: 6,
    name: "Maya Anggraini",
    role: "Divisi Desain",
    image: "https://i.pravatar.cc/150?img=16",
    social: {
      instagram: "#",
      email: "maya@waroengmograph.com",
    },
  },
  {
    id: 7,
    name: "Rizki Ahmad",
    role: "Divisi Animasi",
    image: "https://i.pravatar.cc/150?img=17",
    social: {
      instagram: "#",
      github: "#",
    },
  },
  {
    id: 8,
    name: "Dewi Lestari",
    role: "Divisi Marketing",
    image: "https://i.pravatar.cc/150?img=18",
    social: {
      linkedin: "#",
      email: "dewi@waroengmograph.com",
    },
  },
];

const TeamSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="team"
      ref={ref}
      className="bg-white py-16 px-6 lg:px-20 overflow-hidden"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tim Pengurus Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami adalah tim yang berdedikasi untuk mengembangkan komunitas kreatif dan mendukung setiap anggota dalam berkarya.
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredMember(member.id)}
              onHoverEnd={() => setHoveredMember(null)}
              className="bg-white rounded-xl p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl"
            >
              {/* Profile Image */}
              <div className="relative mx-auto mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover shadow-md mx-auto border-4 border-green-100"
                />
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full bg-green-500/20 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredMember === member.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Name and Role */}
              <h3 className="text-lg font-semibold text-center text-green-800 mt-4">
                {member.name}
              </h3>
              <p className="text-sm text-center text-green-600 mb-4">
                {member.role}
              </p>

              {/* Social Media Icons */}
              <div className="flex justify-center space-x-3">
                {member.social?.instagram && (
                  <motion.a
                    href={member.social.instagram}
                    aria-label="Instagram"
                    className="text-green-500 hover:text-green-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaInstagram size={18} />
                  </motion.a>
                )}
                {member.social?.linkedin && (
                  <motion.a
                    href={member.social.linkedin}
                    aria-label="LinkedIn"
                    className="text-green-500 hover:text-green-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaLinkedin size={18} />
                  </motion.a>
                )}
                {member.social?.github && (
                  <motion.a
                    href={member.social.github}
                    aria-label="GitHub"
                    className="text-green-500 hover:text-green-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaGithub size={18} />
                  </motion.a>
                )}
                {member.social?.email && (
                  <motion.a
                    href={`mailto:${member.social.email}`}
                    aria-label="Email"
                    className="text-green-500 hover:text-green-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEnvelope size={18} />
                  </motion.a>
                )}
              </div>

              {/* Decorative Element */}
              <div className="mt-4 flex justify-center">
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-green-300 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredMember === member.id ? "80px" : "0px" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            Tertarik bergabung dengan tim kami?
          </p>
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hubungi Kami
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;