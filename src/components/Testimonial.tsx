import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { FaQuoteLeft, FaStar, FaRegStar, FaFilter } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/navigation";

// Type definitions
interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rina Setiawan",
    role: "Desainer Motion",
    quote:
      "Gabung di Waroeng Mograph bikin aku makin jago bikin animasi! Komunitasnya suportif banget!",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    category: "designer",
  },
  {
    id: 2,
    name: "Adi Pratama",
    role: "Anggota Inti",
    quote:
      "Di sini aku belajar kolaborasi dan dapat inspirasi baru setiap hari. Waroeng Mograph luar biasa!",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    category: "member",
  },
  {
    id: 3,
    name: "Lia Sari",
    role: "Mentor",
    quote:
      "Mengajar di Waroeng Mograph membuatku bangga melihat perkembangan anggota. Tempat yang penuh semangat!",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    category: "mentor",
  },
  {
    id: 4,
    name: "Budi Santoso",
    role: "Motion Graphic Artist",
    quote:
      "Komunitas ini bener-bener rumah buat kreator. Banyak ilmu dan temen baru!",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    category: "designer",
  },
  {
    id: 5,
    name: "Maya Putri",
    role: "3D Artist",
    quote:
      "Waroeng Mograph membantu saya mengembangkan skill 3D dari nol hingga profesional. Sangat direkomendasikan!",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    category: "designer",
  },
  {
    id: 6,
    name: "Rizky Ahmad",
    role: "Video Editor",
    quote:
      "Workshop dan sharing session di sini sangat membantu karir saya. Komunitas yang sangat inspiratif!",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 5,
    category: "member",
  },
];

const categories: Category[] = [
  { id: "all", name: "Semua" },
  { id: "designer", name: "Desainer" },
  { id: "member", name: "Anggota" },
  { id: "mentor", name: "Mentor" },
];

const TestimonialsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const filteredTestimonials: Testimonial[] =
    activeFilter === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === activeFilter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 * i, duration: 0.3 }}
      >
        {i < rating ? (
          <FaStar className="text-amber-400 text-sm" />
        ) : (
          <FaRegStar className="text-gray-300 text-sm" />
        )}
      </motion.div>
    ));
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-linear-to-br from-gray-50 via-white to-green-50/30 relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 opacity-5">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fill-rule="evenodd">
            <g fill="#000000" fill-opacity="0.1">
              <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" />
            </g>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-400 to-green-500 rounded-2xl mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaQuoteLeft className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Member{" "}
            <span className="bg-linear-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Voice
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cerita dan pengalaman dari anggota komunitas Waroeng Mograph
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeFilter === category.id
                  ? "bg-linear-to-r from-green-400 to-green-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.id !== "all" && <FaFilter className="text-xs" />}
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Swiper Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-gray-300",
              bulletActiveClass: "!bg-green-500",
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="mySwiper pb-16"
          >
            {filteredTestimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  onHoverStart={() => setHoveredCard(testimonial.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`bg-white rounded-2xl p-7 mx-4 flex flex-col h-[380px] transition-all duration-300 ${
                    hoveredCard === testimonial.id ? "shadow-2xl" : ""
                  }`}
                  style={{
                    border: "1px solid rgba(0,0,0,0.05)",
                    background:
                      hoveredCard === testimonial.id
                        ? "linear-gradient(to bottom right, #ffffff, #f9fafb)"
                        : "#ffffff",
                  }}
                >
                  {/* Avatar and Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <FaQuoteLeft className="text-white text-xs" />
                        </motion.div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="grow flex items-center">
                    <p className="text-gray-600 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-1 w-20 bg-linear-to-r from-green-400 to-green-500 rounded-full"></div>
                    <motion.div
                      className="text-gray-400 text-xs"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaQuoteLeft />
                    </motion.div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
