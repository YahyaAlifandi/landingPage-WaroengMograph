import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion"; // For animations
import { useInView } from "react-intersection-observer"; // For scroll-triggered animations
import { FaChalkboardTeacher, FaUsers, FaLaptopCode, FaPodcast } from "react-icons/fa"; // Icons for activities

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
};

// Activity data
const activities = [
  {
    icon: <FaChalkboardTeacher className="text-green-400 text-4xl" aria-hidden="true" />,
    title: "Workshops & Training",
    description:
      "Join our hands-on workshops to master motion graphics techniques, led by industry experts.",
  },
  {
    icon: <FaUsers className="text-green-400 text-4xl" aria-hidden="true" />,
    title: "Monthly Meetups",
    description:
      "Connect with fellow creatives at our regular events to share ideas and network.",
  },
  {
    icon: <FaLaptopCode className="text-green-400 text-4xl" aria-hidden="true" />,
    title: "Collaborative Projects",
    description:
      "Work together on exciting group projects to showcase your skills and creativity.",
  },
  {
    icon: <FaPodcast className="text-green-400 text-4xl" aria-hidden="true" />,
    title: "Educational Content",
    description:
      "Access podcasts, videos, and articles to stay updated on motion graphics trends.",
  },
];

export default function ActivitiesSection() {
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

  return (
    <section
      ref={ref}
      id="program"
      className="bg-white py-16 px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-12"
        >
          <motion.h2
            variants={cardVariants}
            className="text-4xl sm:text-5xl font-bold text-gray-800"
          >
            Kegiatan & Program
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Explore our vibrant community activities designed to inspire, educate, and connect motion graphics enthusiasts.
          </motion.p>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:bg-green-50/50 transition-colors duration-300"
            >
              <div className="mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{activity.title}</h3>
              <p className="text-gray-600 text-sm">{activity.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}