import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion"; // For animations
import { useInView } from "react-intersection-observer"; // For scroll-triggered animations
import { FaUsers, FaLightbulb, FaBookOpen } from "react-icons/fa"; // Icons for values
import { MdVisibility, MdRocketLaunch } from "react-icons/md"; // Icons for vision/mission

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

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

export default function AboutSection() {
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
      className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Text Content */}
          <div className="space-y-8">
            {/* Section Title */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-gray-800"
            >
              About Our Community
            </motion.h2>

            {/* Introduction */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 max-w-xl"
            >
              Waroeng Mograph is a vibrant community of motion graphics enthusiasts, designers, and creators dedicated to pushing the boundaries of visual storytelling. Our mission is to inspire, educate, and connect creatives to bring their ideas to life through stunning animations.
            </motion.p>

            {/* Vision & Mission */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <MdVisibility className="text-green-400 text-3xl mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
                  <p className="text-gray-600">
                    To become a global hub for motion graphics innovation, fostering creativity and collaboration.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <MdRocketLaunch className="text-green-400 text-3xl mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
                  <p className="text-gray-600">
                    To empower creators with resources, workshops, and a supportive community to excel in motion design.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-800">
                Our Core Values
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-4 bg-green-100/50 rounded-lg"
                >
                  <FaUsers className="text-green-400 text-2xl mb-2" aria-hidden="true" />
                  <h4 className="text-lg font-medium text-gray-800">Collaboration</h4>
                  <p className="text-sm text-gray-600">
                    We thrive on shared ideas and teamwork to create extraordinary work.
                  </p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-4 bg-green-100/50 rounded-lg"
                >
                  <FaLightbulb className="text-green-400 text-2xl mb-2" aria-hidden="true" />
                  <h4 className="text-lg font-medium text-gray-800">Creativity</h4>
                  <p className="text-sm text-gray-600">
                    We celebrate bold ideas and innovative approaches to motion design.
                  </p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-4 bg-green-100/50 rounded-lg"
                >
                  <FaBookOpen className="text-green-400 text-2xl mb-2" aria-hidden="true" />
                  <h4 className="text-lg font-medium text-gray-800">Education</h4>
                  <p className="text-sm text-gray-600">
                    We empower members with knowledge through workshops and resources.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Brief History */}
            <motion.div variants={itemVariants} className="bg-green-200/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Story</h3>
              <p className="text-gray-600">
                Founded in 2015, Waroeng Mograph began as a small group of passionate animators in Jakarta. Inspired by the growing demand for motion graphics, we set out to create a community where creatives could learn, collaborate, and showcase their work. Today, we’re a thriving network of artists worldwide, united by a love for motion design.
              </p>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            variants={imageVariants}
            className="relative w-full h-96 lg:h-full rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src="/community-activities.jpg" // Replace with actual image
              alt="Waroeng Mograph community workshop"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-300/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}